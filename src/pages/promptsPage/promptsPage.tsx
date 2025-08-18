"use client";

import type React from "react";
import { useEffect, useMemo, useState } from "react";
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
  IconButton,
  useMediaQuery,
  Theme,
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
  setRowsPerPage,
  setSortField,
  setSortDirection,
  resetFilters,
} from "../../redux/slice/promptsSlice";
import type { RootState } from "../../redux/store";
import { useThemeMode } from "../../context/themeContext";
import SearchIcon from "@mui/icons-material/Search";

export const PromptsPage: React.FC<PageProps> = ({ developerMode }) => {
  const theme = useThemeMode();
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );

  const { isSuperadmin } = useAuth();
  const dispatch = useDispatch();
  const {
    nameFilter,
    nameSelectFilter,
    textFilter,
    companyFilter,
    companySelectFilter,
    page,
    rowsPerPage,
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
  const [searchOpen, setSearchOpen] = useState(false);

  const { companyMap, isLoadingCompanyMap } = useCompanyMap();

  const isLoading = promptsLoading || isLoadingCompanyMap;
  const error = promptsError;

  const promptNames = useMemo(
    () =>
      Array.from(
        new Set(promptsData?.prompts.map((prompt) => prompt.prompt_name) || [])
      ),
    [promptsData]
  );

  const filteredPrompts = useMemo(() => {
    if (!promptsData?.prompts) return [];

    let filtered = [...promptsData.prompts];

    if (nameFilter || nameSelectFilter) {
      const nameFilterValue = nameSelectFilter || nameFilter;
      filtered = filtered.filter((prompt) =>
        prompt.prompt_name.toLowerCase().includes(nameFilterValue.toLowerCase())
      );
    }

    if (textFilter) {
      filtered = filtered.filter((prompt) =>
        prompt.text.toLowerCase().includes(textFilter.toLowerCase())
      );
    }

    if (isSuperadmin && (companyFilter || companySelectFilter)) {
      const companyFilterValue = companySelectFilter || companyFilter;
      filtered = filtered.filter(
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

    return filtered.sort((a, b) => {
      if (sortField === "company_id") {
        const aCompany = companyMap.get(a.company_id) ?? a.company_id;
        const bCompany = companyMap.get(b.company_id) ?? b.company_id;
        return sortDirection === "asc"
          ? aCompany.localeCompare(bCompany)
          : bCompany.localeCompare(aCompany);
      }

      const aValue = a[sortField] ?? "";
      const bValue = b[sortField] ?? "";
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });
  }, [
    promptsData,
    nameFilter,
    nameSelectFilter,
    textFilter,
    companyFilter,
    companySelectFilter,
    sortField,
    sortDirection,
    companyMap,
    isSuperadmin,
  ]);

  const totalItems = filteredPrompts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const paginatedPrompts = useMemo(() => {
    return filteredPrompts.slice(
      (currentPage - 1) * rowsPerPage,
      currentPage * rowsPerPage
    );
  }, [filteredPrompts, currentPage, rowsPerPage]);

  useEffect(() => {
    if (page !== currentPage) {
      dispatch(setPage(currentPage));
    }
  }, [page, currentPage, dispatch]);

  const handleSort = (field: "prompt_name" | "company_id" | "created_at") => {
    if (sortField === field) {
      dispatch(setSortDirection(sortDirection === "asc" ? "desc" : "asc"));
    } else {
      dispatch(setSortField(field));
      dispatch(setSortDirection("asc"));
    }
  };

  const handlePageChange = (newPage: number) => {
    dispatch(setPage(Math.max(1, Math.min(newPage, totalPages))));
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    const newTotalPages = Math.max(1, Math.ceil(totalItems / newRowsPerPage));
    dispatch(setRowsPerPage(newRowsPerPage));
    dispatch(setPage(Math.min(currentPage, newTotalPages)));
  };

  const resetAllFilters = () => {
    dispatch(resetFilters());
  };

  if (isLoading) {
    return (
      <PageSkeleton filterCount={isSuperadmin ? 3 : 2} hasAddButton={true} />
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" mt={-1}>
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
    <Box
      sx={{
        pl: isMobile ? 1 : 2,
        pr: isMobile ? 1 : 2,
        mt: -1,
        mb: -2,
        maxWidth: 1600,
        mx: "auto",
      }}
    >
      <Paper
        elevation={1}
        sx={{
          p: isMobile ? 2 : 3,
          mb: 1,
          background: theme.isDarkMode
            ? "linear-gradient(135deg, #6366f1aa 0%, #8b5cf6aa 100%)"
            : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Psychology sx={{ fontSize: isMobile ? 32 : 40 }} />
          <Box>
            <Typography
              variant={isMobile ? "h5" : "h4"}
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

      <Paper elevation={1} sx={{ p: isMobile ? 1 : 2, mb: 1 }}>
        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {isMobile ? (
            <>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton onClick={() => setSearchOpen(!searchOpen)}>
                  <SearchIcon />
                </IconButton>
                <ResetFiltersButton onClick={resetAllFilters} />
              </Box>
              <Box sx={{ flexGrow: 1 }} />
              <Button
                variant="contained"
                onClick={() => setIsModalOpen(true)}
                startIcon={<AddIcon />}
                size="small"
                sx={{
                  whiteSpace: "nowrap",
                  backgroundColor: "#7353ae",
                }}
              >
                Добавить
              </Button>
            </>
          ) : (
            <>
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

              <TextField
                label="Поиск по тексту"
                variant="outlined"
                size="small"
                value={textFilter}
                onChange={(e) => dispatch(setTextFilter(e.target.value))}
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
                        dispatch(setCompanyFilter(e.target.value));
                      }}
                      sx={{ width: 250 }}
                    />
                  )}
                  onChange={(_, value) => {
                    dispatch(setCompanySelectFilter(value || ""));
                  }}
                />
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
            </>
          )}
        </Box>
        {isMobile && searchOpen && (
          <Paper
            sx={{
              mt: 1,
              display: "flex",
              flexDirection: "column",
              gap: 1,
              backgroundColor: "background.paper",
            }}
          >
            <TextField
              fullWidth
              label="Поиск по названию"
              variant="outlined"
              size="small"
              value={nameFilter}
              onChange={(e) => dispatch(setNameFilter(e.target.value))}
              placeholder="Введите название"
            />
            <TextField
              fullWidth
              label="Поиск по тексту"
              variant="outlined"
              size="small"
              value={textFilter}
              onChange={(e) => dispatch(setTextFilter(e.target.value))}
              placeholder="Введите текст"
            />
            {isSuperadmin && (
              <TextField
                fullWidth
                label="Поиск по компании"
                variant="outlined"
                size="small"
                value={companyFilter}
                onChange={(e) => dispatch(setCompanyFilter(e.target.value))}
                placeholder="Введите компанию"
              />
            )}
          </Paper>
        )}
      </Paper>

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
        {totalPages > 1 && (
          <PaginationControls
            count={totalPages}
            page={currentPage}
            onPageChange={handlePageChange}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleRowsPerPageChange}
            totalItems={totalItems}
          />
        )}
      </Paper>

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
