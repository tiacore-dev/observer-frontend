import React, { useState, useEffect } from "react";
import { useBotsQuery } from "../../hooks/bots/useBotsQuery";
import { useCompaniesQuery } from "../../hooks/companies/useCompaniesQuery";
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
  Autocomplete,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import { AddBotModal } from "./addBotModal";
import { PageProps } from "../../App";
import { BotsTable } from "./botsTable";
import { useNavigate, useParams } from "react-router-dom";
import { useCompanyMap } from "../../hooks/maps/useCompanyMap";
import { BotDetailsPage } from "./botDetailsPage";
import { useAuth } from "../../context/authContext";
import { PageSkeleton } from "../../components/skeleton/pageSkeleton";
import { ResetFiltersButton } from "../../components/table/resetFiltersButton";
import { PaginationControls } from "../../components/table/paginationControls";

export const BotsPage: React.FC<PageProps> = ({ developerMode }) => {
  const { botId } = useParams();
  const navigate = useNavigate();
  const { isSuperadmin } = useAuth();
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

  const { companyMap, isLoading: isLoadingCompanyMap } = useCompanyMap();

  const isLoading = botsLoading || companiesLoading || isLoadingCompanyMap;
  const error = botsError || companiesError;

  const [botNameFilter, setBotNameFilter] = useState("");
  const [botNameSelectFilter, setBotNameSelectFilter] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [companySelectFilter, setCompanySelectFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<boolean | "all">("all");
  const [sortField, setSortField] = useState<
    | "bot_username"
    | "bot_first_name"
    | "company_id"
    | "is_active"
    | "comment"
    | "created_at"
  >("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const resetAllFilters = () => {
    setBotNameFilter("");
    setBotNameSelectFilter("");
    setCompanyFilter("");
    setCompanySelectFilter("");
    setStatusFilter("all");
    setSortField("created_at");
    setSortDirection("desc");
    setPage(1);
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
          bot.company_id
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
      // Special handling for boolean is_active field
      if (sortField === "is_active") {
        if (a.is_active === b.is_active) return 0;
        if (sortDirection === "asc") {
          return a.is_active ? -1 : 1;
        } else {
          return a.is_active ? 1 : -1;
        }
      }

      // Special handling for company_id (compare company names)
      if (sortField === "company_id") {
        const aCompany = companyMap.get(a.company_id) ?? a.company_id;
        const bCompany = companyMap.get(b.company_id) ?? b.company_id;
        if (aCompany < bCompany) return sortDirection === "asc" ? -1 : 1;
        if (aCompany > bCompany) return sortDirection === "asc" ? 1 : -1;
        return 0;
      }

      // Handle undefined/null values with nullish coalescing
      const aValue = a[sortField] ?? "";
      const bValue = b[sortField] ?? "";

      // Default comparison
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
    return filteredBots;
  };

  const handleSort = (field: typeof sortField) => {
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
  }, [
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

  if (isLoading) {
    return (
      <PageSkeleton
        filterCount={isSuperadmin ? 5 : 4}
        tableHeight={200}
        pagination
      />
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Typography color="error">
          Ошибка: {(error as Error).message}
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
        <Autocomplete
          freeSolo
          options={botNames}
          value={botNameSelectFilter || botNameFilter}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Поиск по имени бота"
              variant="outlined"
              size="small"
              onChange={(e) => {
                setBotNameFilter(e.target.value);
                setBotNameSelectFilter("");
              }}
            />
          )}
          onChange={(_, value) => {
            setBotNameSelectFilter(value || "");
            setBotNameFilter("");
          }}
          sx={{ width: 250 }}
        />

        {isSuperadmin && (
          <Autocomplete
            freeSolo
            options={Array.from(companyMap.values())}
            value={companySelectFilter || companyFilter}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Поиск по компании"
                variant="outlined"
                size="small"
                onChange={(e) => {
                  setCompanyFilter(e.target.value);
                  setCompanySelectFilter("");
                }}
              />
            )}
            onChange={(_, value) => {
              setCompanySelectFilter(value || "");
              setCompanyFilter("");
            }}
            sx={{ width: 250 }}
          />
        )}

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

        <ResetFiltersButton onClick={resetAllFilters} />
        <Box sx={{ flexGrow: 1 }} />

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
        <PaginationControls
          count={totalPages}
          page={page}
          onPageChange={setPage}
        />
      </Box>

      <AddBotModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </Box>
  );
};
