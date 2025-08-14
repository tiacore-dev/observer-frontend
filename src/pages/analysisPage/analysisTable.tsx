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
  Tooltip,
} from "@mui/material";
import type { IAnalys } from "../../api/analysisApi";
import { useNavigate } from "react-router-dom";
import { TableSkeleton } from "../../components/skeleton/tableSkeleton";
import { useAuth } from "../../context/authContext";
import { SortableTableHeader } from "../../components/table/sortableTableHeader";
import {
  Analytics,
  CalendarMonth,
  Chat,
  Description,
  Business,
  Token,
} from "@mui/icons-material";

type SortField = keyof IAnalys;

interface AnalysisTableProps {
  analysis: IAnalys[];
  companyMap: Map<string, string>;
  chatMap: Map<number, string>;
  promptMap: Map<string, string>;
  developerMode: boolean;
  sortField: SortField;
  sortDirection: "asc" | "desc";
  onSort: (field: SortField) => void;
  onRowClick?: (analysisId: string) => void;
  isLoading?: boolean;
}

// Функция для генерации цвета на основе строки
const stringToColor = (string: string) => {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
};

export const AnalysisTable: React.FC<AnalysisTableProps> = ({
  analysis,
  companyMap,
  chatMap,
  promptMap,
  developerMode,
  sortField,
  sortDirection,
  onSort,
  onRowClick,
  isLoading = false,
}) => {
  const navigate = useNavigate();
  const { isSuperadmin } = useAuth();

  const handleRowClick = (analysisId: string) => {
    if (onRowClick) {
      onRowClick(analysisId);
    } else {
      navigate(`/analysis/${analysisId}`);
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

  const formatResultText = (text?: string) => {
    if (!text) return "-";
    return text.length > 100 ? `${text.substring(0, 100)}...` : text;
  };

  if (isLoading) {
    return (
      <TableSkeleton
        columns={3}
        developerMode={developerMode}
        additionalColumns={developerMode ? 2 : 0}
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
      <Table
        sx={{
          minWidth: 650,
          tableLayout: "fixed", // Фиксированное распределение ширины
        }}
        aria-label="таблица анализов"
      >
        <TableHead>
          <TableRow>
            {/* {developerMode && (
              <TableCell sx={{ width: "10%" }}>
                <Typography variant="subtitle2">ID</Typography>
              </TableCell>
            )} */}
            <SortableTableHeader<SortField>
              field="created_at"
              currentSortField={sortField}
              sortDirection={sortDirection}
              onSort={onSort}
              label={
                // <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                //  <CalendarMonth fontSize="small" />
                "Дата анализа"
                // </Box>
              }
              defaultDirection="desc"
            />
            <SortableTableHeader<SortField>
              field="chat_id"
              currentSortField={sortField}
              sortDirection={sortDirection}
              onSort={onSort}
              label={
                // <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                // <Chat fontSize="small" />
                "Чат"
                // </Box>
              }
            />
            <SortableTableHeader<SortField>
              field="prompt_id"
              currentSortField={sortField}
              sortDirection={sortDirection}
              onSort={onSort}
              label={
                // <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                //   <Description fontSize="small" />
                "Промпт"
                // </Box>
              }
            />
            {isSuperadmin && (
              <>
                <SortableTableHeader<SortField>
                  field="company_id"
                  currentSortField={sortField}
                  sortDirection={sortDirection}
                  onSort={onSort}
                  label={"Компания"}
                />
                <SortableTableHeader<SortField>
                  field="analysing_model"
                  currentSortField={sortField}
                  sortDirection={sortDirection}
                  onSort={onSort}
                  label={"Модель"}
                />
              </>
            )}
            {developerMode && (
              <TableCell sx={{ width: "15%" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Token fontSize="small" />
                  Токены (вход/выход)
                </Box>
              </TableCell>
            )}
          </TableRow>
        </TableHead>

        <TableBody>
          {analysis.map((item) => (
            <TableRow
              key={item.analysis_id}
              hover
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                  transition: "background-color 0.2s ease",
                },
              }}
              onClick={() => handleRowClick(item.analysis_id)}
            >
              {/* {developerMode && (
                <TableCell component="th" scope="row" sx={{ width: "10%" }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "monospace",
                      bgcolor: "grey.100",
                      p: 0.5,
                      borderRadius: 1,
                    }}
                  >
                    {item.analysis_id.substring(0, 8)}...
                  </Typography>
                </TableCell>
              )} */}
              <TableCell sx={{ width: "20%" }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <CalendarMonth
                    fontSize="small"
                    sx={{ mr: 1, color: "text.secondary" }}
                  />
                  <Typography variant="body2">
                    {formatDate(item.created_at)}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell sx={{ width: "20%" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  {/* <Avatar
                    sx={{
                      bgcolor: stringToColor(
                        chatMap.get(item.chat_id) || item.chat_id.toString()
                      ),
                      width: 36,
                      height: 36,
                    }}
                  >
                    <Chat fontSize="small" />
                  </Avatar> */}
                  <Typography variant="body2">
                    {chatMap.get(item.chat_id) || (
                      <Typography
                        component="span"
                        sx={{ fontFamily: "monospace" }}
                      >
                        {item.chat_id}
                      </Typography>
                    )}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell sx={{ width: "20%" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  {/* <Avatar
                    sx={{
                      bgcolor: stringToColor(
                        promptMap.get(item.prompt_id) || item.prompt_id
                      ),
                      width: 26,
                      height: 26,
                    }}
                  >
                    <Description fontSize="small" />
                  </Avatar> */}
                  <Typography variant="body2">
                    {promptMap.get(item.prompt_id) || item.prompt_id}
                  </Typography>
                </Box>
              </TableCell>
              {isSuperadmin && (
                <>
                  <TableCell sx={{ width: "15%" }}>
                    <Chip
                      // icon={<Business fontSize="small" />}
                      size="small"
                      label={companyMap.get(item.company_id) || item.company_id}
                      sx={{
                        bgcolor: "primary.light",
                        color: "primary.contrastText",
                        fontWeight: 500,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {/* Иконка модели (опционально) */}
                      {/* {item.analysing_model === 'yandex-gpt-pro' ? (
      <StarsIcon color="primary" fontSize="small" />
    ) : (
      <MemoryIcon color="secondary" fontSize="small" />
    )} */}

                      {/* Название модели с цветом в зависимости от типа */}
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          color:
                            item.analysing_model === "yandex-gpt-pro"
                              ? "primary.main"
                              : "text.primary",
                        }}
                      >
                        {item.analysing_model === "yandex-gpt-pro"
                          ? "Yandex GPT Pro"
                          : item.analysing_model === "yandex-gpt-mini"
                          ? "Yandex GPT Mini"
                          : "Не указано"}
                      </Typography>

                      {/* Бейдж для Pro версии (опционально) */}
                      {item.analysing_model === "yandex-gpt-pro" && (
                        <Chip
                          label="PRO"
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{
                            height: 20,
                            fontSize: "0.65rem",
                            "& .MuiChip-label": { px: 0.5 },
                          }}
                        />
                      )}
                    </Box>
                  </TableCell>
                </>
              )}
              {developerMode && (
                <TableCell sx={{ width: "15%" }}>
                  <Tooltip title="Количество токенов на входе и выходе">
                    <Chip
                      icon={<Token fontSize="small" />}
                      label={`${item.tokens_input} / ${item.tokens_output}`}
                      variant="outlined"
                      size="small"
                      color="primary"
                    />
                  </Tooltip>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
