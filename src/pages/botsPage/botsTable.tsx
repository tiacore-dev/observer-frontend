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
  useMediaQuery,
  Theme,
} from "@mui/material";
import type { IBot } from "../../api/botsApi";
import { useAuth } from "../../context/authContext";
import { SortableTableHeader } from "../../components/table/sortableTableHeader";
import {
  CheckCircle,
  Cancel,
  CalendarMonth,
  Info as InfoIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  ChatBubble as CommentIcon,
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
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );

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
    } catch (err) {
      console.error("Ошибка при копировании:", err);
    }
  };

  const handleCellClick = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    copyToClipboard(text);
  };

  const getMobileBotRow = (bot: IBot) => (
    <Box
      sx={{
        p: 2,
        borderBottom: "1px solid",
        borderColor: "divider",
        "&:hover": {
          backgroundColor: "rgba(0, 0, 0, 0.04)",
          cursor: "pointer",
        },
      }}
      onClick={() => onRowClick(bot.bot_id)}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {bot.is_active ? (
            <CheckCircle color="success" />
          ) : (
            <Cancel color="error" />
          )}
          <Typography fontWeight={500}>{bot.bot_first_name}</Typography>
        </Box>

        <Typography
          variant="caption"
          fontFamily="monospace"
          sx={{
            bgcolor: "grey.100",
            p: 0.5,
            borderRadius: 1,
            "&:hover": {
              bgcolor: "grey.300",
            },
          }}
          onClick={(e) => {
            e.stopPropagation();
            copyToClipboard(bot.bot_id);
          }}
        >
          ID: {bot.bot_id}
        </Typography>
      </Box>

      <Box sx={{ mb: 1 }}>
        <Typography variant="body2" fontWeight={500}>
          @{bot.bot_username}
        </Typography>
      </Box>

      {isSuperadmin && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <BusinessIcon fontSize="small" color="action" />
          <Chip
            size="small"
            label={companyMap.get(bot.company_id) || bot.company_id}
            sx={{
              bgcolor: "primary.light",
              color: "primary.contrastText",
              fontWeight: 500,
            }}
          />
        </Box>
      )}

      {developerMode && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <CalendarMonth fontSize="small" color="action" />
          <Typography variant="body2">{formatDate(bot.created_at)}</Typography>
        </Box>
      )}

      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
        <CommentIcon fontSize="small" color="action" />
        <Typography variant="body2">
          {bot.comment || (
            <Typography
              component="span"
              color="text.secondary"
              sx={{ fontStyle: "italic" }}
            >
              Нет описания
            </Typography>
          )}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <TableContainer
    // component={Paper}
    // elevation={2}
    // sx={{
    //   borderRadius: 1,
    //   overflow: "hidden",
    //   mb: 4,
    // }}
    >
      {isMobile ? (
        <Box>
          {bots.map((bot) => (
            <Box key={bot.bot_id}>{getMobileBotRow(bot)}</Box>
          ))}
        </Box>
      ) : (
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
      )}
    </TableContainer>
  );
};
