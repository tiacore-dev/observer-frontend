import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
} from "@mui/material";
import { IAccount } from "../../api/accountsApi";

interface AccountsTableProps {
  accounts: IAccount[];
  developerMode: boolean;
  sortField: "account_name" | "created_at" | "username";
  sortDirection: "asc" | "desc";
  onSort: (field: "account_name" | "created_at" | "username") => void;
}

export const AccountsTable: React.FC<AccountsTableProps> = ({
  accounts,
  developerMode,
  sortField,
  sortDirection,
  onSort,
}) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="accounts table">
        <TableHead>
          <TableRow>
            {developerMode && <TableCell>ID</TableCell>}
            <TableCell
              sortDirection={
                sortField === "account_name" ? sortDirection : false
              }
            >
              <TableSortLabel
                active={sortField === "account_name"}
                direction={sortField === "account_name" ? sortDirection : "asc"}
                onClick={() => onSort("account_name")}
              >
                Название аккаунта
              </TableSortLabel>
            </TableCell>
            <TableCell
              sortDirection={sortField === "username" ? sortDirection : false}
            >
              <TableSortLabel
                active={sortField === "username"}
                direction={sortField === "username" ? sortDirection : "asc"}
                onClick={() => onSort("username")}
              >
                Пользователь
              </TableSortLabel>
            </TableCell>
            {developerMode && (
              <TableCell
                sortDirection={
                  sortField === "created_at" ? sortDirection : false
                }
              >
                <TableSortLabel
                  active={sortField === "created_at"}
                  direction={sortField === "created_at" ? sortDirection : "asc"}
                  onClick={() => onSort("created_at")}
                >
                  Дата создания
                </TableSortLabel>
              </TableCell>
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
