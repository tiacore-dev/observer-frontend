import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  TextField,
  Pagination,
  Button,
  Tooltip,
} from "@mui/material";
import { PageProps } from "../../App";
import { ChatsTable } from "./chatsTable";
import ClearIcon from "@mui/icons-material/Clear";
import { PageSkeleton } from "../../components/skeleton/pageSkeleton";
import { ResetFiltersButton } from "../../components/table/resetFiltersButton";
import { PaginationControls } from "../../components/table/paginationControls";
import { useChatsSelectQuery } from "../../hooks/chats/useChatsQuery";

export const ChatsPage: React.FC<PageProps> = ({ developerMode }) => {
  const {
    data: chatsData,
    isLoading: chatsLoading,
    error: chatsError,
  } = useChatsSelectQuery();

  const isLoading = chatsLoading;
  const error = chatsError;

  const [nameFilter, setNameFilter] = useState("");
  const [sortField, setSortField] = useState<
    "chat_name" | "chat_id" | "created_at"
  >("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const resetAllFilters = () => {
    setNameFilter("");
    setSortField("created_at");
    setSortDirection("desc");
    setPage(1);
  };

  const getFilteredAndSortedChats = () => {
    if (!chatsData?.chats) return [];

    let filteredChats = [...chatsData.chats];

    if (nameFilter) {
      filteredChats = filteredChats.filter((chat) =>
        chat.chat_name.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }

    filteredChats.sort((a, b) => {
      // Используем нулевой coalescing оператор для безопасной сортировки
      const aValue = a[sortField] ?? "";
      const bValue = b[sortField] ?? "";

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return filteredChats;
  };

  const handleSort = (field: "chat_name" | "chat_id" | "created_at") => {
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
      {isLoading ? (
        <PageSkeleton filterCount={2} pagination={true} hasAddButton={false} />
      ) : (
        <>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              mb: 3,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <TextField
              label="Поиск по имени"
              variant="outlined"
              size="small"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
            />

            <ResetFiltersButton onClick={resetAllFilters} />
          </Box>

          <ChatsTable
            chats={paginatedChats}
            developerMode={developerMode}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
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
    </Box>
  );
};
