import React, { useState, useEffect } from "react";
import { usePromptsQuery } from "../../hooks/prompts/usePromptsQuery";
import {
  Typography,
  Box,
  Button,
  TextField,
  Pagination,
  Tooltip,
  Autocomplete,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import { AddPromptModal } from "./addPromptModal";
import { PageProps } from "../../App";
import { PromptsTable } from "./promptsTable";
import { useCompanyMap } from "../../hooks/maps/useCompanyMap";
import { useAuth } from "../../context/authContext";
import { PageSkeleton } from "../../components/skeleton/pageSkeleton";
import { ResetFiltersButton } from "../../components/table/resetFiltersButton";
import { PaginationControls } from "../../components/table/paginationControls";

export const PromptsPage: React.FC<PageProps> = ({ developerMode }) => {
  const { isSuperadmin } = useAuth();
  const {
    data: promptsData,
    isLoading: promptsLoading,
    error: promptsError,
  } = usePromptsQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { companyMap, isLoadingCompanyMap } = useCompanyMap();

  const isLoading = promptsLoading || isLoadingCompanyMap;
  const error = promptsError;

  const [nameFilter, setNameFilter] = useState("");
  const [nameSelectFilter, setNameSelectFilter] = useState("");
  const [textFilter, setTextFilter] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [companySelectFilter, setCompanySelectFilter] = useState("");
  const [sortField, setSortField] = useState<
    "prompt_name" | "company_id" | "created_at"
  >("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const resetAllFilters = () => {
    setNameFilter("");
    setNameSelectFilter("");
    setTextFilter("");
    setCompanyFilter("");
    setCompanySelectFilter("");
    setSortField("created_at");
    setSortDirection("desc");
    setPage(1);
  };

  const promptNames = Array.from(
    new Set(promptsData?.prompts.map((prompt) => prompt.prompt_name) || [])
  );

  const getFilteredAndSortedPrompts = () => {
    if (!promptsData?.prompts) return [];

    let filteredPrompts = [...promptsData.prompts];

    if (nameFilter || nameSelectFilter) {
      const nameFilterValue = nameSelectFilter || nameFilter;
      filteredPrompts = filteredPrompts.filter((prompt) =>
        prompt.prompt_name.toLowerCase().includes(nameFilterValue.toLowerCase())
      );
    }

    if (textFilter) {
      filteredPrompts = filteredPrompts.filter((prompt) =>
        prompt.text.toLowerCase().includes(textFilter.toLowerCase())
      );
    }

    if (isSuperadmin && (companyFilter || companySelectFilter)) {
      const companyFilterValue = companySelectFilter || companyFilter;
      filteredPrompts = filteredPrompts.filter(
        (prompt) =>
          companyMap
            .get(prompt.company_id)
            ?.toLowerCase()
            .includes(companyFilterValue.toLowerCase()) ||
          prompt.company_id
            .toLowerCase()
            .includes(companyFilterValue.toLowerCase())
      );
    }

    filteredPrompts.sort((a, b) => {
      // Для сортировки по компании используем названия компаний из companyMap
      if (sortField === "company_id") {
        const aCompany = companyMap.get(a.company_id) ?? a.company_id;
        const bCompany = companyMap.get(b.company_id) ?? b.company_id;
        if (aCompany < bCompany) return sortDirection === "asc" ? -1 : 1;
        if (aCompany > bCompany) return sortDirection === "asc" ? 1 : -1;
        return 0;
      }

      // Для остальных полей используем нулевой coalescing оператор
      const aValue = a[sortField] ?? "";
      const bValue = b[sortField] ?? "";

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return filteredPrompts;
  };

  const handleSort = (field: "prompt_name" | "company_id" | "created_at") => {
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
  }, [
    nameFilter,
    nameSelectFilter,
    textFilter,
    companyFilter,
    companySelectFilter,
    sortField,
    sortDirection,
  ]);

  if (isLoading) {
    return (
      <PageSkeleton filterCount={isSuperadmin ? 3 : 2} hasAddButton={true} />
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
        <Autocomplete
          freeSolo
          options={promptNames}
          value={nameSelectFilter || nameFilter}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Поиск по названию"
              variant="outlined"
              size="small"
              onChange={(e) => {
                setNameFilter(e.target.value);
                setNameSelectFilter("");
              }}
            />
          )}
          onChange={(_, value) => {
            setNameSelectFilter(value || "");
            setNameFilter("");
          }}
          sx={{ width: 250 }}
        />

        <TextField
          label="Поиск по тексту"
          variant="outlined"
          size="small"
          value={textFilter}
          onChange={(e) => setTextFilter(e.target.value)}
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

        <ResetFiltersButton onClick={resetAllFilters} />
        <Box sx={{ flexGrow: 1 }} />

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
        isSuperadmin={isSuperadmin}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
      />

      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <PaginationControls
          count={totalPages}
          page={page}
          onPageChange={setPage}
        />
      </Box>

      <AddPromptModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </Box>
  );
};
