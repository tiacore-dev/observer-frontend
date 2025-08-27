"use client";

import type React from "react";
import { useState, useEffect, useMemo } from "react";
import { useBotsQuery } from "../../hooks/bots/useBotsQuery";
import { useCompaniesQuery } from "../../hooks/companies/useCompaniesQuery";
import {
  Typography,
  Box,
  Button,
  Paper,
  TextField,
  Alert,
  Collapse,
  useMediaQuery,
  Theme,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import { AddBotModal } from "./addBotModal";
import type { PageProps } from "../../App";
import { BotsTable } from "./botsTable";
import { useNavigate, useParams } from "react-router-dom";
import { useCompanyMap } from "../../hooks/maps/useCompanyMap";
import { BotDetailsPage } from "./botDetailsPage";
import { PageSkeleton } from "../../components/skeleton/pageSkeleton";
import { ResetFiltersButton } from "../../components/table/resetFiltersButton";
import { PaginationControls } from "../../components/table/paginationControls";
import { HelpTooltip } from "../../components/helpTooltip";
import { InfoCard } from "../../components/infoCard";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import { useAuth } from "../../context/authContext";
import { useDispatch, useSelector } from "react-redux";
import {
  setBotIdFilter,
  setBotNameFilter,
  setBotNameSelectFilter,
  setCompanyFilter,
  setCompanySelectFilter,
  setStatusFilter,
  setPage,
  setRowsPerPage,
  setSortField,
  setSortDirection,
  resetFilters,
} from "../../redux/slice/botsSlice";
import type { RootState } from "../../redux/store";
import { useThemeMode } from "../../context/themeContext";
import SearchIcon from "@mui/icons-material/Search";

type SortField =
  | "bot_username"
  | "bot_first_name"
  | "company_id"
  | "is_active"
  | "comment"
  | "created_at";

export const BotsPage: React.FC<PageProps> = ({ developerMode }) => {
  const theme = useThemeMode();
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );

  const { botId } = useParams();
  const navigate = useNavigate();
  const { isSuperadmin } = useAuth();
  const dispatch = useDispatch();

  const {
    botIdFilter,
    botNameFilter,
    botNameSelectFilter,
    companyFilter,
    companySelectFilter,
    statusFilter,
    page,
    rowsPerPage,
    sortField,
    sortDirection,
  } = useSelector((state: RootState) => state.bots);

  const {
    data: botsData,
    isLoading: botsLoading,
    error: botsError,
  } = useBotsQuery();
  const {
    data: companiesData,
    isLoading: companiesLoading,
    error: companiesError,
  } = useCompaniesQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const { companyMap, isLoadingCompanyMap } = useCompanyMap();

  const isLoading = botsLoading || companiesLoading || isLoadingCompanyMap;
  const error = botsError || companiesError;

  const resetAllFilters = () => {
    dispatch(resetFilters());
  };

  const companies = useMemo(
    () =>
      Array.from(
        new Set(
          botsData?.bots.map((bot) => ({
            id: bot.company_id,
            name: companyMap.get(bot.company_id) || bot.company_id,
          })) || []
        )
      ),
    [botsData, companyMap]
  );

  const botNames = useMemo(
    () =>
      Array.from(new Set(botsData?.bots.map((bot) => bot.bot_username) || [])),
    [botsData]
  );

  const filteredBots = useMemo(() => {
    if (!botsData?.bots) return [];

    let filtered = [...botsData.bots];

    if (botIdFilter) {
      filtered = filtered.filter((bot) =>
        String(bot.bot_id).toLowerCase().includes(botIdFilter.toLowerCase())
      );
    }

    if (botNameFilter || botNameSelectFilter) {
      const botNameFilterValue = botNameSelectFilter || botNameFilter;
      filtered = filtered.filter((bot) =>
        bot.bot_username
          .toLowerCase()
          .includes(botNameFilterValue.toLowerCase())
      );
    }

    if (isSuperadmin && (companyFilter || companySelectFilter)) {
      const companyFilterValue = companySelectFilter || companyFilter;
      filtered = filtered.filter(
        (bot) =>
          companyMap
            .get(bot.company_id)
            ?.toLowerCase()
            .includes(companyFilterValue.toLowerCase()) ||
          String(bot.company_id)
            .toLowerCase()
            .includes(companyFilterValue.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((bot) => bot.is_active === statusFilter);
    }

    return filtered.sort((a, b) => {
      if (sortField === "is_active") {
        if (a.is_active === b.is_active) return 0;
        return sortDirection === "asc"
          ? a.is_active
            ? -1
            : 1
          : a.is_active
          ? 1
          : -1;
      }

      if (sortField === "company_id") {
        const aCompany = companyMap.get(a.company_id) ?? String(a.company_id);
        const bCompany = companyMap.get(b.company_id) ?? String(b.company_id);
        return sortDirection === "asc"
          ? aCompany.localeCompare(bCompany)
          : bCompany.localeCompare(aCompany);
      }

      const aValue = a[sortField] ?? "";
      const bValue = b[sortField] ?? "";
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });
  }, [
    botsData,
    botIdFilter,
    botNameFilter,
    botNameSelectFilter,
    companyFilter,
    companySelectFilter,
    statusFilter,
    sortField,
    sortDirection,
    companyMap,
    isSuperadmin,
  ]);

  const totalItems = filteredBots.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const paginatedBots = useMemo(() => {
    return filteredBots.slice(
      (currentPage - 1) * rowsPerPage,
      currentPage * rowsPerPage
    );
  }, [filteredBots, currentPage, rowsPerPage]);

  useEffect(() => {
    if (page !== currentPage) {
      dispatch(setPage(currentPage));
    }
  }, [page, currentPage, dispatch]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      dispatch(setSortDirection(sortDirection === "asc" ? "desc" : "asc"));
    } else {
      dispatch(setSortField(field));
      dispatch(setSortDirection("asc"));
    }
  };

  const handlePageChange = (newPage: number) => {
    dispatch(setPage(Math.max(1, Math.min(newPage, totalPages))));
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    const newTotalPages = Math.max(1, Math.ceil(totalItems / newRowsPerPage));
    dispatch(setRowsPerPage(newRowsPerPage));
    dispatch(setPage(Math.min(currentPage, newTotalPages)));
  };

  if (botId) {
    return <BotDetailsPage botId={botId} developerMode={developerMode} />;
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" mt={-1}>
        <Alert severity="error" sx={{ maxWidth: 600 }}>
          <Typography variant="h6" gutterBottom>
            Не удалось загрузить ботов
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
      {isLoading ? (
        <PageSkeleton
          filterCount={isSuperadmin ? 3 : 2}
          pagination={true}
          hasAddButton={true}
        />
      ) : (
        <>
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
              <SmartToyIcon sx={{ fontSize: isMobile ? 32 : 40 }} />
              <Box>
                <Typography
                  variant={isMobile ? "h5" : "h4"}
                  component="h1"
                  gutterBottom
                  sx={{ mb: 1, fontWeight: 600 }}
                  color="white"
                >
                  Telegram боты
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }} color="white">
                  На этой странице вы можете просмотреть список используемых
                  вами ботов и добавить нового.
                </Typography>
              </Box>
            </Box>
          </Paper>

          <Collapse in={showHelp}>
            <Box sx={{ mb: 2 }}>
              <InfoCard
                type="info"
                title="Что такое боты?"
                description="Telegram-боты - это автоматизированные аккаунты, которые могут отправлять сообщения в чаты по заданному расписанию. Каждый бот должен быть зарегистрирован через @BotFather в Telegram."
              />

              {botsData?.bots.length === 0 && (
                <InfoCard
                  type="warning"
                  title="У вас пока нет ботов"
                  description="Для начала работы добавьте хотя бы одного бота. Вам понадобится токен бота, который можно получить у @BotFather в Telegram."
                />
              )}

              {botsData?.bots.some((bot) => !bot.is_active) && (
                <InfoCard
                  type="warning"
                  title="Неактивные боты"
                  description="У вас есть неактивные боты. Они не смогут отправлять сообщения по расписанию. Проверьте их настройки и активируйте при необходимости."
                />
              )}
            </Box>
          </Collapse>

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
                    <IconButton onClick={() => setSearchOpen(!searchOpen)}>
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
                    label="Поиск по ID бота"
                    variant="outlined"
                    size="small"
                    value={botIdFilter}
                    onChange={(e) => dispatch(setBotIdFilter(e.target.value))}
                    placeholder="ID бота"
                    sx={{ minWidth: 200 }}
                  />

                  <TextField
                    label="Поиск по имени бота"
                    variant="outlined"
                    size="small"
                    value={botNameFilter}
                    onChange={(e) => dispatch(setBotNameFilter(e.target.value))}
                    placeholder="Например: my_bot"
                    sx={{ minWidth: 300 }}
                  />

                  {isSuperadmin && (
                    <TextField
                      label="Поиск по компании"
                      variant="outlined"
                      size="small"
                      value={companyFilter}
                      onChange={(e) =>
                        dispatch(setCompanyFilter(e.target.value))
                      }
                      placeholder="Название компании"
                      sx={{ minWidth: 300 }}
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
                    Добавить бота
                  </Button>
                </>
              )}
            </Box>
            {isMobile && searchOpen && (
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
                  label="Поиск по ID бота"
                  variant="outlined"
                  size="small"
                  value={botIdFilter}
                  onChange={(e) => dispatch(setBotIdFilter(e.target.value))}
                  placeholder="ID бота"
                />
                <TextField
                  fullWidth
                  label="Поиск по имени бота"
                  variant="outlined"
                  size="small"
                  value={botNameFilter}
                  onChange={(e) => dispatch(setBotNameFilter(e.target.value))}
                  placeholder="Имя бота"
                />
                {isSuperadmin && (
                  <TextField
                    fullWidth
                    label="Поиск по компании"
                    variant="outlined"
                    size="small"
                    value={companyFilter}
                    onChange={(e) => dispatch(setCompanyFilter(e.target.value))}
                    placeholder="Компания"
                  />
                )}
              </Paper>
            )}
          </Paper>

          <Paper elevation={1} sx={{ overflow: "hidden" }}>
            <BotsTable
              bots={paginatedBots}
              companyMap={companyMap}
              developerMode={developerMode}
              sortField={sortField as SortField}
              sortDirection={sortDirection}
              onSort={handleSort}
              onRowClick={(botId) => navigate(`/bots/${botId}`)}
            />
            {totalPages > 1 && (
              <PaginationControls
                count={totalPages}
                page={currentPage}
                onPageChange={handlePageChange}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleRowsPerPageChange}
                totalItems={totalItems}
              />
            )}
          </Paper>

          {filteredBots.length === 0 && !isLoading && (
            <Paper elevation={1} sx={{ p: 1, textAlign: "center", mb: 1 }}>
              <SmartToyIcon
                sx={{ fontSize: 64, color: "text.secondary", mt: 2 }}
              />
              <Typography variant="h6" gutterBottom color="text.secondary">
                {botIdFilter || botNameFilter || companyFilter
                  ? "Боты не найдены"
                  : "Нет доступных ботов"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {botIdFilter || botNameFilter || companyFilter
                  ? "Попробуйте изменить параметры поиска"
                  : "Добавьте первого бота, нажав на кнопку выше"}
              </Typography>
            </Paper>
          )}

          <AddBotModal
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </>
      )}
    </Box>
  );
};
