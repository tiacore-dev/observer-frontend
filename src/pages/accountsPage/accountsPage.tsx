"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Typography, Box, TextField, Paper, Alert, Chip } from "@mui/material";
import type { PageProps } from "../../App";
import { useAccountsQuery } from "../../hooks/accounts/useAccountsQuery";
import { AccountsTable } from "./accountsTable";
import { PageSkeleton } from "../../components/skeleton/pageSkeleton";
import { ResetFiltersButton } from "../../components/table/resetFiltersButton";
import { PaginationControls } from "../../components/table/paginationControls";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SearchIcon from "@mui/icons-material/Search";
import InfoIcon from "@mui/icons-material/Info";

export const AccountsPage: React.FC<PageProps> = ({ developerMode }) => {
  const {
    data: accountsData,
    isLoading: accountsLoading,
    error: accountsError,
  } = useAccountsQuery();

  const isLoading = accountsLoading;
  const error = accountsError;

  const [nameFilter, setNameFilter] = useState("");
  const [usernameFilter, setUsernameFilter] = useState("");
  const [idFilter, setIdFilter] = useState(""); // Новый фильтр по ID
  const [sortField, setSortField] = useState<
    "account_id" | "account_name" | "username" | "created_at"
  >("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const resetAllFilters = () => {
    setNameFilter("");
    setUsernameFilter("");
    setIdFilter(""); // Сбрасываем фильтр по ID
    setSortField("created_at");
    setSortDirection("desc");
    setPage(1);
  };

  const getFilteredAndSortedAccounts = () => {
    if (!accountsData?.accounts) return [];

    let filteredAccounts = [...accountsData.accounts];

    if (nameFilter) {
      filteredAccounts = filteredAccounts.filter((account) =>
        account.account_name.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }
    if (usernameFilter) {
      filteredAccounts = filteredAccounts.filter((account) =>
        account.username.toLowerCase().includes(usernameFilter.toLowerCase())
      );
    }
    if (idFilter) {
      filteredAccounts = filteredAccounts.filter((account) =>
        account.account_id.toString().includes(idFilter)
      );
    }

    filteredAccounts.sort((a, b) => {
      const aValue = a[sortField] ?? "";
      const bValue = b[sortField] ?? "";

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return filteredAccounts;
  };

  const handleSort = (
    field: "account_id" | "account_name" | "username" | "created_at"
  ) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredAccounts = getFilteredAndSortedAccounts();
  const totalPages = Math.ceil(filteredAccounts.length / rowsPerPage);
  const paginatedChats = filteredAccounts.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  useEffect(() => {
    setPage(1);
  }, [nameFilter, usernameFilter, idFilter]); // Добавляем idFilter в зависимости

  if (error) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Alert severity="error" sx={{ maxWidth: 600 }}>
          <Typography variant="h6" gutterBottom>
            Не удалось загрузить аккаунты
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
        <PageSkeleton filterCount={3} pagination={true} hasAddButton={false} /> // Обновляем filterCount до 3
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
              <AccountCircleIcon sx={{ fontSize: 40 }} />
              <Box>
                <Typography
                  variant="h4"
                  component="h1"
                  gutterBottom
                  sx={{ mb: 1, fontWeight: 600 }}
                  color="white"
                >
                  Telegram аккаунты
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }} color="white">
                  Просмотр и управление участниками Telegram чатов. Здесь вы
                  можете задавать удобные имена пользователей, например с
                  указанием их роли в проекте.
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
                label="Поиск по ID аккаунта"
                variant="outlined"
                size="small"
                value={idFilter}
                onChange={(e) => setIdFilter(e.target.value)}
                placeholder="Например: 123456"
                sx={{ minWidth: 250 }}
              />
              <TextField
                label="Поиск по названию аккаунта"
                variant="outlined"
                size="small"
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                placeholder="Например: Мой рабочий аккаунт"
                sx={{ minWidth: 250 }}
              />
              <TextField
                label="Поиск по имени пользователя"
                variant="outlined"
                size="small"
                value={usernameFilter}
                onChange={(e) => setUsernameFilter(e.target.value)}
                placeholder="Например: @username"
                sx={{ minWidth: 250 }}
              />

              <ResetFiltersButton onClick={resetAllFilters} />
            </Box>
          </Paper>

          {/* Таблица */}
          <Paper elevation={1} sx={{ overflow: "hidden" }}>
            <AccountsTable
              accounts={paginatedChats}
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
          {filteredAccounts.length === 0 && !isLoading && (
            <Paper elevation={1} sx={{ p: 1, textAlign: "center", mb: 1 }}>
              <AccountCircleIcon
                sx={{ fontSize: 64, color: "text.secondary", mt: 2 }}
              />
              <Typography variant="h6" gutterBottom color="text.secondary">
                {nameFilter || usernameFilter || idFilter
                  ? "Аккаунты не найдены"
                  : "Нет подключенных аккаунтов"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {nameFilter || usernameFilter || idFilter
                  ? "Попробуйте изменить параметры поиска"
                  : "Подключите Telegram аккаунты для начала работы с системой"}
              </Typography>
            </Paper>
          )}
        </>
      )}
    </Box>
  );
};
