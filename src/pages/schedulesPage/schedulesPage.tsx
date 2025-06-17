import React, { useState, useEffect } from "react";
import { useSchedulesQuery } from "../../hooks/schedules/useSchedulesQuery";
import {
  Paper,
  CircularProgress,
  Typography,
  Box,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Pagination,
  SelectChangeEvent,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { PageProps } from "../../App";
import { SchedulesTable } from "./schedulesTable";
import { AddScheduleModal } from "./addScheduleModal";

export const SchedulesPage: React.FC<PageProps> = ({ developerMode }) => {
  const { data, isLoading, error } = useSchedulesQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const companies = Array.from(
    new Set(data?.schedules.map((schedule) => schedule.company_id) || [])
  );
  const chats = Array.from(
    new Set(
      data?.schedules.map((schedule) => schedule.chat_id.toString()) || []
    )
  );
  const types = Array.from(
    new Set(data?.schedules.map((schedule) => schedule.schedule_type) || [])
  );

  const getFilteredAndSortedSchedules = () => {
    if (!data?.schedules) return [];

    let filteredSchedules = [...data.schedules];

    if (nameFilter) {
      filteredSchedules = filteredSchedules.filter((schedule) =>
        schedule.prompt_id.toLowerCase().includes(nameFilter.toLowerCase())
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
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <TextField
          label="Поиск по промпту"
          variant="outlined"
          size="small"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
        />

        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Компания</InputLabel>
          <Select
            value={companyFilter}
            label="Компания"
            onChange={(e) => setCompanyFilter(e.target.value as string)}
          >
            <MenuItem value="">Все компании</MenuItem>
            {companies.map((company) => (
              <MenuItem key={company} value={company}>
                {company}
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
              <MenuItem key={chat} value={chat}>
                {chat}
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
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Доступность</InputLabel>
          <Select
            value={enabledFilter}
            label="Доступность"
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
