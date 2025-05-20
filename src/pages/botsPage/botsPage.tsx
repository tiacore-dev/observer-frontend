import React, { useState, useEffect, useMemo } from "react";
import { useBotsQuery } from "../../hooks/bots/useBotsQuery";
import { useCompaniesQuery } from "../../hooks/companies/useCompaniesQuery";
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
import { AddBotModal } from "./addBotModal";

interface BotsPageProps {
  developerMode: boolean;
}

export const BotsPage: React.FC<BotsPageProps> = ({ developerMode }) => {
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

  const companyMap = useMemo(() => {
    const map = new Map<string, string>();
    companiesData?.companies?.forEach((company) => {
      map.set(company.company_id, company.company_name);
    });
    return map;
  }, [companiesData]);

  const isLoading = botsLoading || companiesLoading;
  const error = botsError || companiesError;

  const [nameFilter, setNameFilter] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<boolean | "all">("all");
  const [sortField, setSortField] = useState<"bot_username" | "created_at">(
    "bot_username"
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const companies = Array.from(
    new Set(
      botsData?.bots.map((bot) => ({
        id: bot.company,
        name: companyMap.get(bot.company) || bot.company,
      })) || []
    )
  );

  const getFilteredAndSortedBots = () => {
    if (!botsData?.bots) return [];

    let filteredBots = [...botsData.bots];

    if (nameFilter) {
      filteredBots = filteredBots.filter(
        (bot) =>
          bot.bot_username.toLowerCase().includes(nameFilter.toLowerCase()) ||
          bot.bot_first_name.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }

    if (companyFilter) {
      filteredBots = filteredBots.filter(
        (bot) => bot.company === companyFilter
      );
    }

    if (statusFilter !== "all") {
      filteredBots = filteredBots.filter(
        (bot) => bot.is_active === statusFilter
      );
    }

    filteredBots.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

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

  useEffect(() => {
    setPage(1);
  }, [nameFilter, companyFilter, statusFilter]);

  if (isLoading)
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  if (error)
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Typography color="error">
          Ошибка: {(error as Error).message}
        </Typography>
      </Box>
    );

  return (
    <Box sx={{ p: 3 }}>
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
              <MenuItem key={company.id} value={company.id}>
                {company.name}
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
          onClick={() => setIsModalOpen(true)}
        >
          Добавить бота
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="bots table">
          <TableHead>
            <TableRow>
              {/* {developerMode &&  */}
              <TableCell>ID</TableCell>
              {/* } */}
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
                  Имя бота
                </TableSortLabel>
              </TableCell>
              <TableCell>Имя</TableCell>
              <TableCell>Компания</TableCell>
              <TableCell>Статус</TableCell>
              {developerMode && (
                <TableCell
                  sortDirection={
                    sortField === "created_at" ? sortDirection : false
                  }
                >
                  <TableSortLabel
                    active={sortField === "created_at"}
                    direction={
                      sortField === "created_at" ? sortDirection : "asc"
                    }
                    onClick={() => handleSort("created_at")}
                  >
                    Дата создания
                  </TableSortLabel>
                </TableCell>
              )}
              <TableCell>Комментарий</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedBots.map((bot) => (
              <TableRow
                key={bot.bot_id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                {/* {developerMode && ( */}
                <TableCell component="th" scope="row">
                  {bot.bot_id}
                </TableCell>
                {/* )} */}
                <TableCell>{bot.bot_username}</TableCell>
                <TableCell>{bot.bot_first_name}</TableCell>
                <TableCell>
                  {companyMap.get(bot.company) || bot.company}
                </TableCell>
                <TableCell>
                  {bot.is_active ? (
                    <Typography color="success.main">Активен</Typography>
                  ) : (
                    <Typography color="error">Неактивен</Typography>
                  )}
                </TableCell>
                {developerMode && (
                  <TableCell>
                    {new Date(bot.created_at).toLocaleString()}
                  </TableCell>
                )}
                <TableCell>{bot.comment || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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

      <AddBotModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </Box>
  );
};
