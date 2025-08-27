import type React from "react";
import { useState } from "react";
import { useSchedulesQuery } from "../../hooks/schedules/useSchedulesQuery";
import {
  Typography,
  Box,
  Button,
  Autocomplete,
  TextField,
  MenuItem,
  Paper,
  Alert,
  Collapse,
  IconButton,
  useMediaQuery,
  Theme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import type { PageProps } from "../../App";
import { SchedulesTable } from "./schedulesTable";
import { AddScheduleModal } from "./addScheduleModal";
import { useCompanyMap } from "../../hooks/maps/useCompanyMap";
import { useBotMap } from "../../hooks/maps/useBotMap";
import { useChatMap } from "../../hooks/maps/useChatMap";
import { useAuth } from "../../context/authContext";
import { PageSkeleton } from "../../components/skeleton/pageSkeleton";
import { ResetFiltersButton } from "../../components/table/resetFiltersButton";
import { PaginationControls } from "../../components/table/paginationControls";
import { HelpTooltip } from "../../components/helpTooltip";
import { InfoCard } from "../../components/infoCard";
import { Schedule as ScheduleIcon } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import {
  setBotFilter,
  setCompanyFilter,
  setEnabledFilter,
  setStrategyFilter,
  setTypeFilter,
  setChatFilter,
  setNameFilter,
  setTargetChatFilter,
  setPage,
  setRowsPerPage,
  setSortField,
  setSortDirection,
  resetFilters,
} from "../../redux/slice/schedulesSlice";
import { useThemeMode } from "../../context/themeContext";

export const SchedulesPage: React.FC<PageProps> = ({ developerMode }) => {
  const theme = useThemeMode();
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );

  const dispatch = useDispatch();
  const { isSuperadmin } = useAuth();
  const { data, isLoading, error } = useSchedulesQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const {
    botFilter,
    companyFilter,
    enabledFilter,
    strategyFilter,
    typeFilter,
    chatFilter,
    nameFilter,
    targetChatFilter,
    page,
    rowsPerPage,
    sortField,
    sortDirection,
  } = useSelector((state: RootState) => state.schedules);

  const { companyMap, isLoadingCompanyMap } = useCompanyMap();
  const { botMap } = useBotMap();
  const { chatMap, isLoadingChatsMap } = useChatMap();

  const isLoadingAll = isLoading || isLoadingCompanyMap || isLoadingChatsMap;

  const resetAllFilters = () => {
    dispatch(resetFilters());
  };

  const bots = Array.from(
    new Set(data?.schedules.map((schedule) => schedule.bot_id.toString()) || [])
  ).map((botId) => ({
    id: botId,
    name: botMap.get(botId) || botId,
  }));

  const companies = Array.from(
    new Set(data?.schedules.map((schedule) => schedule.company_id) || [])
  ).map((companyId) => ({
    id: companyId,
    name: companyMap.get(companyId) || companyId,
  }));

  const chats = Array.from(
    new Set(
      data?.schedules
        .filter((schedule) => schedule.chat_id)
        .map((schedule) => schedule.chat_id?.toString()) || []
    )
  ).map((chatId) => ({
    id: chatId || "",
    name: chatId ? chatMap.get(Number(chatId)) || `Чат ${chatId}` : "",
  }));

  const targetChats = Array.from(
    new Set(
      data?.schedules
        .flatMap((schedule) => schedule.target_chats || [])
        .map((chatId) => chatId.toString()) || []
    )
  ).map((chatId) => ({
    id: chatId,
    name: chatMap.get(Number(chatId)) || `Чат ${chatId}`,
  }));

  const strategies = Array.from(
    new Set(data?.schedules.map((schedule) => schedule.schedule_strategy) || [])
  ).map((strategy) => ({
    value: strategy,
    label:
      strategy === "analysis"
        ? "Анализ чата"
        : strategy === "notification"
        ? "Уведомления"
        : strategy,
  }));

  const types = Array.from(
    new Set(data?.schedules.map((schedule) => schedule.schedule_type) || [])
  ).map((type) => ({
    value: type,
    label:
      type === "interval"
        ? "По интервалу"
        : type === "cron"
        ? "По расписанию"
        : type === "once"
        ? "Однократно"
        : type === "daily_time"
        ? "Ежедневно"
        : type,
  }));

  const getFilteredAndSortedSchedules = () => {
    if (!data?.schedules) return [];

    let filteredSchedules = [...data.schedules];

    if (nameFilter) {
      filteredSchedules = filteredSchedules.filter((schedule) =>
        schedule.schedule_name?.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }

    if (botFilter) {
      filteredSchedules = filteredSchedules.filter(
        (schedule) => schedule.bot_id.toString() === botFilter
      );
    }

    if (isSuperadmin && companyFilter) {
      filteredSchedules = filteredSchedules.filter(
        (schedule) => schedule.company_id === companyFilter
      );
    }

    if (enabledFilter !== "all") {
      filteredSchedules = filteredSchedules.filter(
        (schedule) => schedule.enabled === enabledFilter
      );
    }

    if (strategyFilter) {
      filteredSchedules = filteredSchedules.filter(
        (schedule) => schedule.schedule_strategy === strategyFilter
      );
    }

    if (typeFilter) {
      filteredSchedules = filteredSchedules.filter(
        (schedule) => schedule.schedule_type === typeFilter
      );
    }

    if (chatFilter) {
      filteredSchedules = filteredSchedules.filter(
        (schedule) => schedule.chat_id?.toString() === chatFilter
      );
    }

    if (targetChatFilter) {
      filteredSchedules = filteredSchedules.filter((schedule) =>
        schedule.target_chats?.includes(Number(targetChatFilter))
      );
    }

    filteredSchedules.sort((a, b) => {
      if (sortField === "bot_id") {
        const aBot = botMap.get(a.bot_id.toString()) ?? a.bot_id.toString();
        const bBot = botMap.get(b.bot_id.toString()) ?? b.bot_id.toString();
        if (aBot < bBot) return sortDirection === "asc" ? -1 : 1;
        if (aBot > bBot) return sortDirection === "asc" ? 1 : -1;
        return 0;
      }

      if (sortField === "company_id") {
        const aCompany = companyMap.get(a.company_id) ?? a.company_id;
        const bCompany = companyMap.get(b.company_id) ?? b.company_id;
        if (aCompany < bCompany) return sortDirection === "asc" ? -1 : 1;
        if (aCompany > bCompany) return sortDirection === "asc" ? 1 : -1;
        return 0;
      }

      if (sortField === "enabled") {
        if (a.enabled === b.enabled) return 0;
        if (sortDirection === "asc") {
          return a.enabled ? -1 : 1;
        } else {
          return a.enabled ? 1 : -1;
        }
      }

      if (sortField === "schedule_strategy") {
        const aStrategy = a.schedule_strategy;
        const bStrategy = b.schedule_strategy;
        if (aStrategy < bStrategy) return sortDirection === "asc" ? -1 : 1;
        if (aStrategy > bStrategy) return sortDirection === "asc" ? 1 : -1;
        return 0;
      }

      if (sortField === "schedule_type") {
        const aType = a.schedule_type;
        const bType = b.schedule_type;
        if (aType < bType) return sortDirection === "asc" ? -1 : 1;
        if (aType > bType) return sortDirection === "asc" ? 1 : -1;
        return 0;
      }

      if (sortField === "created_at") {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      }

      return 0;
    });

    return filteredSchedules;
  };

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      dispatch(setSortDirection(sortDirection === "asc" ? "desc" : "asc"));
    } else {
      dispatch(setSortField(field));
      dispatch(setSortDirection("asc"));
    }
  };

  const filteredSchedules = getFilteredAndSortedSchedules();
  const totalPages = Math.ceil(filteredSchedules.length / rowsPerPage);
  const paginatedSchedules = filteredSchedules.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  if (isLoadingAll) {
    return (
      <PageSkeleton filterCount={isSuperadmin ? 7 : 6} hasAddButton={true} />
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" mt={-1}>
        <Alert severity="error" sx={{ maxWidth: 600 }}>
          <Typography variant="h6" gutterBottom>
            Не удалось загрузить расписания
          </Typography>
          <Typography variant="body2">
            Произошла ошибка при загрузке данных: {(error as Error).message}
          </Typography>
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        pl: isMobile ? 1 : 2,
        pr: isMobile ? 1 : 2,
        mt: 1.75,
        mb: -2,
        maxWidth: 1600,
        mx: "auto",
      }}
    >
      <Paper
        elevation={1}
        sx={{
          p: isMobile ? 2 : 3,
          mb: 1,
          background: theme.isDarkMode
            ? "linear-gradient(135deg, #6366f1aa 0%, #8b5cf6aa 100%)"
            : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <ScheduleIcon sx={{ fontSize: isMobile ? 32 : 40 }} />
          <Box>
            <Typography
              variant={isMobile ? "h5" : "h4"}
              component="h1"
              gutterBottom
              sx={{ mb: 1, fontWeight: 600 }}
              color="white"
            >
              Расписания
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }} color="white">
              На этой странице вы можете управлять автоматическими задачами для
              анализа чатов и отправки уведомлений.
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Paper elevation={1} sx={{ p: isMobile ? 1 : 2, mb: 1 }}>
        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {isMobile ? (
            <>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton onClick={() => setFiltersOpen(!filtersOpen)}>
                  <SearchIcon />
                </IconButton>
                <ResetFiltersButton onClick={resetAllFilters} />
              </Box>
              <Box sx={{ flexGrow: 1 }} />
              <Button
                variant="contained"
                onClick={() => setIsModalOpen(true)}
                startIcon={<AddIcon />}
                size="small"
                sx={{
                  whiteSpace: "nowrap",
                  backgroundColor: "#7353ae",
                }}
              >
                Добавить
              </Button>
            </>
          ) : (
            <>
              <TextField
                label="Название"
                value={nameFilter}
                onChange={(e) => dispatch(setNameFilter(e.target.value))}
                variant="outlined"
                size="small"
                sx={{ width: 200 }}
              />

              <Autocomplete
                options={bots}
                getOptionLabel={(option) => option.name || option.id}
                value={bots.find((b) => b.id === botFilter) || null}
                onChange={(_, value) => dispatch(setBotFilter(value?.id || ""))}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Бот"
                    variant="outlined"
                    size="small"
                    sx={{ width: 200 }}
                  />
                )}
              />

              <Autocomplete
                options={chats}
                getOptionLabel={(option) => option.name || option.id}
                value={chats.find((c) => c.id === chatFilter) || null}
                onChange={(_, value) =>
                  dispatch(setChatFilter(value?.id || ""))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Анализируемый чат"
                    variant="outlined"
                    size="small"
                    sx={{ width: 200 }}
                  />
                )}
              />

              <Autocomplete
                options={targetChats}
                getOptionLabel={(option) => option.name || option.id}
                value={
                  targetChats.find((c) => c.id === targetChatFilter) || null
                }
                onChange={(_, value) =>
                  dispatch(setTargetChatFilter(value?.id || ""))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Куда отправлять"
                    variant="outlined"
                    size="small"
                    sx={{ width: 200 }}
                  />
                )}
              />

              <TextField
                select
                label="Тип задачи"
                value={strategyFilter}
                onChange={(e) => dispatch(setStrategyFilter(e.target.value))}
                variant="outlined"
                size="small"
                sx={{ width: 180 }}
              >
                <MenuItem value="">Все типы</MenuItem>
                {strategies.map((strategy) => (
                  <MenuItem key={strategy.value} value={strategy.value}>
                    {strategy.label}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Когда выполнять"
                value={typeFilter}
                onChange={(e) => dispatch(setTypeFilter(e.target.value))}
                variant="outlined"
                size="small"
                sx={{ width: 180 }}
              >
                <MenuItem value="">Все типы</MenuItem>
                {types.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Статус"
                value={enabledFilter}
                onChange={(e) =>
                  dispatch(
                    setEnabledFilter(
                      e.target.value === "all"
                        ? "all"
                        : e.target.value === "true"
                    )
                  )
                }
                variant="outlined"
                size="small"
                sx={{ width: 130 }}
              >
                <MenuItem value="all">Все</MenuItem>
                <MenuItem value="true">Включен</MenuItem>
                <MenuItem value="false">Выключен</MenuItem>
              </TextField>

              {isSuperadmin && (
                <Autocomplete
                  options={companies}
                  getOptionLabel={(option) => option.name || option.id}
                  value={companies.find((c) => c.id === companyFilter) || null}
                  onChange={(_, value) =>
                    dispatch(setCompanyFilter(value?.id || ""))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Компания"
                      variant="outlined"
                      size="small"
                      sx={{ width: 250 }}
                    />
                  )}
                />
              )}

              <ResetFiltersButton onClick={resetAllFilters} />

              <Box sx={{ flexGrow: 1 }} />

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setIsModalOpen(true)}
                style={{ backgroundColor: "#7353ae" }}
              >
                Новое расписание
              </Button>
            </>
          )}
        </Box>

        {isMobile && filtersOpen && (
          <Paper
            sx={{
              mt: 1,
              display: "flex",
              flexDirection: "column",
              gap: 1,
              backgroundColor: "background.paper",
            }}
          >
            <TextField
              fullWidth
              label="Название"
              value={nameFilter}
              onChange={(e) => dispatch(setNameFilter(e.target.value))}
              variant="outlined"
              size="small"
            />

            <Autocomplete
              sx={{ width: "100%" }}
              options={bots}
              getOptionLabel={(option) => option.name || option.id}
              value={bots.find((b) => b.id === botFilter) || null}
              onChange={(_, value) => dispatch(setBotFilter(value?.id || ""))}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Бот"
                  variant="outlined"
                  size="small"
                />
              )}
            />

            <Autocomplete
              sx={{ width: "100%" }}
              options={chats}
              getOptionLabel={(option) => option.name || option.id}
              value={chats.find((c) => c.id === chatFilter) || null}
              onChange={(_, value) => dispatch(setChatFilter(value?.id || ""))}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Анализируемый чат"
                  variant="outlined"
                  size="small"
                />
              )}
            />

            <Autocomplete
              sx={{ width: "100%" }}
              options={targetChats}
              getOptionLabel={(option) => option.name || option.id}
              value={targetChats.find((c) => c.id === targetChatFilter) || null}
              onChange={(_, value) =>
                dispatch(setTargetChatFilter(value?.id || ""))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Куда отправлять"
                  variant="outlined"
                  size="small"
                />
              )}
            />

            <TextField
              sx={{ width: "100%" }}
              select
              fullWidth
              label="Тип задачи"
              value={strategyFilter}
              onChange={(e) => dispatch(setStrategyFilter(e.target.value))}
              variant="outlined"
              size="small"
            >
              <MenuItem value="">Все типы</MenuItem>
              {strategies.map((strategy) => (
                <MenuItem key={strategy.value} value={strategy.value}>
                  {strategy.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              sx={{ width: "100%" }}
              select
              fullWidth
              label="Когда выполнять"
              value={typeFilter}
              onChange={(e) => dispatch(setTypeFilter(e.target.value))}
              variant="outlined"
              size="small"
            >
              <MenuItem value="">Все типы</MenuItem>
              {types.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              sx={{ width: "100%" }}
              select
              fullWidth
              label="Статус"
              value={enabledFilter}
              onChange={(e) =>
                dispatch(
                  setEnabledFilter(
                    e.target.value === "all" ? "all" : e.target.value === "true"
                  )
                )
              }
              variant="outlined"
              size="small"
            >
              <MenuItem value="all">Все</MenuItem>
              <MenuItem value="true">Включен</MenuItem>
              <MenuItem value="false">Выключен</MenuItem>
            </TextField>

            {isSuperadmin && (
              <Autocomplete
                sx={{ width: "100%" }}
                options={companies}
                getOptionLabel={(option) => option.name || option.id}
                value={companies.find((c) => c.id === companyFilter) || null}
                onChange={(_, value) =>
                  dispatch(setCompanyFilter(value?.id || ""))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Компания"
                    variant="outlined"
                    size="small"
                  />
                )}
              />
            )}
          </Paper>
        )}
      </Paper>

      <Collapse in={showHelp}>
        <Box sx={{ mb: 3 }}>
          <InfoCard
            type="info"
            title="Что такое расписания?"
            description="Расписания связывают боты, промпты и чаты, определяя когда и какие сообщения отправлять."
          />

          {data?.schedules.length === 0 && (
            <InfoCard
              type="warning"
              title="У вас пока нет расписаний"
              description="Создайте первое расписание, чтобы начать автоматическую отправку сообщений."
            />
          )}
        </Box>
      </Collapse>

      <Paper elevation={1} sx={{ overflow: "hidden" }}>
        <SchedulesTable
          schedules={paginatedSchedules}
          developerMode={developerMode}
          isSuperadmin={isSuperadmin}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
          isLoading={isLoadingAll}
        />

        {totalPages > 1 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 0,
            }}
          >
            <PaginationControls
              count={totalPages}
              page={page}
              onPageChange={(newPage) => dispatch(setPage(newPage))}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(newRowsPerPage) =>
                dispatch(setRowsPerPage(newRowsPerPage))
              }
              totalItems={filteredSchedules.length}
            />
          </Box>
        )}
      </Paper>

      {filteredSchedules.length === 0 && !isLoadingAll && (
        <Paper elevation={1} sx={{ p: 1, textAlign: "center", mb: 1 }}>
          <ScheduleIcon sx={{ fontSize: 64, color: "text.secondary", mt: 2 }} />
          <Typography variant="h6" gutterBottom color="text.secondary">
            {nameFilter ||
            botFilter ||
            companyFilter ||
            strategyFilter ||
            typeFilter ||
            chatFilter ||
            targetChatFilter
              ? "Расписания не найдены"
              : "Нет доступных расписаний"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {nameFilter ||
            botFilter ||
            companyFilter ||
            strategyFilter ||
            typeFilter ||
            chatFilter ||
            targetChatFilter
              ? "Попробуйте изменить параметры поиска"
              : "Создайте первое расписание, нажав на кнопку выше"}
          </Typography>
        </Paper>
      )}

      <AddScheduleModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </Box>
  );
};
