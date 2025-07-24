"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Typography, Box, TextField, Paper, Alert, Chip } from "@mui/material";
import type { PageProps } from "../../App";
import { ChatsTable } from "./chatsTable";
import { PageSkeleton } from "../../components/skeleton/pageSkeleton";
import { ResetFiltersButton } from "../../components/table/resetFiltersButton";
import { PaginationControls } from "../../components/table/paginationControls";
import { useChatsSelectQuery } from "../../hooks/chats/useChatsQuery";
import ChatIcon from "@mui/icons-material/Chat";
import SearchIcon from "@mui/icons-material/Search";
import InfoIcon from "@mui/icons-material/Info";
import GroupIcon from "@mui/icons-material/Group";

export const ChatsPage: React.FC<PageProps> = ({ developerMode }) => {
  const {
    data: chatsData,
    isLoading: chatsLoading,
    error: chatsError,
  } = useChatsSelectQuery();

  const isLoading = chatsLoading;
  const error = chatsError;

  const [nameFilter, setNameFilter] = useState("");
  const [idFilter, setIdFilter] = useState(""); // Новый фильтр по ID
  const [sortField, setSortField] = useState<
    "chat_name" | "chat_id" | "created_at"
  >("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const resetAllFilters = () => {
    setNameFilter("");
    setIdFilter(""); // Сбрасываем фильтр по ID
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

    if (idFilter) {
      filteredChats = filteredChats.filter((chat) =>
        chat.chat_id.toString().includes(idFilter)
      );
    }

    filteredChats.sort((a, b) => {
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
  }, [nameFilter, idFilter]); // Добавляем idFilter в зависимости

  if (error) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Alert severity="error" sx={{ maxWidth: 600 }}>
          <Typography variant="h6" gutterBottom>
            Не удалось загрузить чаты
          </Typography>
          <Typography variant="body2">
            Произошла ошибка при загрузке данных: {(error as Error).message}
          </Typography>
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ pl: 2, pr: 2, maxWidth: 1600, mx: "auto" }}>
      {isLoading ? (
        <PageSkeleton filterCount={2} pagination={true} hasAddButton={false} />
      ) : (
        <>
          {/* Заголовок страницы */}
          <Paper
            elevation={1}
            sx={{
              p: 3,
              mb: 1,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <GroupIcon sx={{ fontSize: 40 }} />
              <Box>
                <Typography
                  variant="h4"
                  component="h1"
                  gutterBottom
                  sx={{ mb: 1, fontWeight: 600 }}
                  color="white"
                >
                  Telegram чаты
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }} color="white">
                  Просмотр чатов и групп, к которым у вас есть доступ. Вы можете
                  анализировать сообщения из этих чатов.
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Фильтры */}
          <Paper elevation={1} sx={{ p: 2, mb: 1 }}>
            <Box
              sx={{
                display: "flex",
                gap: 1,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <TextField
                label="Поиск по названию чата"
                variant="outlined"
                size="small"
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                placeholder="Например: Рабочая группа"
                sx={{ minWidth: 300 }}
              />

              <TextField
                label="Поиск по ID чата"
                variant="outlined"
                size="small"
                value={idFilter}
                onChange={(e) => setIdFilter(e.target.value)}
                placeholder="Например: 123456789"
                sx={{ minWidth: 300 }}
              />

              <ResetFiltersButton onClick={resetAllFilters} />
            </Box>
          </Paper>

          {/* Таблица */}
          <Paper elevation={1} sx={{ overflow: "hidden" }}>
            <ChatsTable
              chats={paginatedChats}
              developerMode={developerMode}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
            />

            {/* Пагинация */}
            {totalPages > 1 && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mb: 3,
                  mt: 0,
                }}
              >
                <PaginationControls
                  count={totalPages}
                  page={page}
                  onPageChange={setPage}
                />
              </Box>
            )}
          </Paper>

          {/* Пустое состояние */}
          {filteredChats.length === 0 && !isLoading && (
            <Paper elevation={1} sx={{ p: 1, textAlign: "center", mb: 1 }}>
              <ChatIcon sx={{ fontSize: 64, color: "text.secondary", mt: 2 }} />
              <Typography variant="h6" gutterBottom color="text.secondary">
                {nameFilter || idFilter
                  ? "Чаты не найдены"
                  : "Нет доступных чатов"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {nameFilter || idFilter
                  ? "Попробуйте изменить параметры поиска"
                  : "Подключите аккаунты и добавьте их в группы для отображения чатов здесь"}
              </Typography>
            </Paper>
          )}
        </>
      )}
    </Box>
  );
};
