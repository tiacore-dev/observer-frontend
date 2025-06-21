import React, { useState } from "react";
import { useAnalysisQuery } from "../../hooks/analysis/useAnalysisQuery";
import { useCompaniesQuery } from "../../hooks/companies/useCompaniesQuery";
import { useChatsSelectQuery } from "../../hooks/chats/useChatsQuery";
import { usePromptsQuery } from "../../hooks/prompts/usePromptsQuery";
import {
  Typography,
  Box,
  TextField,
  Pagination,
  Button,
  Tooltip,
  Autocomplete,
} from "@mui/material";
import { PageProps } from "../../App";
import { AnalysisTable } from "./analysisTable";
import { useNavigate } from "react-router-dom";
import { IAnalys } from "../../api/analysisApi";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import { AddAnalysisModal } from "./addAnalysisModal";
import { useCompanyMap } from "../../hooks/maps/useCompanyMap";
import { useChatMap } from "../../hooks/maps/useChatMap";
import { usePromptMap } from "../../hooks/maps/usePromptMap";
import { PageSkeleton } from "../../components/skeleton/pageSkeleton";
import { useAuth } from "../../context/authContext";
import { ResetFiltersButton } from "../../components/table/resetFiltersButton";
import { PaginationControls } from "../../components/table/paginationControls";

export const AnalysisPage: React.FC<PageProps> = ({ developerMode }) => {
  const { isSuperadmin } = useAuth(); // Получаем статус суперадмина
  const {
    data: analysisData,
    isLoading: analysisLoading,
    error: analysisError,
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

  const { companyMap, isLoading: isLoadingCompanyMap } = useCompanyMap();
  const chatMap = useChatMap();
  const promptMap = usePromptMap();

  const isLoading =
    analysisLoading ||
    companiesLoading ||
    chatsLoading ||
    promptsLoading ||
    isLoadingCompanyMap;
  const error = analysisError || companiesError || chatsError || promptsError;

  const [chatFilter, setChatFilter] = useState("");
  const [chatSelectFilter, setChatSelectFilter] = useState("");
  const [promptFilter, setPromptFilter] = useState("");
  const [promptSelectFilter, setPromptSelectFilter] = useState("");
  const [companyFilter, setCompanyFilter] = useState(""); // Новый фильтр
  const [companySelectFilter, setCompanySelectFilter] = useState(""); // Новый фильтр
  const [sortField, setSortField] = useState<keyof IAnalys>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const resetAllFilters = () => {
    setChatFilter("");
    setChatSelectFilter("");
    setPromptFilter("");
    setPromptSelectFilter("");
    setCompanyFilter("");
    setCompanySelectFilter("");
    setSortField("created_at");
    setSortDirection("desc");
    setPage(1);
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

    // Фильтрация по компании (только для суперадмина)
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
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
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
        <Typography color="error">
          Ошибка: {(error as Error).message}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {isLoading ? (
        <PageSkeleton
          filterCount={isSuperadmin ? 5 : 4}
          tableHeight={200}
          pagination={true}
        />
      ) : (
        <>
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
            {/* Фильтр для чатов */}
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
                  onChange={(e) => {
                    setChatFilter(e.target.value);
                    setChatSelectFilter("");
                  }}
                />
              )}
              onChange={(_, value) => {
                setChatSelectFilter(value || "");
                setChatFilter("");
              }}
              sx={{ width: 250 }}
            />

            {/* Фильтр для промптов */}
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
                  onChange={(e) => {
                    setPromptFilter(e.target.value);
                    setPromptSelectFilter("");
                  }}
                />
              )}
              onChange={(_, value) => {
                setPromptSelectFilter(value || "");
                setPromptFilter("");
              }}
              sx={{ width: 250 }}
            />

            {/* Фильтр для компаний (только для суперадмина) */}
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
              Добавить анализ
            </Button>
          </Box>

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
              developerMode ? (id) => navigate(`/analysis/${id}`) : undefined
            }
          />

          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <PaginationControls
              count={totalPages}
              page={page}
              onPageChange={setPage}
            />
          </Box>
        </>
      )}
      <AddAnalysisModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </Box>
  );
};
