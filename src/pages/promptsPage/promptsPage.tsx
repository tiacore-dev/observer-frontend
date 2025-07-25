"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { usePromptsQuery } from "../../hooks/prompts/usePromptsQuery";
import {
  Typography,
  Box,
  Button,
  TextField,
  Tooltip,
  Autocomplete,
  Collapse,
  Paper,
  Alert,
  Chip,
  Avatar,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { AddPromptModal } from "./addPromptModal";
import type { PageProps } from "../../App";
import { PromptsTable } from "./promptsTable";
import { useCompanyMap } from "../../hooks/maps/useCompanyMap";
import { useAuth } from "../../context/authContext";
import { PageSkeleton } from "../../components/skeleton/pageSkeleton";
import { ResetFiltersButton } from "../../components/table/resetFiltersButton";
import { PaginationControls } from "../../components/table/paginationControls";
import { HelpTooltip } from "../../components/helpTooltip";
import { InfoCard } from "../../components/infoCard";
import { ExpandMore, ExpandLess, Psychology } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  setNameFilter,
  setNameSelectFilter,
  setTextFilter,
  setCompanyFilter,
  setCompanySelectFilter,
  setPage,
  setSortField,
  setSortDirection,
  resetFilters,
} from "../../redux/slice/promptsSlice";
import type { RootState } from "../../redux/store";

export const PromptsPage: React.FC<PageProps> = ({ developerMode }) => {
  const { isSuperadmin } = useAuth();
  const dispatch = useDispatch();
  const {
    nameFilter,
    nameSelectFilter,
    textFilter,
    companyFilter,
    companySelectFilter,
    page,
    sortField,
    sortDirection,
  } = useSelector((state: RootState) => state.prompts);

  const {
    data: promptsData,
    isLoading: promptsLoading,
    error: promptsError,
  } = usePromptsQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const { companyMap, isLoadingCompanyMap } = useCompanyMap();

  const isLoading = promptsLoading || isLoadingCompanyMap;
  const error = promptsError;

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
      if (sortField === "company_id") {
        const aCompany = companyMap.get(a.company_id) ?? a.company_id;
        const bCompany = companyMap.get(b.company_id) ?? b.company_id;
        if (aCompany < bCompany) return sortDirection === "asc" ? -1 : 1;
        if (aCompany > bCompany) return sortDirection === "asc" ? 1 : -1;
        return 0;
      }

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
      dispatch(setSortDirection(sortDirection === "asc" ? "desc" : "asc"));
    } else {
      dispatch(setSortField(field));
      dispatch(setSortDirection("asc"));
    }
  };

  const resetAllFilters = () => {
    dispatch(resetFilters());
  };

  const filteredPrompts = getFilteredAndSortedPrompts();
  const rowsPerPage = 10;
  const totalPages = Math.ceil(filteredPrompts.length / rowsPerPage);
  const paginatedPrompts = filteredPrompts.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  if (isLoading) {
    return (
      <PageSkeleton filterCount={isSuperadmin ? 3 : 2} hasAddButton={true} />
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Alert severity="error" sx={{ maxWidth: 600 }}>
          <Typography variant="h6" gutterBottom>
            Ошибка при загрузке промптов
          </Typography>
          <Typography variant="body2">
            Произошла ошибка при загрузке данных: {(error as Error).message}
          </Typography>
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ pl: 2, pr: 2, mt: -1, mb: -1, maxWidth: 1600, mx: "auto" }}>
      {/* Заголовок страницы */}
      <Paper
        elevation={1}
        sx={{
          p: 3,
          mb: 1,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Psychology sx={{ fontSize: 40 }} />
          <Box>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{ mb: 1, fontWeight: 600 }}
              color="white"
            >
              Промпты
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }} color="white">
              На этой странице вы можете создавать и редактировать промты,
              которые будут использоваться в чатах.
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Фильтры */}
      <Paper elevation={1} sx={{ p: 2, mb: 1 }}>
        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {/* Фильтр по названию */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
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
                    dispatch(setNameFilter(e.target.value));
                  }}
                  sx={{ width: 250 }}
                />
              )}
              onChange={(_, value) => {
                dispatch(setNameSelectFilter(value || ""));
              }}
            />
          </Box>

          {/* Фильтр по тексту */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <TextField
              label="Поиск по тексту"
              variant="outlined"
              size="small"
              value={textFilter}
              onChange={(e) => dispatch(setTextFilter(e.target.value))}
              sx={{ width: 250 }}
            />
          </Box>

          {/* Фильтр по компании (только для суперадмина) */}
          {isSuperadmin && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
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
                      dispatch(setCompanyFilter(e.target.value));
                    }}
                    sx={{ width: 250 }}
                  />
                )}
                onChange={(_, value) => {
                  dispatch(setCompanySelectFilter(value || ""));
                }}
              />
            </Box>
          )}

          <ResetFiltersButton onClick={resetAllFilters} />

          <Box sx={{ flexGrow: 1 }} />

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsModalOpen(true)}
            style={{ backgroundColor: "#7353ae" }}
          >
            Добавить промпт
          </Button>
        </Box>
      </Paper>

      {/* Таблица */}
      <Paper elevation={1} sx={{ overflow: "hidden" }}>
        <PromptsTable
          prompts={paginatedPrompts}
          companyMap={companyMap}
          developerMode={developerMode}
          isSuperadmin={isSuperadmin}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
        />

        {/* Пагинация */}
        {totalPages > 1 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 3,
              mt: 0,
            }}
          >
            <PaginationControls
              count={totalPages}
              page={page}
              onPageChange={(newPage) => dispatch(setPage(newPage))}
            />
          </Box>
        )}
      </Paper>

      {/* Пустое состояние */}
      {filteredPrompts.length === 0 && !isLoading && (
        <Paper elevation={1} sx={{ p: 1, textAlign: "center", mb: 1 }}>
          <Psychology sx={{ fontSize: 64, color: "text.secondary", mt: 2 }} />
          <Typography variant="h6" gutterBottom color="text.secondary">
            {nameFilter || textFilter || companyFilter
              ? "Промпты не найдены"
              : "Нет доступных промптов"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {nameFilter || textFilter || companyFilter
              ? "Попробуйте изменить параметры поиска"
              : "Создайте первый промпт, нажав на кнопку выше"}
          </Typography>
        </Paper>
      )}

      <AddPromptModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </Box>
  );
};
