import React, { useState, useEffect } from "react";
import { useSchedulesQuery } from "../../hooks/schedules/useSchedulesQuery";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
  TableSortLabel,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";

export const SchedulesPage: React.FC = () => {
  const { data, isLoading, error } = useSchedulesQuery();
  const navigate = useNavigate();

  // Состояния для фильтрации
  const [nameFilter, setNameFilter] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [chatFilter, setChatFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [enabledFilter, setEnabledFilter] = useState<boolean | "all">("all");

  // Состояния для сортировки
  const [sortField, setSortField] = useState<"created_at" | "schedule_type">(
    "created_at"
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Состояния для пагинации
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  // Получаем уникальные значения для фильтров
  const companies = Array.from(
    new Set(data?.schedules.map((schedule) => schedule.company) || [])
  );
  const chats = Array.from(
    new Set(data?.schedules.map((schedule) => schedule.chat.toString()) || [])
  );
  const types = Array.from(
    new Set(data?.schedules.map((schedule) => schedule.schedule_type) || [])
  );

  // Функция для фильтрации и сортировки данных
  const getFilteredAndSortedSchedules = () => {
    if (!data?.schedules) return [];

    let filteredSchedules = [...data.schedules];

    // Фильтрация по названию (prompt)
    if (nameFilter) {
      filteredSchedules = filteredSchedules.filter((schedule) =>
        schedule.prompt.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }

    // Фильтрация по компании
    if (companyFilter) {
      filteredSchedules = filteredSchedules.filter(
        (schedule) => schedule.company === companyFilter
      );
    }

    // Фильтрация по чату
    if (chatFilter) {
      filteredSchedules = filteredSchedules.filter(
        (schedule) => schedule.chat.toString() === chatFilter
      );
    }

    // Фильтрация по типу
    if (typeFilter) {
      filteredSchedules = filteredSchedules.filter(
        (schedule) => schedule.schedule_type === typeFilter
      );
    }

    // Фильтрация по доступности
    if (enabledFilter !== "all") {
      filteredSchedules = filteredSchedules.filter(
        (schedule) => schedule.enabled === enabledFilter
      );
    }

    // Сортировка
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

  // Сброс страницы при изменении фильтров
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
      {/* Фильтры */}
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
          onClick={() => navigate("/schedules/add")}
        >
          Добавить расписание
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="schedules table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Промпт</TableCell>
              <TableCell>Чат</TableCell>
              <TableCell>Компания</TableCell>
              <TableCell>Тип</TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === "schedule_type"}
                  direction={sortDirection}
                  onClick={() => handleSort("schedule_type")}
                >
                  Тип расписания
                </TableSortLabel>
              </TableCell>
              <TableCell>Доступность</TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === "created_at"}
                  direction={sortDirection}
                  onClick={() => handleSort("created_at")}
                >
                  Дата создания
                </TableSortLabel>
              </TableCell>
              <TableCell>Бот</TableCell>
              <TableCell>Целевые чаты</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedSchedules.map((schedule) => (
              <TableRow
                key={schedule.schedule_id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {schedule.schedule_id}
                </TableCell>
                <TableCell>{schedule.prompt}</TableCell>
                <TableCell>{schedule.chat}</TableCell>
                <TableCell>{schedule.company}</TableCell>
                <TableCell>{schedule.schedule_type}</TableCell>
                <TableCell>
                  {schedule.enabled ? (
                    <Typography color="success.main">Включен</Typography>
                  ) : (
                    <Typography color="error">Выключен</Typography>
                  )}
                </TableCell>
                <TableCell>
                  {new Date(schedule.created_at).toLocaleString()}
                </TableCell>
                <TableCell>{schedule.bot}</TableCell>
                <TableCell>
                  {schedule.target_chats?.join(", ") || "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Пагинация */}
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
    </Box>
  );
};
