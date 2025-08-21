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
  useMediaQuery,
  Theme,
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
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );

  const handleRowClick = (analysisId: string) => {
    if (onRowClick) {
      onRowClick(analysisId);
    } else {
      navigate(`/analysis/${analysisId}`);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return isMobile
      ? new Intl.DateTimeFormat("ru-RU", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }).format(date)
      : new Intl.DateTimeFormat("ru-RU", {
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
    // component={Paper}
    // elevation={2}
    // sx={{
    //   borderRadius: 1,
    //   overflow: "hidden",
    //   // mb: 4,
    // }}
    >
      <Table
        sx={{
          minWidth: isMobile ? 300 : 650,
          tableLayout: "fixed",
        }}
        aria-label="таблица анализов"
      >
        <TableHead>
          <TableRow>
            <SortableTableHeader<SortField>
              field="created_at"
              currentSortField={sortField}
              sortDirection={sortDirection}
              onSort={onSort}
              label={isMobile ? "Дата" : "Дата анализа"}
              defaultDirection="desc"
            />
            <SortableTableHeader<SortField>
              field="chat_id"
              currentSortField={sortField}
              sortDirection={sortDirection}
              onSort={onSort}
              label="Чат"
            />
            {!isMobile && (
              <SortableTableHeader<SortField>
                field="prompt_id"
                currentSortField={sortField}
                sortDirection={sortDirection}
                onSort={onSort}
                label="Промпт"
              />
            )}
            {isSuperadmin && !isMobile && (
              <>
                <SortableTableHeader<SortField>
                  field="company_id"
                  currentSortField={sortField}
                  sortDirection={sortDirection}
                  onSort={onSort}
                  label="Компания"
                />
                <SortableTableHeader<SortField>
                  field="analysing_model"
                  currentSortField={sortField}
                  sortDirection={sortDirection}
                  onSort={onSort}
                  label="Модель"
                />
              </>
            )}
            {developerMode && !isMobile && (
              <TableCell sx={{ width: "15%" }}>
                <Tooltip title="Токены (вход/выход)">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Token fontSize="small" />
                    Токены
                  </Box>
                </Tooltip>
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
              <TableCell sx={{ width: isMobile ? "30%" : "20%" }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {!isMobile && (
                    <CalendarMonth
                      fontSize="small"
                      sx={{ mr: 1, color: "text.secondary" }}
                    />
                  )}
                  <Typography variant="body2">
                    {formatDate(item.created_at)}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell sx={{ width: isMobile ? "40%" : "20%" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {isMobile && (
                    <Chat fontSize="small" sx={{ color: "text.secondary" }} />
                  )}
                  <Typography
                    variant="body2"
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {chatMap.get(item.chat_id) || item.chat_id}
                  </Typography>
                </Box>
              </TableCell>
              {!isMobile && (
                <TableCell sx={{ width: "20%" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {promptMap.get(item.prompt_id) || item.prompt_id}
                    </Typography>
                  </Box>
                </TableCell>
              )}
              {isSuperadmin && !isMobile && (
                <>
                  <TableCell sx={{ width: "15%" }}>
                    <Chip
                      size="small"
                      label={companyMap.get(item.company_id) || item.company_id}
                      sx={{
                        bgcolor: "primary.light",
                        color: "primary.contrastText",
                        fontWeight: 500,
                        maxWidth: "100%",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
                          ? "GPT Pro"
                          : item.analysing_model === "yandex-gpt-mini"
                          ? "GPT Mini"
                          : "Не указано"}
                      </Typography>
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
              {developerMode && !isMobile && (
                <TableCell sx={{ width: "15%" }}>
                  <Tooltip title="Количество токенов на входе и выходе">
                    <Chip
                      icon={<Token fontSize="small" />}
                      label={`${item.tokens_input}/${item.tokens_output}`}
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
