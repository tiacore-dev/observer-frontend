// src/components/prompts/promptsPage.tsx
import React, { useState, useEffect, useMemo } from "react";
import { usePromptsQuery } from "../../hooks/prompts/usePromptsQuery";
import { useCompaniesQuery } from "../../hooks/companies/useCompaniesQuery";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
  TableSortLabel,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { AddPromptModal } from "./addPromptModal";
interface PromptsPageProps {
  developerMode: boolean;
}

export const PromptsPage: React.FC<PromptsPageProps> = ({ developerMode }) => {
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

  // Создаем словарь для сопоставления company_id -> company_name
  const companyMap = useMemo(() => {
    const map = new Map<string, string>();
    companiesData?.companies?.forEach((company) => {
      map.set(company.company_id, company.company_name);
    });
    return map;
  }, [companiesData]);

  // Объединяем состояния загрузки и ошибок
  const isLoading = promptsLoading || companiesLoading;
  const error = promptsError || companiesError;

  // Состояния для фильтрации
  const [nameFilter, setNameFilter] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");

  // Состояния для сортировки
  const [sortField, setSortField] = useState<"prompt_name" | "created_at">(
    "prompt_name"
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Состояния для пагинации
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  // Получаем уникальные компании для фильтра (с названиями)
  const companies = Array.from(
    new Set(
      promptsData?.prompts.map((prompt) => ({
        id: prompt.company,
        name: companyMap.get(prompt.company) || prompt.company,
      })) || []
    )
  );

  // Функция для фильтрации и сортировки данных
  const getFilteredAndSortedPrompts = () => {
    if (!promptsData?.prompts) return [];

    let filteredPrompts = [...promptsData.prompts];

    // Фильтрация по имени
    if (nameFilter) {
      filteredPrompts = filteredPrompts.filter((prompt) =>
        prompt.prompt_name.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }

    // Фильтрация по компании
    if (companyFilter) {
      filteredPrompts = filteredPrompts.filter(
        (prompt) => prompt.company === companyFilter
      );
    }

    // Сортировка
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

  // Сброс страницы при изменении фильтров
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
      {/* Фильтры */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
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

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsModalOpen(true)}
        >
          Добавить промпт
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="prompts table">
          <TableHead>
            <TableRow>
              {developerMode && <TableCell>ID</TableCell>}
              <TableCell
                sortDirection={
                  sortField === "prompt_name" ? sortDirection : false
                }
              >
                <TableSortLabel
                  active={sortField === "prompt_name"}
                  direction={
                    sortField === "prompt_name" ? sortDirection : "asc"
                  }
                  onClick={() => handleSort("prompt_name")}
                >
                  Название промпта
                </TableSortLabel>
              </TableCell>
              <TableCell>Текст</TableCell>
              {developerMode && (
                <TableCell
                  sortDirection={
                    sortField === "created_at" ? sortDirection : false
                  }
                >
                  <TableSortLabel
                    active={sortField === "created_at"}
                    direction={
                      sortField === "created_at" ? sortDirection : "asc"
                    }
                    onClick={() => handleSort("created_at")}
                  >
                    Дата создания
                  </TableSortLabel>
                </TableCell>
              )}
              <TableCell>Компания</TableCell>{" "}
              {/* Исправлено - убрали обращение к prompt здесь */}
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedPrompts.map((prompt) => (
              <TableRow
                key={prompt.prompt_id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                {developerMode && (
                  <TableCell component="th" scope="row">
                    {prompt.prompt_id}
                  </TableCell>
                )}
                <TableCell>{prompt.prompt_name}</TableCell>
                <TableCell>{prompt.text}</TableCell>
                {developerMode && (
                  <TableCell>
                    {new Date(prompt.created_at).toLocaleString()}
                  </TableCell>
                )}
                <TableCell>
                  {companyMap.get(prompt.company) || prompt.company}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Пагинация */}
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
