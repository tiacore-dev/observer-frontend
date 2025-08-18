"use client";

import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Typography,
  Box,
  TextField,
  Paper,
  Alert,
  Chip,
  IconButton,
  useMediaQuery,
  Theme,
} from "@mui/material";
import type { PageProps } from "../../App";
import { useAccountsQuery } from "../../hooks/accounts/useAccountsQuery";
import { AccountsTable } from "./accountsTable";
import { PageSkeleton } from "../../components/skeleton/pageSkeleton";
import { ResetFiltersButton } from "../../components/table/resetFiltersButton";
import { PaginationControls } from "../../components/table/paginationControls";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {
  setNameFilter,
  setUsernameFilter,
  setIdFilter,
  setPage,
  setRowsPerPage,
  setSortField,
  setSortDirection,
  resetFilters,
} from "../../redux/slice/accountsSlice";
import type { RootState } from "../../redux/store";
import GroupIcon from "@mui/icons-material/Group";
import { useThemeMode } from "../../context/themeContext";
import SearchIcon from "@mui/icons-material/Search";

export const AccountsPage: React.FC<PageProps> = ({ developerMode }) => {
  const theme = useThemeMode();
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );
  const [searchOpen, setSearchOpen] = useState(false);

  const dispatch = useDispatch();
  const {
    nameFilter,
    usernameFilter,
    idFilter,
    page,
    rowsPerPage,
    sortField,
    sortDirection,
  } = useSelector((state: RootState) => state.accounts);

  const {
    data: accountsData,
    isLoading: accountsLoading,
    error: accountsError,
  } = useAccountsQuery();

  const isLoading = accountsLoading;
  const error = accountsError;

  const resetAllFilters = () => {
    dispatch(resetFilters());
  };

  const filteredAccounts = useMemo(() => {
    if (!accountsData?.accounts) return [];

    let filtered = [...accountsData.accounts];

    if (nameFilter) {
      filtered = filtered.filter((account) =>
        account.account_name?.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }
    if (usernameFilter) {
      filtered = filtered.filter((account) =>
        account.username?.toLowerCase().includes(usernameFilter.toLowerCase())
      );
    }
    if (idFilter) {
      filtered = filtered.filter((account) =>
        account.account_id.toString().includes(idFilter)
      );
    }

    return filtered.sort((a, b) => {
      const aValue = a[sortField].toString() ?? "";
      const bValue = b[sortField].toString() ?? "";
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });
  }, [
    accountsData,
    nameFilter,
    usernameFilter,
    idFilter,
    sortField,
    sortDirection,
  ]);

  const totalItems = filteredAccounts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const paginatedAccounts = useMemo(() => {
    return filteredAccounts.slice(
      (currentPage - 1) * rowsPerPage,
      currentPage * rowsPerPage
    );
  }, [filteredAccounts, currentPage, rowsPerPage]);

  useEffect(() => {
    if (page !== currentPage) {
      dispatch(setPage(currentPage));
    }
  }, [page, currentPage, dispatch]);

  const handleSort = (
    field: "account_id" | "account_name" | "username" | "created_at"
  ) => {
    if (sortField === field) {
      dispatch(setSortDirection(sortDirection === "asc" ? "desc" : "asc"));
    } else {
      dispatch(setSortField(field));
      dispatch(setSortDirection("asc"));
    }
  };

  const handlePageChange = (newPage: number) => {
    dispatch(setPage(Math.max(1, Math.min(newPage, totalPages))));
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    const newTotalPages = Math.max(1, Math.ceil(totalItems / newRowsPerPage));
    dispatch(setRowsPerPage(newRowsPerPage));
    dispatch(setPage(Math.min(currentPage, newTotalPages)));
  };

  if (error) {
    return (
      <Box display="flex" justifyContent="center" mt={-1}>
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
    <Box
      sx={{
        pl: isMobile ? 1 : 2,
        pr: isMobile ? 1 : 2,
        mt: -1,
        mb: -2,
        maxWidth: 1600,
        mx: "auto",
      }}
    >
      {isLoading ? (
        <PageSkeleton filterCount={3} pagination={true} hasAddButton={false} />
      ) : (
        <>
          <Paper
            elevation={1}
            sx={{
              p: isMobile ? 2 : 3,
              mb: 1,
              background: theme.isDarkMode
                ? "linear-gradient(135deg, #6366f1aa 0%, #8b5cf6aa 100%)"
                : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <GroupIcon sx={{ fontSize: isMobile ? 32 : 40 }} />
              <Box>
                <Typography
                  variant={isMobile ? "h5" : "h4"}
                  component="h1"
                  gutterBottom
                  sx={{ mb: 1, fontWeight: 600 }}
                  color="white"
                >
                  Telegram аккаунты
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }} color="white">
                  {isMobile
                    ? "Просмотр и управление участниками Telegram чатов."
                    : "Просмотр и управление участниками Telegram чатов. Здесь вы можете задавать удобные имена пользователей, например с указанием их роли в проекте."}
                </Typography>
              </Box>
            </Box>
          </Paper>

          <Paper elevation={1} sx={{ p: isMobile ? 1 : 2, mb: 1 }}>
            <Box
              sx={{
                display: "flex",
                gap: 1,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              {isMobile ? (
                <>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <IconButton onClick={() => setSearchOpen(!searchOpen)}>
                      <SearchIcon />
                    </IconButton>
                    <ResetFiltersButton onClick={resetAllFilters} />
                  </Box>
                </>
              ) : (
                <>
                  <TextField
                    label="Поиск по ID аккаунта"
                    variant="outlined"
                    size="small"
                    value={idFilter}
                    onChange={(e) => dispatch(setIdFilter(e.target.value))}
                    placeholder="Например: 123456"
                    sx={{ minWidth: 250 }}
                  />
                  <TextField
                    label="Поиск по названию аккаунта"
                    variant="outlined"
                    size="small"
                    value={nameFilter}
                    onChange={(e) => dispatch(setNameFilter(e.target.value))}
                    placeholder="Например: Мой рабочий аккаунт"
                    sx={{ minWidth: 250 }}
                  />
                  <TextField
                    label="Поиск по имени пользователя"
                    variant="outlined"
                    size="small"
                    value={usernameFilter}
                    onChange={(e) =>
                      dispatch(setUsernameFilter(e.target.value))
                    }
                    placeholder="Например: @username"
                    sx={{ minWidth: 250 }}
                  />
                  <ResetFiltersButton onClick={resetAllFilters} />
                </>
              )}
            </Box>
            {isMobile && searchOpen && (
              <Paper
                sx={{
                  mt: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  backgroundColor: "background.paper",
                }}
              >
                <TextField
                  fullWidth
                  label="Поиск по ID аккаунта"
                  variant="outlined"
                  size="small"
                  value={idFilter}
                  onChange={(e) => dispatch(setIdFilter(e.target.value))}
                  placeholder="Например: 123456"
                />
                <TextField
                  fullWidth
                  label="Поиск по названию аккаунта"
                  variant="outlined"
                  size="small"
                  value={nameFilter}
                  onChange={(e) => dispatch(setNameFilter(e.target.value))}
                  placeholder="Например: Мой рабочий аккаунт"
                />
                <TextField
                  fullWidth
                  label="Поиск по имени пользователя"
                  variant="outlined"
                  size="small"
                  value={usernameFilter}
                  onChange={(e) => dispatch(setUsernameFilter(e.target.value))}
                  placeholder="Например: @username"
                />
              </Paper>
            )}
          </Paper>

          <Paper elevation={1} sx={{ overflow: "hidden" }}>
            <AccountsTable
              accounts={paginatedAccounts}
              developerMode={developerMode}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
              isMobile={isMobile}
            />
            {totalPages > 1 && (
              <PaginationControls
                count={totalPages}
                page={currentPage}
                onPageChange={handlePageChange}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleRowsPerPageChange}
                totalItems={totalItems}
              />
            )}
          </Paper>

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
                  : "Подключите Telegram бота, чтобы аккаунты начали отображаться"}
              </Typography>
            </Paper>
          )}
        </>
      )}
    </Box>
  );
};
