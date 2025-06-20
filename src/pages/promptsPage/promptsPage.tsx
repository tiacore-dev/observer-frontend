import React, { useState, useEffect, useMemo } from "react";
import { usePromptsQuery } from "../../hooks/prompts/usePromptsQuery";
import { useCompaniesQuery } from "../../hooks/companies/useCompaniesQuery";
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
  IconButton,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear"; // Добавлена иконка для кнопки сброса
import { AddPromptModal } from "./addPromptModal";
import { PageProps } from "../../App";
import { PromptsTable } from "./promptsTable";
import { useCompanyMap } from "../../hooks/maps/useCompanyMap";

export const PromptsPage: React.FC<PageProps> = ({ developerMode }) => {
  const {
    data: promptsData,
    isLoading: promptsLoading,
    error: promptsError,
  } = usePromptsQuery();
  const {
    data: companiesData,
    isLoading: companiesLoading,
    error: companiesError,
  } = useCompaniesQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const companyMap = useCompanyMap();

  const isLoading = promptsLoading || companiesLoading;
  const error = promptsError || companiesError;

  const [nameFilter, setNameFilter] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [sortField, setSortField] = useState<"prompt_name" | "created_at">(
    "prompt_name"
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  // Функция для сброса всех фильтров
  const resetAllFilters = () => {
    setNameFilter("");
    setCompanyFilter("");
    setSortField("prompt_name");
    setSortDirection("asc");
    setPage(1);
  };

  const companies = Array.from(
    new Set(
      promptsData?.prompts.map((prompt) => ({
        id: prompt.company_id,
        name: companyMap.get(prompt.company_id) || prompt.company_id,
      })) || []
    )
  );

  const getFilteredAndSortedPrompts = () => {
    if (!promptsData?.prompts) return [];

    let filteredPrompts = [...promptsData.prompts];

    if (nameFilter) {
      filteredPrompts = filteredPrompts.filter((prompt) =>
        prompt.prompt_name.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }

    if (companyFilter) {
      filteredPrompts = filteredPrompts.filter(
        (prompt) => prompt.company_id === companyFilter
      );
    }

    filteredPrompts.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return filteredPrompts;
  };

  const handleSort = (field: "prompt_name" | "created_at") => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredPrompts = getFilteredAndSortedPrompts();
  const totalPages = Math.ceil(filteredPrompts.length / rowsPerPage);
  const paginatedPrompts = filteredPrompts.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  useEffect(() => {
    setPage(1);
  }, [nameFilter, companyFilter]);

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

        {/* Кнопка сброса фильтров */}
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
          Добавить промпт
        </Button>
      </Box>

      <PromptsTable
        prompts={paginatedPrompts}
        companyMap={companyMap}
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

      <AddPromptModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </Box>
  );
};
