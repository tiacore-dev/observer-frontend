import React, { useState, useEffect } from "react";
import { useChatsQuery } from "../../hooks/chats/useChatsQuery";
import {
  Paper,
  CircularProgress,
  Typography,
  Box,
  TextField,
  Pagination,
} from "@mui/material";
import { ChatsTable } from "./chatsTable";
import { PageProps } from "../../App";

export const ChatsPage: React.FC<PageProps> = ({ developerMode }) => {
  const {
    data: chatsData,
    isLoading: chatsLoading,
    error: chatsError,
  } = useChatsQuery();

  const isLoading = chatsLoading;
  const error = chatsError;

  const [nameFilter, setNameFilter] = useState("");
  const [sortField, setSortField] = useState<"chat_name" | "created_at">(
    "created_at"
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const getFilteredAndSortedChats = () => {
    if (!chatsData?.chats) return [];

    let filteredChats = [...chatsData.chats];

    if (nameFilter) {
      filteredChats = filteredChats.filter((chat) =>
        chat.chat_name.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }

    filteredChats.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return filteredChats;
  };

  const handleSort = (field: "chat_name" | "created_at") => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredChats = getFilteredAndSortedChats();
  const totalPages = Math.ceil(filteredChats.length / rowsPerPage);
  const paginatedChats = filteredChats.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  useEffect(() => {
    setPage(1);
  }, [nameFilter]);

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
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <TextField
          label="Поиск по имени"
          variant="outlined"
          size="small"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
        />
      </Box>

      <ChatsTable
        chats={paginatedChats}
        developerMode={developerMode}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
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
    </Box>
  );
};
