"use client";

import type React from "react";
import { useState, useEffect } from "react";
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
  setSortField,
  setSortDirection,
  resetFilters,
} from "../../redux/slice/botsSlice";
import type { RootState } from "../../redux/store";

// Определяем тип SortField в соответствии с BotsTable
type SortField =
  | "bot_username"
  | "bot_first_name"
  | "company_id"
  | "is_active"
  | "comment"
  | "created_at";

export const BotsPage: React.FC<PageProps> = ({ developerMode }) => {
  const { botId } = useParams();
  const navigate = useNavigate();
  const { isSuperadmin } = useAuth();
  const dispatch = useDispatch();

  // Получаем состояние из Redux store
  const {
    botIdFilter,
    botNameFilter,
    botNameSelectFilter,
    companyFilter,
    companySelectFilter,
    statusFilter,
    page,
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

  const { companyMap, isLoadingCompanyMap } = useCompanyMap();

  const isLoading = botsLoading || companiesLoading || isLoadingCompanyMap;
  const error = botsError || companiesError;

  const rowsPerPage = 10;

  const resetAllFilters = () => {
    dispatch(resetFilters());
  };

  const companies = Array.from(
    new Set(
      botsData?.bots.map((bot) => ({
        id: bot.company_id,
        name: companyMap.get(bot.company_id) || bot.company_id,
      })) || []
    )
  );

  const botNames = Array.from(
    new Set(botsData?.bots.map((bot) => bot.bot_username) || [])
  );

  const getFilteredAndSortedBots = () => {
    if (!botsData?.bots) return [];

    let filteredBots = [...botsData.bots];

    if (botIdFilter) {
      filteredBots = filteredBots.filter((bot) =>
        String(bot.bot_id).toLowerCase().includes(botIdFilter.toLowerCase())
      );
    }

    if (botNameFilter || botNameSelectFilter) {
      const botNameFilterValue = botNameSelectFilter || botNameFilter;
      filteredBots = filteredBots.filter((bot) =>
        bot.bot_username
          .toLowerCase()
          .includes(botNameFilterValue.toLowerCase())
      );
    }

    if (isSuperadmin && (companyFilter || companySelectFilter)) {
      const companyFilterValue = companySelectFilter || companyFilter;
      filteredBots = filteredBots.filter(
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
      filteredBots = filteredBots.filter(
        (bot) => bot.is_active === statusFilter
      );
    }

    filteredBots.sort((a, b) => {
      if (sortField === "is_active") {
        if (a.is_active === b.is_active) return 0;
        if (sortDirection === "asc") {
          return a.is_active ? -1 : 1;
        } else {
          return a.is_active ? 1 : -1;
        }
      }

      if (sortField === "company_id") {
        const aCompany = companyMap.get(a.company_id) ?? String(a.company_id);
        const bCompany = companyMap.get(b.company_id) ?? String(b.company_id);
        if (aCompany < bCompany) return sortDirection === "asc" ? -1 : 1;
        if (aCompany > bCompany) return sortDirection === "asc" ? 1 : -1;
        return 0;
      }

      const aValue = a[sortField] ?? "";
      const bValue = b[sortField] ?? "";

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
    return filteredBots;
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      dispatch(setSortDirection(sortDirection === "asc" ? "desc" : "asc"));
    } else {
      dispatch(setSortField(field));
      dispatch(setSortDirection("asc"));
    }
  };

  const filteredBots = getFilteredAndSortedBots();
  const totalPages = Math.ceil(filteredBots.length / rowsPerPage);
  const paginatedBots = filteredBots.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  useEffect(() => {
    dispatch(setPage(1));
  }, [
    botIdFilter,
    botNameFilter,
    botNameSelectFilter,
    companyFilter,
    companySelectFilter,
    statusFilter,
    sortField,
    sortDirection,
  ]);

  if (botId) {
    return <BotDetailsPage botId={botId} developerMode={developerMode} />;
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
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
    <Box sx={{ pl: 2, pr: 2, maxWidth: 1600, mx: "auto" }}>
      {isLoading ? (
        <PageSkeleton
          filterCount={isSuperadmin ? 3 : 2}
          pagination={true}
          hasAddButton={true}
        />
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
              <SmartToyIcon sx={{ fontSize: 40 }} />
              <Box>
                <Typography
                  variant="h4"
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

          {/* Справочная информация */}
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
                  onChange={(e) => dispatch(setCompanyFilter(e.target.value))}
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
            </Box>
          </Paper>

          {/* Таблица */}
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
          </Paper>

          {/* Пагинация */}
          {totalPages > 1 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mb: 3,
                mt: -3,
              }}
            >
              <PaginationControls
                count={totalPages}
                page={page}
                onPageChange={(newPage) => dispatch(setPage(newPage))}
              />
            </Box>
          )}

          {/* Пустое состояние */}
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
