import React, { useState, useEffect, useMemo } from "react";
import { useBotsQuery } from "../../hooks/bots/useBotsQuery";
import { useCompaniesQuery } from "../../hooks/companies/useCompaniesQuery";
import { useBotDetailsQuery } from "../../hooks/bots/useBotsQuery";
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
import { AddBotModal } from "./addBotModal";
import { PageProps } from "../../App";
import { BotsTable } from "./botsTable";
import { useNavigate, useParams } from "react-router-dom";
import { BotCard } from "./botCard";

const BotDetailsPage: React.FC<{ botId: string; developerMode: boolean }> = ({
  botId,
  developerMode,
}) => {
  const { data: bot, isLoading, error } = useBotDetailsQuery(botId);
  const { data: companiesData } = useCompaniesQuery();

  const companyMap = useMemo(() => {
    const map = new Map<string, string>();
    companiesData?.companies?.forEach((company) => {
      map.set(company.company_id, company.company_name);
    });
    return map;
  }, [companiesData]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !bot) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Typography color="error">
          Ошибка: {(error as Error)?.message || "Бот не найден"}
        </Typography>
      </Box>
    );
  }

  return (
    <BotCard
      bot={bot}
      companyName={companyMap.get(bot.company) || bot.company}
      developerMode={developerMode}
    />
  );
};

export const BotsPage: React.FC<PageProps> = ({ developerMode }) => {
  const { botId } = useParams();
  const navigate = useNavigate();
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
        id: bot.company_id,
        name: companyMap.get(bot.company_id) || bot.company_id,
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
        (bot) => bot.company_id === companyFilter
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

  if (botId) {
    return <BotDetailsPage botId={botId} developerMode={developerMode} />;
  }

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

      <BotsTable
        bots={paginatedBots}
        companyMap={companyMap}
        developerMode={developerMode}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
        onRowClick={(botId) => navigate(`/bots/${botId}`)}
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

      <AddBotModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </Box>
  );
};
