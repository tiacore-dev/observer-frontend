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
  Chip,
  Avatar,
  Box,
  Tooltip,
} from "@mui/material";
import type { IBot } from "../../api/botsApi";
import { useAuth } from "../../context/authContext";
import { SortableTableHeader } from "../../components/table/sortableTableHeader";
import {
  CheckCircle,
  Cancel,
  CalendarMonth,
  // ContentCopy,
} from "@mui/icons-material";

type SortField =
  | "bot_username"
  | "bot_first_name"
  | "company_id"
  | "is_active"
  | "comment"
  | "created_at";

interface BotsTableProps {
  bots: IBot[];
  companyMap: Map<string, string>;
  developerMode: boolean;
  sortField: SortField;
  sortDirection: "asc" | "desc";
  onSort: (field: SortField) => void;
  onRowClick: (botId: string) => void;
}

export const BotsTable: React.FC<BotsTableProps> = ({
  bots,
  companyMap,
  developerMode,
  sortField,
  sortDirection,
  onSort,
  onRowClick,
}) => {
  const { isSuperadmin } = useAuth();

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

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      console.log("Скопировано:", text);
    } catch (err) {
      console.error("Ошибка при копировании:", err);
    }
  };

  const handleCellClick = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    copyToClipboard(text);
  };

  return (
    <TableContainer
      component={Paper}
      elevation={2}
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        mb: 4,
      }}
    >
      <Table sx={{ minWidth: 650 }} aria-label="таблица ботов">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <SortableTableHeader<SortField>
              field="bot_username"
              currentSortField={sortField}
              sortDirection={sortDirection}
              onSort={onSort}
              label="Бот"
            />
            <SortableTableHeader<SortField>
              field="bot_first_name"
              currentSortField={sortField}
              sortDirection={sortDirection}
              onSort={onSort}
              label="Название"
            />
            {isSuperadmin && (
              <SortableTableHeader<SortField>
                field="company_id"
                currentSortField={sortField}
                sortDirection={sortDirection}
                onSort={onSort}
                label="Компания"
              />
            )}
            <SortableTableHeader<SortField>
              field="is_active"
              currentSortField={sortField}
              sortDirection={sortDirection}
              onSort={onSort}
              label="Статус"
            />
            {developerMode && (
              <SortableTableHeader<SortField>
                field="created_at"
                currentSortField={sortField}
                sortDirection={sortDirection}
                onSort={onSort}
                label="Дата регистрации"
                defaultDirection="desc"
              />
            )}
            <SortableTableHeader<SortField>
              field="comment"
              currentSortField={sortField}
              sortDirection={sortDirection}
              onSort={onSort}
              label="Описание"
            />
          </TableRow>
        </TableHead>

        <TableBody>
          {bots.map((bot) => (
            <TableRow
              key={bot.bot_id}
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                  cursor: "pointer",
                  transition: "background-color 0.2s ease",
                },
              }}
              onClick={() => onRowClick(bot.bot_id)}
            >
              <TableCell onClick={(e) => handleCellClick(e, bot.bot_id)}>
                <Tooltip title="Копировать ID" arrow>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {/* <ContentCopy fontSize="small" color="action" /> */}
                    <Typography
                      variant="body2"
                      component="span"
                      sx={{
                        fontFamily: "monospace",
                        bgcolor: "grey.100",
                        p: 0.5,
                        borderRadius: 1,
                        "&:hover": {
                          bgcolor: "grey.300",
                        },
                      }}
                    >
                      {bot.bot_id}
                    </Typography>
                  </Box>
                </Tooltip>
              </TableCell>
              <TableCell
                onClick={(e) => handleCellClick(e, `@${bot.bot_username}`)}
              >
                <Tooltip title="Копировать username" arrow>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {/* <ContentCopy fontSize="small" color="action" /> */}
                    <Typography
                      variant="body2"
                      sx={{
                        "&:hover": {
                          textDecoration: "underline",
                        },
                      }}
                    >
                      @{bot.bot_username}
                    </Typography>
                  </Box>
                </Tooltip>
              </TableCell>
              <TableCell>{bot.bot_first_name}</TableCell>
              {isSuperadmin && (
                <TableCell>
                  <Chip
                    size="small"
                    label={companyMap.get(bot.company_id) || bot.company_id}
                    sx={{
                      bgcolor: "primary.light",
                      color: "primary.contrastText",
                      fontWeight: 500,
                    }}
                  />
                </TableCell>
              )}
              <TableCell>
                {bot.is_active ? (
                  <Chip
                    icon={<CheckCircle fontSize="small" />}
                    label="Активен"
                    color="success"
                    variant="outlined"
                    size="small"
                  />
                ) : (
                  <Chip
                    icon={<Cancel fontSize="small" />}
                    label="Неактивен"
                    color="error"
                    variant="outlined"
                    size="small"
                  />
                )}
              </TableCell>
              {developerMode && (
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <CalendarMonth
                      fontSize="small"
                      sx={{ mr: 1, color: "text.secondary" }}
                    />
                    <Typography variant="body2">
                      {formatDate(bot.created_at)}
                    </Typography>
                  </Box>
                </TableCell>
              )}
              <TableCell>
                {bot.comment ? (
                  <Typography variant="body2">{bot.comment}</Typography>
                ) : (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontStyle: "italic" }}
                  >
                    Нет описания
                  </Typography>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
