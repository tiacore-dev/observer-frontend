import React, { useState, useEffect } from "react";
import { useSchedulesQuery } from "../../hooks/schedules/useSchedulesQuery";
import {
  Paper,
  CircularProgress,
  Typography,
  Box,
  Button,
  Pagination,
  Tooltip,
  Autocomplete,
  TextField,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import { PageProps } from "../../App";
import { SchedulesTable } from "./schedulesTable";
import { AddScheduleModal } from "./addScheduleModal";
import { useCompanyMap } from "../../hooks/maps/useCompanyMap";
import { useChatMap } from "../../hooks/maps/useChatMap";
import { usePromptMap } from "../../hooks/maps/usePromptMap";
import { useBotMap } from "../../hooks/maps/useBotMap";
import { useAuth } from "../../context/authContext";
import { PageSkeleton } from "../../components/skeleton/pageSkeleton";
import { ResetFiltersButton } from "../../components/table/resetFiltersButton";
import { PaginationControls } from "../../components/table/paginationControls";

export const SchedulesPage: React.FC<PageProps> = ({ developerMode }) => {
  const { isSuperadmin } = useAuth();
  const { data, isLoading, error } = useSchedulesQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Состояния фильтров
  const [promptFilter, setPromptFilter] = useState("");
  const [chatFilter, setChatFilter] = useState("");
  const [botFilter, setBotFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [enabledFilter, setEnabledFilter] = useState<boolean | "all">("all");

  const [sortField, setSortField] = useState<
    | "prompt_id"
    | "chat_id"
    | "bot_id"
    | "schedule_type"
    | "enabled"
    | "company_id"
    | "created_at"
  >("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  // Используем хуки для маппингов
  const { companyMap, isLoading: isLoadingCompanyMap } = useCompanyMap();
  const chatMap = useChatMap();
  const promptMap = usePromptMap();
  const botMap = useBotMap();

  const isLoadingAll = isLoading || isLoadingCompanyMap;

  // Функция для сброса всех фильтров
  const resetAllFilters = () => {
    setPromptFilter("");
    setChatFilter("");
    setBotFilter("");
    setTypeFilter("");
    setCompanyFilter("");
    setEnabledFilter("all");
    setSortField("created_at");
    setSortDirection("desc");
    setPage(1);
  };

  // Функция для преобразования типа расписания в читаемый формат
  const getScheduleTypeLabel = (type: string) => {
    switch (type) {
      case "interval":
        return "Интервал";
      case "cron":
        return "Повторяющееся";
      case "once":
        return "Одноразово";
      case "daily_time":
        return "Ежедневно";
      default:
        return type;
    }
  };

  // Подготавливаем данные для фильтров
  const prompts = Array.from(
    new Set(data?.schedules.map((schedule) => schedule.prompt_id) || [])
  ).map((promptId) => ({
    id: promptId,
    name: promptMap.get(promptId) || promptId,
  }));

  const chats = Array.from(
    new Set(
      data?.schedules.map((schedule) => schedule.chat_id.toString()) || []
    )
  ).map((chatId) => ({
    id: chatId,
    name: chatMap.get(Number(chatId)) || chatId,
  }));

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

  const types = Array.from(
    new Set(data?.schedules.map((schedule) => schedule.schedule_type) || [])
  ).map((type) => ({
    value: type,
    label: getScheduleTypeLabel(type),
  }));

  const getFilteredAndSortedSchedules = () => {
    if (!data?.schedules) return [];

    let filteredSchedules = [...data.schedules];

    if (promptFilter) {
      filteredSchedules = filteredSchedules.filter(
        (schedule) => schedule.prompt_id === promptFilter
      );
    }

    if (chatFilter) {
      filteredSchedules = filteredSchedules.filter(
        (schedule) => schedule.chat_id.toString() === chatFilter
      );
    }

    if (botFilter) {
      filteredSchedules = filteredSchedules.filter(
        (schedule) => schedule.bot_id.toString() === botFilter
      );
    }

    if (typeFilter) {
      filteredSchedules = filteredSchedules.filter(
        (schedule) => schedule.schedule_type === typeFilter
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

    filteredSchedules.sort((a, b) => {
      // Для полей, которые используют маппинг (prompt, chat, bot, company)
      if (sortField === "prompt_id") {
        const aPrompt = promptMap.get(a.prompt_id) ?? a.prompt_id;
        const bPrompt = promptMap.get(b.prompt_id) ?? b.prompt_id;
        if (aPrompt < bPrompt) return sortDirection === "asc" ? -1 : 1;
        if (aPrompt > bPrompt) return sortDirection === "asc" ? 1 : -1;
        return 0;
      }

      if (sortField === "chat_id") {
        const aChat = chatMap.get(a.chat_id) ?? a.chat_id.toString();
        const bChat = chatMap.get(b.chat_id) ?? b.chat_id.toString();
        if (aChat < bChat) return sortDirection === "asc" ? -1 : 1;
        if (aChat > bChat) return sortDirection === "asc" ? 1 : -1;
        return 0;
      }

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

      // Для типа расписания
      if (sortField === "schedule_type") {
        const aType = getScheduleTypeLabel(a.schedule_type);
        const bType = getScheduleTypeLabel(b.schedule_type);
        if (aType < bType) return sortDirection === "asc" ? -1 : 1;
        if (aType > bType) return sortDirection === "asc" ? 1 : -1;
        return 0;
      }

      // Для статуса
      if (sortField === "enabled") {
        if (a.enabled === b.enabled) return 0;
        if (sortDirection === "asc") {
          return a.enabled ? -1 : 1;
        } else {
          return a.enabled ? 1 : -1;
        }
      }

      // Для даты создания
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
      | "prompt_id"
      | "chat_id"
      | "bot_id"
      | "schedule_type"
      | "enabled"
      | "company_id"
      | "created_at"
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
    promptFilter,
    chatFilter,
    botFilter,
    typeFilter,
    companyFilter,
    enabledFilter,
    sortField,
    sortDirection,
  ]);

  if (isLoadingAll) {
    return (
      <PageSkeleton filterCount={isSuperadmin ? 5 : 4} hasAddButton={true} />
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Typography color="error">
          Ошибка при загрузке данных: {(error as Error).message}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 3,
          flexWrap: "wrap",
          alignItems: "center",
          width: "100%", // Добавлено для полной ширины
        }}
      >
        {/* Фильтр по промпту */}
        <Autocomplete
          options={prompts}
          getOptionLabel={(option) => option.name}
          value={prompts.find((p) => p.id === promptFilter) || null}
          onChange={(_, value) => setPromptFilter(value?.id || "")}
          renderInput={(params) => (
            <TextField {...params} label="Промпт" size="small" />
          )}
          sx={{ width: 200 }}
        />

        {/* Фильтр по чату */}
        <Autocomplete
          options={chats}
          getOptionLabel={(option) => option.name}
          value={chats.find((c) => c.id === chatFilter) || null}
          onChange={(_, value) => setChatFilter(value?.id || "")}
          renderInput={(params) => (
            <TextField {...params} label="Чат" size="small" />
          )}
          sx={{ width: 200 }}
        />

        {/* Фильтр по боту */}
        <Autocomplete
          options={bots}
          getOptionLabel={(option) => option.name}
          value={bots.find((b) => b.id === botFilter) || null}
          onChange={(_, value) => setBotFilter(value?.id || "")}
          renderInput={(params) => (
            <TextField {...params} label="Бот" size="small" />
          )}
          sx={{ width: 200 }}
        />

        {/* Фильтр по типу (обычный Select) */}
        <TextField
          select
          label="Тип"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          size="small"
          sx={{ width: 170 }}
        >
          <MenuItem value="">Все типы</MenuItem>
          {types.map((type) => (
            <MenuItem key={type.value} value={type.value}>
              {type.label}
            </MenuItem>
          ))}
        </TextField>

        {/* Фильтр по статусу (обычный Select) */}
        <TextField
          select
          label="Статус"
          value={enabledFilter}
          onChange={(e) =>
            setEnabledFilter(
              e.target.value === "all" ? "all" : e.target.value === "true"
            )
          }
          size="small"
          sx={{ width: 130 }}
        >
          <MenuItem value="all">Все</MenuItem>
          <MenuItem value="true">Включен</MenuItem>
          <MenuItem value="false">Выключен</MenuItem>
        </TextField>

        {/* Фильтр по компании (только для суперадмина) */}
        {isSuperadmin && (
          <Autocomplete
            options={companies}
            getOptionLabel={(option) => option.name}
            value={companies.find((c) => c.id === companyFilter) || null}
            onChange={(_, value) => setCompanyFilter(value?.id || "")}
            renderInput={(params) => (
              <TextField {...params} label="Компания" size="small" />
            )}
            sx={{ width: 250 }}
          />
        )}

        <ResetFiltersButton onClick={resetAllFilters} />
        <Box sx={{ flexGrow: 1 }} />

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsModalOpen(true)}
        >
          Добавить расписание
        </Button>
      </Box>

      <SchedulesTable
        schedules={paginatedSchedules}
        developerMode={developerMode}
        isSuperadmin={isSuperadmin}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
        isLoading={isLoadingAll}
      />

      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <PaginationControls
          count={totalPages}
          page={page}
          onPageChange={setPage}
        />
      </Box>
      <AddScheduleModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </Box>
  );
};
