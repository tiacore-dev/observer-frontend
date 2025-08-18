import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  IconButton,
  Tooltip,
  Box,
  Typography,
  Avatar,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { IAccount } from "../../api/accountsApi";
import { EditAccountModal } from "./editAccountModal";
import { useUpdateAccount } from "../../hooks/accounts/useAccountsQuery";

interface AccountsTableProps {
  accounts: IAccount[];
  developerMode?: boolean;
  sortField: "account_id" | "account_name" | "username" | "created_at";
  sortDirection: "asc" | "desc";
  onSort: (
    field: "account_id" | "account_name" | "username" | "created_at"
  ) => void;
  isMobile?: boolean;
}

export const AccountsTable: React.FC<AccountsTableProps> = ({
  accounts,
  developerMode,
  sortField,
  sortDirection,
  onSort,
  isMobile = false,
}) => {
  const [editingAccount, setEditingAccount] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { mutate: updateAccount } = useUpdateAccount();

  const handleEditClick = (account: IAccount) => {
    setEditingAccount({
      id: account.account_id.toString(),
      name: account.username,
    });
    setIsModalOpen(true);
  };

  const handleSave = (newName: string) => {
    if (editingAccount) {
      updateAccount({
        account_id: editingAccount.id,
        account_name: newName,
      });
    }
    setIsModalOpen(false);
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
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

  const getAccountAvatar = (username: string) => {
    const initials = username ? username.charAt(0).toUpperCase() : "U";
    return (
      <Avatar
        sx={{
          width: 32,
          height: 32,
          bgcolor: "primary.main",
          color: "white",
          fontSize: "0.875rem",
          fontWeight: 600,
        }}
      >
        {initials}
      </Avatar>
    );
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: isMobile ? 300 : 650 }}>
          {!isMobile && (
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={sortField === "account_id"}
                    direction={sortDirection}
                    onClick={() => onSort("account_id")}
                  >
                    ID
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortField === "account_name"}
                    direction={sortDirection}
                    onClick={() => onSort("account_name")}
                  >
                    Имя аккаунта
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortField === "username"}
                    direction={sortDirection}
                    onClick={() => onSort("username")}
                  >
                    Имя пользователя
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortField === "created_at"}
                    direction={sortDirection}
                    onClick={() => onSort("created_at")}
                  >
                    Дата создания
                  </TableSortLabel>
                </TableCell>
                <TableCell> </TableCell>
              </TableRow>
            </TableHead>
          )}
          <TableBody>
            {accounts.map((account) => (
              <TableRow key={account.account_id}>
                {isMobile ? (
                  <TableCell sx={{ p: 1.5 }}>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                    >
                      {getAccountAvatar(account.username || "U")}
                      <Box sx={{ flexGrow: 1 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 0.5,
                          }}
                        >
                          {account.username && (
                            <Typography>{account.username}</Typography>
                          )}
                          <IconButton
                            onClick={() => handleEditClick(account)}
                            size="small"
                            sx={{ ml: "auto" }}
                          >
                            <EditIcon
                              fontSize="small"
                              sx={{ color: "#667eea" }}
                            />
                          </IconButton>
                        </Box>
                        <Typography variant="body2" fontWeight={500}>
                          {account.account_name
                            ? `@${account.account_name}`
                            : "Не указано"}
                        </Typography>
                        <Tooltip title="Копировать ID" arrow>
                          <Typography
                            variant="caption"
                            component="span"
                            onClick={(e) =>
                              handleCellClick(e, account.account_id.toString())
                            }
                            sx={{
                              cursor: "pointer",
                              fontFamily: "monospace",
                              bgcolor: "grey.100",
                              p: 0.5,
                              borderRadius: 1,
                              "&:hover": {
                                bgcolor: "grey.300",
                              },
                            }}
                          >
                            ID: {account.account_id}
                          </Typography>
                        </Tooltip>
                      </Box>
                    </Box>
                  </TableCell>
                ) : (
                  <>
                    <TableCell
                      onClick={(e) =>
                        handleCellClick(e, account.account_id.toString())
                      }
                    >
                      <Tooltip title="Копировать ID" arrow>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Typography
                            variant="body2"
                            component="span"
                            sx={{
                              cursor: "pointer",
                              fontFamily: "monospace",
                              bgcolor: "grey.100",
                              p: 0.5,
                              borderRadius: 1,
                              "&:hover": {
                                bgcolor: "grey.300",
                              },
                            }}
                          >
                            {account.account_id}
                          </Typography>
                        </Box>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        {getAccountAvatar(account.username || "U")}
                        <Typography variant="body1" fontWeight={500}>
                          {account.account_name
                            ? `@${account.account_name}`
                            : "Не указано"}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{account.username || "Не указано"}</TableCell>
                    <TableCell>{formatDate(account.created_at)}</TableCell>
                    <TableCell>
                      <Tooltip title="Редактировать имя">
                        <IconButton
                          onClick={() => handleEditClick(account)}
                          size="small"
                        >
                          <EditIcon
                            fontSize="small"
                            sx={{ color: "#667eea" }}
                          />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <EditAccountModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        accountName={editingAccount?.name || ""}
        onSave={handleSave}
      />
    </>
  );
};
