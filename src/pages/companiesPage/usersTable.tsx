// src/components/usersTable.tsx
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Typography,
  CircularProgress,
  Box,
  Chip,
} from "@mui/material";
import { IUser } from "../../api/usersApi";
import EmailIcon from "@mui/icons-material/Email";
import VerifiedIcon from "@mui/icons-material/Verified";
import PendingIcon from "@mui/icons-material/Pending";

interface UsersTableProps {
  users: IUser[];
  loading: boolean;
}

export const UsersTable: React.FC<UsersTableProps> = ({ users, loading }) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Пользователь</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Статус</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.user_id}>
              <TableCell>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar sx={{ bgcolor: "primary.main", color: "white" }}>
                    {user.full_name
                      ? user.full_name.charAt(0).toUpperCase()
                      : "U"}
                  </Avatar>
                  <Typography>{user.full_name || "Не указано"}</Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box display="flex" alignItems="center" gap={1}>
                  <EmailIcon color="action" />
                  <Typography>{user.email}</Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Chip
                  icon={user.is_verified ? <VerifiedIcon /> : <PendingIcon />}
                  label={
                    user.is_verified ? "Верифицирован" : "Ожидает верификации"
                  }
                  color={user.is_verified ? "success" : "warning"}
                  sx={{ color: "grey.100" }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
