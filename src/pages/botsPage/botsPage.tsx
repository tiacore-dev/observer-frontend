import React, { useState, useEffect } from "react";
import { useBotsQuery } from "../../hooks/bots/useBotsQuery";
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

export const BotsPage: React.FC = () => {
  const { data, isLoading, error } = useBotsQuery();
  const navigate = useNavigate();

  // Состояния для фильтрации
  const [nameFilter, setNameFilter] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<boolean | "all">("all");

  // Состояния для сортировки
  const [sortField, setSortField] = useState<"bot_username" | "created_at">(
    "bot_username"
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Состояния для пагинации
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  // Получаем уникальные компании для фильтра
  const companies = Array.from(
    new Set(data?.bots.map((bot) => bot.company) || [])
  );

  // Функция для фильтрации и сортировки данных
  const getFilteredAndSortedBots = () => {
    if (!data?.bots) return [];

    let filteredBots = [...data.bots];

    // Фильтрация по имени
    if (nameFilter) {
      filteredBots = filteredBots.filter(
        (bot) =>
          bot.bot_username.toLowerCase().includes(nameFilter.toLowerCase()) ||
          bot.bot_first_name.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }

    // Фильтрация по компании
    if (companyFilter) {
      filteredBots = filteredBots.filter(
        (bot) => bot.company === companyFilter
      );
    }

    // Фильтрация по статусу
    if (statusFilter !== "all") {
      filteredBots = filteredBots.filter(
        (bot) => bot.is_active === statusFilter
      );
    }

    // Сортировка

    return filteredBots;
  };

  const handleSort = (field: "bot_username" | "created_at") => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };
  const filteredBots = getFilteredAndSortedBots();
  const totalPages = Math.ceil(filteredBots.length / rowsPerPage);
  const paginatedBots = filteredBots.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  // Сброс страницы при изменении фильтров
  useEffect(() => {
    setPage(1);
  }, [nameFilter, companyFilter, statusFilter]);

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
          label="Поиск по имени"
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
          <InputLabel>Статус</InputLabel>
          <Select
            value={statusFilter}
            label="Статус"
            onChange={(e: SelectChangeEvent<boolean | "all">) =>
              setStatusFilter(
                e.target.value === "all" ? "all" : e.target.value === "true"
              )
            }
          >
            <MenuItem value="all">Все статусы</MenuItem>
            <MenuItem value="true">Активные</MenuItem>
            <MenuItem value="false">Неактивные</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/bots/add")}
        >
          Добавить бота
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="bots table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell
                sortDirection={
                  sortField === "bot_username" ? sortDirection : false
                }
              >
                <TableSortLabel
                  active={sortField === "bot_username"}
                  direction={
                    sortField === "bot_username" ? sortDirection : "asc"
                  }
                  onClick={() => handleSort("bot_username")}
                >
                  Имя пользователя
                </TableSortLabel>
              </TableCell>
              <TableCell>Имя</TableCell>
              <TableCell>Компания</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell
                sortDirection={
                  sortField === "created_at" ? sortDirection : false
                }
              >
                <TableSortLabel
                  active={sortField === "created_at"}
                  direction={sortField === "created_at" ? sortDirection : "asc"}
                  onClick={() => handleSort("created_at")}
                >
                  Дата создания
                </TableSortLabel>
              </TableCell>
              <TableCell>Комментарий</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedBots.map((bot) => (
              <TableRow
                key={bot.bot_id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {bot.bot_id}
                </TableCell>
                <TableCell>{bot.bot_username}</TableCell>
                <TableCell>{bot.bot_first_name}</TableCell>
                <TableCell>{bot.company}</TableCell>
                <TableCell>
                  {bot.is_active ? (
                    <Typography color="success.main">Активен</Typography>
                  ) : (
                    <Typography color="error">Неактивен</Typography>
                  )}
                </TableCell>
                <TableCell>
                  {new Date(bot.created_at).toLocaleString()}
                </TableCell>
                <TableCell>{bot.comment || "-"}</TableCell>
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
