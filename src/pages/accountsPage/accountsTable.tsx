import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { IAccount } from "../../api/accountsApi";
import { TableSkeleton } from "../../components/skeleton/tableSkeleton";
import { SortableTableHeader } from "../../components/table/sortableTableHeader";

type SortField = "account_name" | "username" | "created_at";

interface AccountsTableProps {
  accounts: IAccount[];
  developerMode: boolean;
  sortField: SortField;
  sortDirection: "asc" | "desc";
  onSort: (field: SortField) => void;
  isLoading?: boolean;
}

export const AccountsTable: React.FC<AccountsTableProps> = ({
  accounts,
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

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="accounts table">
        <TableHead>
          <TableRow>
            {developerMode && <TableCell>ID</TableCell>}
            <SortableTableHeader<SortField>
              field="account_name"
              currentSortField={sortField}
              sortDirection={sortDirection}
              onSort={onSort}
              label="Название аккаунта"
            />
            <SortableTableHeader<SortField>
              field="username"
              currentSortField={sortField}
              sortDirection={sortDirection}
              onSort={onSort}
              label="Пользователь"
            />
            {developerMode && (
              <SortableTableHeader<SortField>
                field="created_at"
                currentSortField={sortField}
                sortDirection={sortDirection}
                onSort={onSort}
                label="Дата создания"
                defaultDirection="desc"
              />
            )}
          </TableRow>
        </TableHead>

        <TableBody>
          {accounts.map((account) => (
            <TableRow
              key={account.account_id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              {developerMode && (
                <TableCell component="th" scope="row">
                  {account.account_id}
                </TableCell>
              )}
              <TableCell>{account.account_name}</TableCell>
              <TableCell>{account.username}</TableCell>
              {developerMode && (
                <TableCell>
                  {new Date(account.created_at).toLocaleString()}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
