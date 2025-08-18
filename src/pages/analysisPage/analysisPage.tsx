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
  IconButton,
  useMediaQuery,
  Theme,
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
import { Analytics, Search } from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ru } from "date-fns/locale";
import { useDispatch, useSelector } from "react-redux";
import {
  setChatSelectFilter,
  setPromptSelectFilter,
  setPage,
  setRowsPerPage,
  setSortField,
  setSortDirection,
  resetFilters,
  setModelFilter,
} from "../../redux/slice/analysisSlice";
import type { RootState } from "../../redux/store";
import { useThemeMode } from "../../context/themeContext";

export type ModelId = "yandex-gpt-mini" | "yandex-gpt-pro" | null;

export interface ModelOption {
  id: ModelId;
  name: string;
}

export const MODEL_OPTIONS: ModelOption[] = [
  { id: "yandex-gpt-mini", name: "Yandex GPT Mini" },
  { id: "yandex-gpt-pro", name: "Yandex GPT Pro" },
  { id: null, name: "Все модели" },
];

export const AnalysisPage: React.FC<PageProps> = ({ developerMode }) => {
  const theme = useThemeMode();
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );
  const { isSuperadmin } = useAuth();
  const dispatch = useDispatch();
  const {
    chatSelectFilter,
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
  const [selectedModel, setSelectedModel] = useState<ModelOption | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

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

  const chatOptions = useMemo(() => {
    return (
      chatsData?.chats?.map((chat) => ({
        id: chat.chat_id,
        name: chat.chat_name,
      })) || []
    );
  }, [chatsData]);

  const promptOptions = useMemo(() => {
    return (
      promptsData?.prompts?.map((prompt) => ({
        id: prompt.prompt_id,
        name: prompt.prompt_name,
      })) || []
    );
  }, [promptsData]);

  const selectedChat = useMemo(() => {
    return chatOptions.find((chat) => chat.id === chatSelectFilter) || null;
  }, [chatOptions, chatSelectFilter]);

  const selectedPrompt = useMemo(() => {
    return (
      promptOptions.find((prompt) => prompt.id === promptSelectFilter) || null
    );
  }, [promptsData, promptSelectFilter]);

  const filteredAnalysis = analysisData?.analysis || [];
  const totalItems = analysisData?.total || 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));

  useEffect(() => {
    refetch();
  }, [
    page,
    rowsPerPage,
    chatSelectFilter,
    promptSelectFilter,
    companySelectFilter,
    dateFrom,
    dateTo,
    sortField,
    sortDirection,
    refetch,
  ]);

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
    dispatch(setPage(Math.min(page, newTotalPages)));
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
                p: isMobile ? 2 : 3,
                mb: 1,
                background: theme.isDarkMode
                  ? "linear-gradient(135deg, #6366f1aa 0%, #8b5cf6aa 100%)"
                  : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Analytics sx={{ fontSize: isMobile ? 32 : 40 }} />
                <Box>
                  <Typography
                    variant={isMobile ? "h5" : "h4"}
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
                        <Search />
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
                        "& .MuiButton-startIcon": {
                          marginRight: 0.5,
                        },
                      }}
                    >
                      Новый анализ
                    </Button>
                  </>
                ) : (
                  <>
                    <Autocomplete
                      options={chatOptions}
                      getOptionLabel={(option) => option.name}
                      value={selectedChat}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Чат"
                          variant="outlined"
                          size="small"
                          sx={{ width: 250 }}
                        />
                      )}
                      onChange={(_, value) => {
                        dispatch(setChatSelectFilter(value?.id || null));
                      }}
                    />

                    <Autocomplete
                      options={promptOptions}
                      getOptionLabel={(option) => option.name}
                      value={selectedPrompt}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Промпт"
                          variant="outlined"
                          size="small"
                          sx={{ width: 250 }}
                        />
                      )}
                      onChange={(_, value) => {
                        dispatch(setPromptSelectFilter(value?.id || null));
                      }}
                    />
                    {isSuperadmin && (
                      <Autocomplete<ModelOption>
                        options={MODEL_OPTIONS}
                        getOptionLabel={(option) => option.name}
                        value={selectedModel}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Модель"
                            variant="outlined"
                            size="small"
                            sx={{ width: 250 }}
                          />
                        )}
                        onChange={(_, value) => {
                          setSelectedModel(value);
                          dispatch(setModelFilter(value?.id ?? null));
                        }}
                        isOptionEqualToValue={(option, value) =>
                          option.id === value?.id
                        }
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
                      Новый анализ
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
                  <Autocomplete
                    sx={{ width: "100%" }}
                    options={chatOptions}
                    getOptionLabel={(option) => option.name}
                    value={selectedChat}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Чат"
                        variant="outlined"
                        size="small"
                        fullWidth
                      />
                    )}
                    onChange={(_, value) => {
                      dispatch(setChatSelectFilter(value?.id || null));
                    }}
                  />

                  <Autocomplete
                    sx={{ width: "100%" }}
                    options={promptOptions}
                    getOptionLabel={(option) => option.name}
                    value={selectedPrompt}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Промпт"
                        variant="outlined"
                        size="small"
                        fullWidth
                      />
                    )}
                    onChange={(_, value) => {
                      dispatch(setPromptSelectFilter(value?.id || null));
                    }}
                  />

                  {isSuperadmin && (
                    <Autocomplete<ModelOption>
                      sx={{ width: "100%" }}
                      options={MODEL_OPTIONS}
                      getOptionLabel={(option) => option.name}
                      value={selectedModel}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Модель"
                          variant="outlined"
                          size="small"
                          fullWidth
                        />
                      )}
                      onChange={(_, value) => {
                        setSelectedModel(value);
                        dispatch(setModelFilter(value?.id ?? null));
                      }}
                      isOptionEqualToValue={(option, value) =>
                        option.id === value?.id
                      }
                    />
                  )}
                </Paper>
              )}
            </Paper>

            <Paper elevation={1} sx={{ overflow: "hidden" }}>
              <AnalysisTable
                analysis={filteredAnalysis}
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
                  page={page}
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
                  {chatSelectFilter ||
                  promptSelectFilter ||
                  companyFilter ||
                  dateFrom ||
                  dateTo
                    ? "Анализы не найдены"
                    : "Нет доступных анализов"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {chatSelectFilter ||
                  promptSelectFilter ||
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
