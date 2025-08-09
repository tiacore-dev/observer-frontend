"use client";

import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { useAnalysisQuery } from "../../hooks/analysis/useAnalysisQuery";
import { useCompaniesQuery } from "../../hooks/companies/useCompaniesQuery";
import { useChatsSelectQuery } from "../../hooks/chats/useChatsQuery";
import { usePromptsQuery } from "../../hooks/prompts/usePromptsQuery";
import {
  Typography,
  Box,
  TextField,
  Button,
  Autocomplete,
  Paper,
  Alert,
} from "@mui/material";
import type { PageProps } from "../../App";
import { AnalysisTable } from "./analysisTable";
import { useNavigate } from "react-router-dom";
import type { IAnalys } from "../../api/analysisApi";
import AddIcon from "@mui/icons-material/Add";
import { AddAnalysisModal } from "./addAnalysisModal";
import { useCompanyMap } from "../../hooks/maps/useCompanyMap";
import { useChatMap } from "../../hooks/maps/useChatMap";
import { usePromptMap } from "../../hooks/maps/usePromptMap";
import { PageSkeleton } from "../../components/skeleton/pageSkeleton";
import { useAuth } from "../../context/authContext";
import { ResetFiltersButton } from "../../components/table/resetFiltersButton";
import { PaginationControls } from "../../components/table/paginationControls";
import { Analytics } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ru } from "date-fns/locale";
import { useDispatch, useSelector } from "react-redux";
import {
  setChatFilter,
  setChatSelectFilter,
  setPromptFilter,
  setPromptSelectFilter,
  setCompanyFilter,
  setCompanySelectFilter,
  setDateFrom,
  setDateTo,
  setPage,
  setRowsPerPage,
  setSortField,
  setSortDirection,
  resetFilters,
} from "../../redux/slice/analysisSlice";
import type { RootState } from "../../redux/store";
import { useThemeMode } from "../../context/themeContext";

export const AnalysisPage: React.FC<PageProps> = ({ developerMode }) => {
  const theme = useThemeMode();

  const { isSuperadmin } = useAuth();
  const dispatch = useDispatch();
  const {
    chatFilter,
    chatSelectFilter,
    promptFilter,
    promptSelectFilter,
    companyFilter,
    companySelectFilter,
    dateFrom,
    dateTo,
    page,
    rowsPerPage,
    sortField,
    sortDirection,
  } = useSelector((state: RootState) => state.analysis);

  const {
    data: analysisData,
    isLoading: analysisLoading,
    error: analysisError,
    refetch,
  } = useAnalysisQuery();
  const { isLoading: companiesLoading, error: companiesError } =
    useCompaniesQuery();
  const {
    data: chatsData,
    isLoading: chatsLoading,
    error: chatsError,
  } = useChatsSelectQuery();
  const {
    data: promptsData,
    isLoading: promptsLoading,
    error: promptsError,
  } = usePromptsQuery();
  const navigate = useNavigate();

  const { companyMap, isLoadingCompanyMap } = useCompanyMap();
  const { chatMap, isLoadingChatsMap } = useChatMap();
  const { promptMap, isLoadingPromptMap } = usePromptMap();

  const isLoading =
    analysisLoading ||
    companiesLoading ||
    chatsLoading ||
    promptsLoading ||
    isLoadingCompanyMap ||
    isLoadingChatsMap ||
    isLoadingPromptMap;
  const error = analysisError || companiesError || chatsError || promptsError;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const resetAllFilters = () => {
    dispatch(resetFilters());
  };

  const filteredAnalysis = useMemo(() => {
    if (!analysisData?.analysis) return [];

    let filtered = [...analysisData.analysis];

    if (chatFilter || chatSelectFilter) {
      const chatFilterValue = chatSelectFilter || chatFilter;
      filtered = filtered.filter(
        (item) =>
          chatMap
            .get(item.chat_id)
            ?.toLowerCase()
            .includes(chatFilterValue.toLowerCase()) ??
          item.chat_id.toString().includes(chatFilterValue)
      );
    }

    if (promptFilter || promptSelectFilter) {
      const promptFilterValue = promptSelectFilter || promptFilter;
      filtered = filtered.filter(
        (item) =>
          promptMap
            .get(item.prompt_id)
            ?.toLowerCase()
            .includes(promptFilterValue.toLowerCase()) ??
          item.prompt_id.toLowerCase().includes(promptFilterValue.toLowerCase())
      );
    }

    if (isSuperadmin && (companyFilter || companySelectFilter)) {
      const companyFilterValue = companySelectFilter || companyFilter;
      filtered = filtered.filter(
        (item) =>
          companyMap
            .get(item.company_id)
            ?.toLowerCase()
            .includes(companyFilterValue.toLowerCase()) ??
          item.company_id
            .toLowerCase()
            .includes(companyFilterValue.toLowerCase())
      );
    }

    if (dateFrom) {
      filtered = filtered.filter(
        (item) => new Date(item.created_at) >= dateFrom
      );
    }

    if (dateTo) {
      const endOfDay = new Date(dateTo);
      endOfDay.setHours(23, 59, 59, 999);
      filtered = filtered.filter(
        (item) => new Date(item.created_at) <= endOfDay
      );
    }

    return filtered.sort((a, b) => {
      const aValue = a[sortField]?.toString() ?? "";
      const bValue = b[sortField]?.toString() ?? "";
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });
  }, [
    analysisData,
    chatFilter,
    chatSelectFilter,
    promptFilter,
    promptSelectFilter,
    companyFilter,
    companySelectFilter,
    dateFrom,
    dateTo,
    sortField,
    sortDirection,
    chatMap,
    promptMap,
    companyMap,
    isSuperadmin,
  ]);

  const totalItems = filteredAnalysis.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const paginatedAnalysis = useMemo(() => {
    return filteredAnalysis.slice(
      (currentPage - 1) * rowsPerPage,
      currentPage * rowsPerPage
    );
  }, [filteredAnalysis, currentPage, rowsPerPage]);

  useEffect(() => {
    if (page !== currentPage) {
      dispatch(setPage(currentPage));
    }
  }, [page, currentPage, dispatch]);

  const handleSort = (field: keyof IAnalys) => {
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

  if (error) {
    return (
      <Box display="flex" justifyContent="center" mt={-1}>
        <Alert severity="error" sx={{ maxWidth: 600 }}>
          <Typography variant="h6" gutterBottom>
            Не удалось загрузить анализы
          </Typography>
          <Typography variant="body2">
            Произошла ошибка при загрузке данных: {(error as Error).message}
          </Typography>
        </Alert>
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
      <Box sx={{ pl: 2, pr: 1, mt: -1, mb: -2, maxWidth: 1600, mx: "auto" }}>
        {isLoading ? (
          <PageSkeleton
            filterCount={isSuperadmin ? 5 : 4}
            pagination={true}
            hasAddButton={true}
          />
        ) : (
          <>
            <Paper
              elevation={1}
              sx={{
                p: 3,
                mb: 1,
                background: theme.isDarkMode
                  ? "linear-gradient(135deg, #6366f1aa 0%, #8b5cf6aa 100%)"
                  : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Analytics sx={{ fontSize: 40 }} />
                <Box>
                  <Typography
                    variant="h4"
                    component="h1"
                    gutterBottom
                    sx={{ mb: 1, fontWeight: 600 }}
                    color="white"
                  >
                    Результаты анализов
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ opacity: 0.9 }}
                    color="white"
                  >
                    На этой странице вы можете просмотреть, какие анализы были
                    выполнены ранее, а также запустить новый анализ.
                  </Typography>
                </Box>
              </Box>
            </Paper>

            <Paper elevation={1} sx={{ p: 2, mb: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <Autocomplete
                  freeSolo
                  options={Array.from(chatMap.values())}
                  value={chatSelectFilter || chatFilter}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Поиск по чату"
                      variant="outlined"
                      size="small"
                      sx={{ width: 250 }}
                      onChange={(e) => {
                        dispatch(setChatFilter(e.target.value));
                      }}
                    />
                  )}
                  onChange={(_, value) => {
                    dispatch(setChatSelectFilter(value || ""));
                  }}
                />

                <Autocomplete
                  freeSolo
                  options={Array.from(promptMap.values())}
                  value={promptSelectFilter || promptFilter}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Поиск по промпту"
                      variant="outlined"
                      size="small"
                      sx={{ width: 250 }}
                      onChange={(e) => {
                        dispatch(setPromptFilter(e.target.value));
                      }}
                    />
                  )}
                  onChange={(_, value) => {
                    dispatch(setPromptSelectFilter(value || ""));
                  }}
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
                        sx={{ width: 250 }}
                        onChange={(e) => {
                          dispatch(setCompanyFilter(e.target.value));
                        }}
                      />
                    )}
                    onChange={(_, value) => {
                      dispatch(setCompanySelectFilter(value || ""));
                    }}
                  />
                )}

                <DatePicker
                  label="От"
                  value={dateFrom}
                  onChange={(newValue) => dispatch(setDateFrom(newValue))}
                  slotProps={{
                    textField: {
                      size: "small",
                      sx: { width: 150 },
                      variant: "outlined",
                    },
                  }}
                />

                <DatePicker
                  label="До"
                  value={dateTo}
                  onChange={(newValue) => dispatch(setDateTo(newValue))}
                  minDate={dateFrom || undefined}
                  slotProps={{
                    textField: {
                      size: "small",
                      sx: { width: 150 },
                      variant: "outlined",
                    },
                  }}
                />

                <ResetFiltersButton onClick={resetAllFilters} />

                <Box sx={{ flexGrow: 1 }} />

                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setIsModalOpen(true)}
                  style={{ backgroundColor: "#7353ae" }}
                >
                  Новый анализ
                </Button>
              </Box>
            </Paper>

            <Paper elevation={1} sx={{ overflow: "hidden" }}>
              <AnalysisTable
                analysis={paginatedAnalysis}
                companyMap={companyMap}
                chatMap={chatMap}
                promptMap={promptMap}
                developerMode={developerMode}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
                onRowClick={
                  developerMode
                    ? (id) => navigate(`/analysis/${id}`)
                    : undefined
                }
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

            {filteredAnalysis.length === 0 && !isLoading && (
              <Paper elevation={1} sx={{ p: 1, textAlign: "center", mb: 1 }}>
                <Analytics
                  sx={{ fontSize: 64, color: "text.secondary", mt: 2 }}
                />
                <Typography variant="h6" gutterBottom color="text.secondary">
                  {chatFilter ||
                  promptFilter ||
                  companyFilter ||
                  dateFrom ||
                  dateTo
                    ? "Анализы не найдены"
                    : "Нет доступных анализов"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {chatFilter ||
                  promptFilter ||
                  companyFilter ||
                  dateFrom ||
                  dateTo
                    ? "Попробуйте изменить параметры поиска"
                    : "Создайте первый анализ, нажав на кнопку выше"}
                </Typography>
              </Paper>
            )}

            <AddAnalysisModal
              open={isModalOpen}
              onClose={() => setIsModalOpen(false)}
            />
          </>
        )}
      </Box>
    </LocalizationProvider>
  );
};
