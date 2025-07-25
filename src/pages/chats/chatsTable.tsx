import type React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  Box,
  Typography,
  Tooltip,
} from "@mui/material";
import type { IChat } from "../../api/chatsApi";
import { TableSkeleton } from "../../components/skeleton/tableSkeleton";
import { SortableTableHeader } from "../../components/table/sortableTableHeader";
import TagIcon from "@mui/icons-material/Tag";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ContentCopy from "@mui/icons-material/ContentCopy";

type SortField = "chat_id" | "chat_name" | "created_at";

interface ChatsTableProps {
  chats: IChat[];
  developerMode: boolean;
  sortField: SortField;
  sortDirection: "asc" | "desc";
  onSort: (field: SortField) => void;
  isLoading?: boolean;
}

export const ChatsTable: React.FC<ChatsTableProps> = ({
  chats,
  developerMode,
  sortField,
  sortDirection,
  onSort,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <TableSkeleton
        columns={2}
        developerMode={developerMode}
        additionalColumns={1}
        rows={5}
      />
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getChatInitials = (chatName: string) => {
    return chatName
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getChatTypeColor = (chatId: string) => {
    if (chatId.startsWith("-100")) {
      return "#4caf4fd7";
    } else if (chatId.startsWith("-")) {
      return "#2196f3d7";
    } else {
      return "#ff9800d7";
    }
  };

  const getChatType = (chatId: string) => {
    if (chatId.startsWith("-100")) {
      return "Канал/Супергруппа";
    } else if (chatId.startsWith("-")) {
      return "Группа";
    } else {
      return "Личный чат";
    }
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
    <TableContainer>
      <Table sx={{ minWidth: 650 }} aria-label="таблица чатов">
        <TableHead sx={{ backgroundColor: "#f8f9fa" }}>
          <TableRow>
            <SortableTableHeader<SortField>
              field="chat_name"
              currentSortField={sortField}
              sortDirection={sortDirection}
              onSort={onSort}
              label="Название чата"
            />
            <SortableTableHeader<SortField>
              field="chat_id"
              currentSortField={sortField}
              sortDirection={sortDirection}
              onSort={onSort}
              label="ID"
            />
            <SortableTableHeader<SortField>
              field="created_at"
              currentSortField={sortField}
              sortDirection={sortDirection}
              onSort={onSort}
              label="Дата добавления"
              defaultDirection="desc"
            />
          </TableRow>
        </TableHead>

        <TableBody>
          {chats.map((chat) => (
            <TableRow
              key={chat.chat_id}
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
                "&:hover": { backgroundColor: "#f8f9fa" },
                transition: "background-color 0.2s ease",
              }}
            >
              <TableCell>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: getChatTypeColor(chat.chat_id.toString()),
                      width: 40,
                      height: 40,
                      fontSize: "0.9rem",
                      fontWeight: 600,
                    }}
                  >
                    {getChatInitials(chat.chat_name)}
                  </Avatar>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {chat.chat_name}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mt: 0.5,
                      }}
                    >
                      <Chip
                        label={getChatType(chat.chat_id.toString())}
                        size="small"
                        variant="outlined"
                        sx={{
                          fontSize: "0.7rem",
                          height: 20,
                          borderColor: getChatTypeColor(
                            chat.chat_id.toString()
                          ),
                          color: getChatTypeColor(chat.chat_id.toString()),
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
              </TableCell>
              <TableCell
                onClick={(e) => handleCellClick(e, chat.chat_id.toString())}
              >
                <Tooltip title="Копировать ID чата" arrow>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        cursor: "pointer",

                        fontFamily: "monospace",
                        fontSize: "0.85rem",
                        bgcolor: "grey.100",
                        p: 0.5,
                        borderRadius: 1,
                        "&:hover": {
                          bgcolor: "grey.300",
                        },
                      }}
                    >
                      {chat.chat_id}
                    </Typography>
                  </Box>
                </Tooltip>
              </TableCell>
              <TableCell>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CalendarTodayIcon
                    sx={{ color: "text.secondary", fontSize: 18 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(chat.created_at.toString())}
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
