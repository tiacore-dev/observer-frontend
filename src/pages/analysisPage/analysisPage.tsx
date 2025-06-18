import React, { useState, useEffect, useMemo } from "react";
import { useAnalysisQuery } from "../../hooks/analysis/useAnalysisQuery";
import { useCompaniesQuery } from "../../hooks/companies/useCompaniesQuery";
import { useChatsQuery } from "../../hooks/chats/useChatsQuery";
import { usePromptsQuery } from "../../hooks/prompts/usePromptsQuery";
import {
  Paper,
  CircularProgress,
  Typography,
  Box,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Pagination,
  Button,
} from "@mui/material";
import { PageProps } from "../../App";
import { AnalysisTable } from "./analysisTable";
import { useNavigate, useParams } from "react-router-dom";
import { IAnalys } from "../../api/analysisApi";
import AddIcon from "@mui/icons-material/Add";
import { AddAnalysisModal } from "./addAnalysisModal";

export const AnalysisPage: React.FC<PageProps> = ({ developerMode }) => {
  const {
    data: analysisData,
    isLoading: analysisLoading,
    error: analysisError,
  } = useAnalysisQuery();
  const {
    data: companiesData,
    isLoading: companiesLoading,
    error: companiesError,
  } = useCompaniesQuery();
  const {
    data: chatsData,
    isLoading: chatsLoading,
    error: chatsError,
  } = useChatsQuery();
  const {
    data: promptsData,
    isLoading: promptsLoading,
    error: promptsError,
  } = usePromptsQuery();
  const navigate = useNavigate();

  const companyMap = useMemo(() => {
    const map = new Map<string, string>();
    companiesData?.companies?.forEach((company) => {
      map.set(company.company_id, company.company_name);
    });
    return map;
  }, [companiesData]);

  const chatMap = useMemo(() => {
    const map = new Map<number, string>();
    chatsData?.chats?.forEach((chat) => {
      map.set(chat.chat_id, chat.chat_name);
    });
    return map;
  }, [chatsData]);

  const promptMap = useMemo(() => {
    const map = new Map<string, string>();
    promptsData?.prompts?.forEach((prompt) => {
      map.set(prompt.prompt_id, prompt.prompt_name);
    });
    return map;
  }, [promptsData]);

  const isLoading =
    analysisLoading || companiesLoading || chatsLoading || promptsLoading;
  const error = analysisError || companiesError || chatsError || promptsError;

  const [chatFilter, setChatFilter] = useState("");
  // const [companyFilter, setCompanyFilter] = useState("");
  const [sortField, setSortField] = useState<keyof IAnalys>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const companies = Array.from(
    new Set(
      analysisData?.analysis?.map((item) => ({
        id: item.company_id,
        name: companyMap.get(item.company_id) || item.company_id,
      })) || []
    )
  );

  const getFilteredAndSortedAnalysis = () => {
    if (!analysisData?.analysis) return [];

    let filteredAnalysis = [...analysisData.analysis];

    if (chatFilter) {
      filteredAnalysis = filteredAnalysis.filter(
        (item) =>
          chatMap
            .get(item.chat_id)
            ?.toLowerCase()
            .includes(chatFilter.toLowerCase()) ||
          item.chat_id.toString().includes(chatFilter)
      );
    }

    // if (companyFilter) {
    //   filteredAnalysis = filteredAnalysis.filter(
    //     (item) => item.company_id === companyFilter
    //   );
    // }

    filteredAnalysis.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      if (aValue === undefined || bValue === undefined) return 0;
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

  // useEffect(() => {
  //   setPage(1);
  // }, [chatFilter, companyFilter]);

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
          label="Поиск по Chat"
          variant="outlined"
          size="small"
          value={chatFilter}
          onChange={(e) => setChatFilter(e.target.value)}
        />

        {/* <FormControl size="small" sx={{ minWidth: 200 }}>
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
        </FormControl> */}

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
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
          showFirstButton
          showLastButton
        />
      </Box>
      <AddAnalysisModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </Box>
  );
};
