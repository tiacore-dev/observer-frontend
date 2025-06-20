import React, { useState, useEffect } from "react";
import { useSchedulesQuery } from "../../hooks/schedules/useSchedulesQuery";
import {
  Paper,
  CircularProgress,
  Typography,
  Box,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Pagination,
  SelectChangeEvent,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import { PageProps } from "../../App";
import { SchedulesTable } from "./schedulesTable";
import { AddScheduleModal } from "./addScheduleModal";
import { useCompanyMap } from "../../hooks/maps/useCompanyMap";
import { useChatMap } from "../../hooks/maps/useChatMap";
import { usePromptMap } from "../../hooks/maps/usePromptMap";

export const SchedulesPage: React.FC<PageProps> = ({ developerMode }) => {
  const { data, isLoading, error } = useSchedulesQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Состояния фильтров
  const [nameFilter, setNameFilter] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [chatFilter, setChatFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [enabledFilter, setEnabledFilter] = useState<boolean | "all">("all");

  const [sortField, setSortField] = useState<"created_at" | "schedule_type">(
    "created_at"
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  // Используем хуки для маппингов
  const companyMap = useCompanyMap();
  const chatMap = useChatMap();
  const promptMap = usePromptMap();

  // Функция для сброса всех фильтров
  const resetAllFilters = () => {
    setNameFilter("");
    setCompanyFilter("");
    setChatFilter("");
    setTypeFilter("");
    setEnabledFilter("all");
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
  const companies = Array.from(
    new Set(data?.schedules.map((schedule) => schedule.company_id) || [])
  ).map((companyId) => ({
    id: companyId,
    name: companyMap.get(companyId) || companyId,
  }));

  const chats = Array.from(
    new Set(
      data?.schedules.map((schedule) => schedule.chat_id.toString()) || []
    )
  ).map((chatId) => ({
    id: chatId,
    name: chatMap.get(Number(chatId)) || chatId,
  }));

  const prompts = Array.from(
    new Set(data?.schedules.map((schedule) => schedule.prompt_id) || [])
  ).map((promptId) => ({
    id: promptId,
    name: promptMap.get(promptId) || promptId,
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

    if (nameFilter) {
      filteredSchedules = filteredSchedules.filter(
        (schedule) => schedule.prompt_id === nameFilter
      );
    }

    if (companyFilter) {
      filteredSchedules = filteredSchedules.filter(
        (schedule) => schedule.company_id === companyFilter
      );
    }

    if (chatFilter) {
      filteredSchedules = filteredSchedules.filter(
        (schedule) => schedule.chat_id.toString() === chatFilter
      );
    }

    if (typeFilter) {
      filteredSchedules = filteredSchedules.filter(
        (schedule) => schedule.schedule_type === typeFilter
      );
    }

    if (enabledFilter !== "all") {
      filteredSchedules = filteredSchedules.filter(
        (schedule) => schedule.enabled === enabledFilter
      );
    }

    filteredSchedules.sort((a, b) => {
      if (sortField === "created_at") {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      } else {
        return sortDirection === "asc"
          ? a.schedule_type.localeCompare(b.schedule_type)
          : b.schedule_type.localeCompare(a.schedule_type);
      }
    });

    return filteredSchedules;
  };

  const handleSort = (field: "created_at" | "schedule_type") => {
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
  }, [nameFilter, companyFilter, chatFilter, typeFilter, enabledFilter]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
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
        }}
      >
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Промпт</InputLabel>
          <Select
            value={nameFilter}
            label="Промпт"
            onChange={(e) => setNameFilter(e.target.value as string)}
          >
            <MenuItem value="">Все промпты</MenuItem>
            {prompts.map((prompt) => (
              <MenuItem key={prompt.id} value={prompt.id}>
                {prompt.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Компания</InputLabel>
          <Select
            value={companyFilter}
            label="Компания"
            onChange={(e) => setCompanyFilter(e.target.value as string)}
          >
            <MenuItem value="">Все компании</MenuItem>
            {companies.map((company) => (
              <MenuItem key={company.id} value={company.id}>
                {company.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Чат</InputLabel>
          <Select
            value={chatFilter}
            label="Чат"
            onChange={(e) => setChatFilter(e.target.value as string)}
          >
            <MenuItem value="">Все чаты</MenuItem>
            {chats.map((chat) => (
              <MenuItem key={chat.id} value={chat.id}>
                {chat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Тип</InputLabel>
          <Select
            value={typeFilter}
            label="Тип"
            onChange={(e) => setTypeFilter(e.target.value as string)}
          >
            <MenuItem value="">Все типы</MenuItem>
            {types.map((type) => (
              <MenuItem key={type.value} value={type.value}>
                {type.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Статус</InputLabel>
          <Select
            value={enabledFilter}
            label="Статус"
            onChange={(e: SelectChangeEvent<boolean | "all">) =>
              setEnabledFilter(
                e.target.value === "all" ? "all" : e.target.value === "true"
              )
            }
          >
            <MenuItem value="all">Все</MenuItem>
            <MenuItem value="true">Включен</MenuItem>
            <MenuItem value="false">Выключен</MenuItem>
          </Select>
        </FormControl>

        <Tooltip title="Сбросить все фильтры">
          <Button
            onClick={resetAllFilters}
            color="primary"
            sx={{
              border: "1px solid rgba(0, 0, 0, 0.23)",
              borderRadius: 1,
              padding: "8px",
              "&:hover": {
                backgroundColor: "action.hover",
              },
            }}
          >
            <ClearIcon />
            Сбросить
          </Button>
        </Tooltip>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsModalOpen(true)}
        >
          Добавить
        </Button>
      </Box>

      <SchedulesTable
        schedules={paginatedSchedules}
        developerMode={developerMode}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
      />

      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
          showFirstButton
          showLastButton
        />
      </Box>
      <AddScheduleModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </Box>
  );
};
