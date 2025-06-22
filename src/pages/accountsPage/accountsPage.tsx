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
import { useAccountsQuery } from "../../hooks/accounts/useAccountsQuery";
import { AccountsTable } from "./accountsTable";
import ClearIcon from "@mui/icons-material/Clear";
import { PageSkeleton } from "../../components/skeleton/pageSkeleton";
import { ResetFiltersButton } from "../../components/table/resetFiltersButton";
import { PaginationControls } from "../../components/table/paginationControls";

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
  const [sortField, setSortField] = useState<
    "account_name" | "username" | "created_at"
  >("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const resetAllFilters = () => {
    setNameFilter("");
    setUsernameFilter("");
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

    filteredAccounts.sort((a, b) => {
      // Используем нулевой coalescing оператор для безопасной сортировки
      const aValue = a[sortField] ?? "";
      const bValue = b[sortField] ?? "";

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return filteredAccounts;
  };

  const handleSort = (field: "account_name" | "username" | "created_at") => {
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
  }, [nameFilter, usernameFilter]);

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
            <TextField
              label="Поиск по пользователю"
              variant="outlined"
              size="small"
              value={usernameFilter}
              onChange={(e) => setUsernameFilter(e.target.value)}
            />

            <ResetFiltersButton onClick={resetAllFilters} />
          </Box>

          <AccountsTable
            accounts={paginatedChats}
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
