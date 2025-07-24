"use client";

import type React from "react";
import { useEffect, useState } from "react";
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
  setSortField,
  setSortDirection,
  resetFilters,
} from "../../redux/slice/analysisSlice";
import type { RootState } from "../../redux/store";

export const AnalysisPage: React.FC<PageProps> = ({ developerMode }) => {
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
  const rowsPerPage = 10;
  const isLoading =
    analysisLoading ||
    companiesLoading ||
    chatsLoading ||
    promptsLoading ||
    isLoadingCompanyMap;
  const error = analysisError || companiesError || chatsError || promptsError;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const resetAllFilters = () => {
    dispatch(resetFilters());
  };

  const getFilteredAndSortedAnalysis = () => {
    if (!analysisData?.analysis) return [];

    let filteredAnalysis = [...analysisData.analysis];

    if (chatFilter || chatSelectFilter) {
      const chatFilterValue = chatSelectFilter || chatFilter;
      filteredAnalysis = filteredAnalysis.filter(
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
      filteredAnalysis = filteredAnalysis.filter(
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
      filteredAnalysis = filteredAnalysis.filter(
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
      filteredAnalysis = filteredAnalysis.filter(
        (item) => new Date(item.created_at) >= dateFrom
      );
    }

    if (dateTo) {
      const endOfDay = new Date(dateTo);
      endOfDay.setHours(23, 59, 59, 999);
      filteredAnalysis = filteredAnalysis.filter(
        (item) => new Date(item.created_at) <= endOfDay
      );
    }

    filteredAnalysis.sort((a, b) => {
      const aValue = a[sortField] ?? "";
      const bValue = b[sortField] ?? "";
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return filteredAnalysis;
  };

  const handleSort = (field: keyof IAnalys) => {
    if (sortField === field) {
      dispatch(setSortDirection(sortDirection === "asc" ? "desc" : "asc"));
    } else {
      dispatch(setSortField(field));
      dispatch(setSortDirection("asc"));
    }
  };

  const filteredAnalysis = getFilteredAndSortedAnalysis();
  const totalPages = Math.ceil(filteredAnalysis.length / rowsPerPage);
  const paginatedAnalysis = filteredAnalysis.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  if (error) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
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
      <Box sx={{ pl: 2, pr: 2, maxWidth: 1600, mx: "auto" }}>
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
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
                    Анализ чатов
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ opacity: 0.9 }}
                    color="white"
                  >
                    На этой странице вы можете просмотреть, какие анализы были
                    выполнены ранее, а также запустить новый анализ. Для нового
                    анализа выберите промт, период и чат, затем нажмите
                    «Запустить». Если данных за выбранный период нет —
                    попробуйте выбрать другой интервал или чат.
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
                <Box sx={{ display: "flex", alignItems: "center" }}>
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
                </Box>

                <Box sx={{ display: "flex", alignItems: "center" }}>
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
                </Box>

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
                  </Box>
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
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mb: 3,
                    mt: -3,
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
