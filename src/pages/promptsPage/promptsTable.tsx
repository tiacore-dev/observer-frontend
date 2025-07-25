"use client";

import type React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Chip,
  Avatar,
} from "@mui/material";
import type { IPrompt } from "../../api/promptsApi";
import { useNavigate } from "react-router-dom";
import { TableSkeleton } from "../../components/skeleton/tableSkeleton";
import { SortableTableHeader } from "../../components/table/sortableTableHeader";
import {
  Description,
  CalendarMonth,
  Business,
  TextSnippet,
} from "@mui/icons-material";

type SortField = "prompt_name" | "company_id" | "created_at";

interface PromptsTableProps {
  prompts: IPrompt[];
  companyMap: Map<string, string>;
  developerMode: boolean;
  isSuperadmin: boolean;
  sortField: SortField;
  sortDirection: "asc" | "desc";
  onSort: (field: SortField) => void;
  isLoading?: boolean;
}

export const PromptsTable: React.FC<PromptsTableProps> = ({
  prompts,
  companyMap,
  developerMode,
  isSuperadmin,
  sortField,
  sortDirection,
  onSort,
  isLoading = false,
}) => {
  const navigate = useNavigate();

  const handleRowClick = (promptId: string) => {
    if (!isLoading) {
      navigate(`/prompts/${promptId}`);
    }
  };

  // Функция для форматирования даты
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (isLoading) {
    const columns = 2; // Основные колонки (Название, Текст)
    const additionalColumns =
      // (developerMode ? 1 : 0) + // Колонка ID если developerMode
      (developerMode ? 1 : 0) + // Колонка даты если developerMode
      (isSuperadmin ? 1 : 0); // Колонка компании если isSuperadmin

    return (
      <TableSkeleton
        columns={columns}
        additionalColumns={additionalColumns}
        developerMode={developerMode}
      />
    );
  }

  return (
    <TableContainer
      component={Paper}
      elevation={2}
      sx={{
        borderRadius: 1,
        overflow: "hidden",
        mb: 4,
      }}
    >
      <Table sx={{ minWidth: 650 }} aria-label="таблица промптов">
        <TableHead>
          <TableRow>
            {/* {developerMode && <TableCell>ID</TableCell>} */}
            <SortableTableHeader<SortField>
              field="prompt_name"
              currentSortField={sortField}
              sortDirection={sortDirection}
              onSort={onSort}
              label="Название промпта"
            />
            <TableCell>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <TextSnippet fontSize="small" />
                Содержание промпта
              </Box>
            </TableCell>
            {developerMode && (
              <SortableTableHeader<SortField>
                field="created_at"
                currentSortField={sortField}
                sortDirection={sortDirection}
                onSort={onSort}
                label="Дата создания"
                defaultDirection="desc"
              />
            )}
            {isSuperadmin && (
              <SortableTableHeader<SortField>
                field="company_id"
                currentSortField={sortField}
                sortDirection={sortDirection}
                onSort={onSort}
                label="Компания"
              />
            )}
          </TableRow>
        </TableHead>

        <TableBody>
          {prompts.map((prompt) => (
            <TableRow
              key={prompt.prompt_id}
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                  cursor: "pointer",
                  transition: "background-color 0.2s ease",
                },
              }}
              onClick={() => handleRowClick(prompt.prompt_id)}
            >
              {/* {developerMode && (
                <TableCell component="th" scope="row">
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "monospace",
                      bgcolor: "grey.100",
                      p: 0.5,
                      borderRadius: 1,
                    }}
                  >
                    {prompt.prompt_id.substring(0, 8)}...
                  </Typography>
                </TableCell>
              )} */}
              <TableCell>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Typography variant="body1" fontWeight={500}>
                    {prompt.prompt_name}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell sx={{ maxWidth: 400, wordBreak: "break-word" }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    lineHeight: "1.5em",
                    maxHeight: "3em",
                  }}
                >
                  {prompt.text}
                </Typography>
              </TableCell>
              {developerMode && (
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <CalendarMonth
                      fontSize="small"
                      sx={{ mr: 1, color: "text.secondary" }}
                    />
                    <Typography variant="body2">
                      {formatDate(prompt.created_at)}
                    </Typography>
                  </Box>
                </TableCell>
              )}
              {isSuperadmin && (
                <TableCell>
                  <Chip
                    // icon={<Business fontSize="small" />}
                    size="small"
                    label={
                      companyMap.get(prompt.company_id) || prompt.company_id
                    }
                    sx={{
                      bgcolor: "primary.light",
                      color: "primary.contrastText",
                      fontWeight: 500,
                    }}
                  />
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
