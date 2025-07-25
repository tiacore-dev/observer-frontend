"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useSchedulesQuery } from "../../hooks/schedules/useSchedulesQuery";
import {
  Typography,
  Box,
  Button,
  Autocomplete,
  TextField,
  MenuItem,
  Paper,
  IconButton,
  Alert,
  Chip,
  Collapse,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import type { PageProps } from "../../App";
import { SchedulesTable } from "./schedulesTable";
import { AddScheduleModal } from "./addScheduleModal";
import { useCompanyMap } from "../../hooks/maps/useCompanyMap";
import { useBotMap } from "../../hooks/maps/useBotMap";
import { useAuth } from "../../context/authContext";
import { PageSkeleton } from "../../components/skeleton/pageSkeleton";
import { ResetFiltersButton } from "../../components/table/resetFiltersButton";
import { PaginationControls } from "../../components/table/paginationControls";
import { HelpTooltip } from "../../components/helpTooltip";
import { InfoCard } from "../../components/infoCard";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import {
  Schedule as ScheduleIcon,
  HelpOutline,
  Refresh,
  FilterAlt,
} from "@mui/icons-material";

export const SchedulesPage: React.FC<PageProps> = ({ developerMode }) => {
  const { isSuperadmin } = useAuth();
  const { data, isLoading, error } = useSchedulesQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // Состояния фильтров
  const [botFilter, setBotFilter] = useState<string>("");
  const [companyFilter, setCompanyFilter] = useState<string>("");
  const [enabledFilter, setEnabledFilter] = useState<boolean | "all">("all");
  const [strategyFilter, setStrategyFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");

  const [sortField, setSortField] = useState<
    | "bot_id"
    | "enabled"
    | "company_id"
    | "created_at"
    | "last_run_at"
    | "schedule_strategy"
    | "schedule_type"
  >("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  // Используем хуки для маппингов
  const { companyMap, isLoadingCompanyMap } = useCompanyMap();
  const { botMap } = useBotMap();

  const isLoadingAll = isLoading || isLoadingCompanyMap;

  // Функция для сброса всех фильтров
  const resetAllFilters = () => {
    setBotFilter("");
    setCompanyFilter("");
    setEnabledFilter("all");
    setStrategyFilter("");
    setTypeFilter("");
    setSortField("created_at");
    setSortDirection("desc");
    setPage(1);
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

    // Сортируем данные
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

  const handleSort = (
    field:
      | "bot_id"
      | "enabled"
      | "company_id"
      | "created_at"
      | "last_run_at"
      | "schedule_strategy"
      | "schedule_type"
  ) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredSchedules = getFilteredAndSortedSchedules();
  const totalPages = Math.ceil(filteredSchedules.length / rowsPerPage);
  const paginatedSchedules = filteredSchedules.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  useEffect(() => {
    setPage(1);
  }, [
    botFilter,
    companyFilter,
    enabledFilter,
    strategyFilter,
    typeFilter,
    sortField,
    sortDirection,
  ]);

  if (isLoadingAll) {
    return (
      <PageSkeleton filterCount={isSuperadmin ? 4 : 3} hasAddButton={true} />
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
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
    <Box sx={{ pl: 2, pr: 2, mt: -1, mb: -1, maxWidth: 1600, mx: "auto" }}>
      {isLoadingAll ? (
        <PageSkeleton filterCount={isSuperadmin ? 4 : 3} hasAddButton={true} />
      ) : (
        <>
          {/* Заголовок страницы */}
          <Paper
            elevation={1}
            sx={{
              p: 3,
              mb: 1,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <ScheduleIcon sx={{ fontSize: 40 }} />
              <Box>
                <Typography
                  variant="h4"
                  component="h1"
                  gutterBottom
                  sx={{ mb: 1, fontWeight: 600 }}
                  color="white"
                >
                  Расписания
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }} color="white">
                  На этой странице вы можете управлять автоматическими задачами
                  для анализа чатов и отправки уведомлений. Создавайте
                  расписания для регулярного выполнения задач по интервалам или
                  в определенные дни недели.
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Фильтры */}
          <Paper elevation={1} sx={{ p: 2, mb: 1 }}>
            <Box
              sx={{
                display: "flex",
                gap: 1,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              {/* Фильтр по боту */}
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Autocomplete
                  options={bots}
                  getOptionLabel={(option) => option.name || option.id}
                  value={bots.find((b) => b.id === botFilter) || null}
                  onChange={(_, value) => setBotFilter(value?.id || "")}
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
              </Box>

              {/* Фильтр по типу задачи */}
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <TextField
                  select
                  label="Тип задачи"
                  value={strategyFilter}
                  onChange={(e) => setStrategyFilter(e.target.value)}
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
              </Box>

              {/* Фильтр по "когда выполнять" */}
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <TextField
                  select
                  label="Когда выполнять"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
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
              </Box>

              {/* Фильтр по статусу */}
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <TextField
                  select
                  label="Статус"
                  value={enabledFilter}
                  onChange={(e) =>
                    setEnabledFilter(
                      e.target.value === "all"
                        ? "all"
                        : e.target.value === "true"
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
              </Box>

              {/* Фильтр по компании (только для суперадмина) */}
              {isSuperadmin && (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Autocomplete
                    options={companies}
                    getOptionLabel={(option) => option.name || option.id}
                    value={
                      companies.find((c) => c.id === companyFilter) || null
                    }
                    onChange={(_, value) => setCompanyFilter(value?.id || "")}
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
                </Box>
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
            </Box>
          </Paper>

          {/* Справочная информация */}
          <Collapse in={showHelp}>
            <Box sx={{ mb: 3 }}>
              <InfoCard
                type="info"
                title="Что такое расписания?"
                description="Расписания связывают боты, промпты и чаты, определяя когда и какие сообщения отправлять. Вы можете настроить отправку по интервалам или в определенные дни недели."
              />

              {data?.schedules.length === 0 && (
                <InfoCard
                  type="warning"
                  title="У вас пока нет расписаний"
                  description="Создайте первое расписание, чтобы начать автоматическую отправку сообщений. Вам понадобится бот, промпт и чат."
                />
              )}

              {data?.schedules.some((schedule) => !schedule.enabled) && (
                <InfoCard
                  type="warning"
                  title="Отключенные расписания"
                  description="У вас есть отключенные расписания. Они не будут выполняться автоматически. Включите их для активации отправки сообщений."
                />
              )}

              <InfoCard
                type="success"
                title="Типы расписаний"
                description="• Интервал - отправка через определенные промежутки времени (каждые N минут/часов)
• По дням недели - отправка в определенные дни и время (например, каждый понедельник в 9:00)"
              />
            </Box>
          </Collapse>

          {/* Таблица */}
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

            {/* Пагинация */}
            {totalPages > 1 && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mb: 3,
                  mt: 0,
                }}
              >
                <PaginationControls
                  count={totalPages}
                  page={page}
                  onPageChange={setPage}
                />
              </Box>
            )}
          </Paper>

          {/* Пустое состояние */}
          {filteredSchedules.length === 0 && !isLoadingAll && (
            <Paper elevation={1} sx={{ p: 1, textAlign: "center", mb: 1 }}>
              <ScheduleIcon
                sx={{ fontSize: 64, color: "text.secondary", mt: 2 }}
              />
              <Typography variant="h6" gutterBottom color="text.secondary">
                {botFilter || companyFilter || strategyFilter || typeFilter
                  ? "Расписания не найдены"
                  : "Нет доступных расписаний"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {botFilter || companyFilter || strategyFilter || typeFilter
                  ? "Попробуйте изменить параметры поиска"
                  : "Создайте первое расписание, нажав на кнопку выше"}
              </Typography>
            </Paper>
          )}

          <AddScheduleModal
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </>
      )}
    </Box>
  );
};
