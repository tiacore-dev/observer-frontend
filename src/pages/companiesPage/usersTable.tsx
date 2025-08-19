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
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  useMediaQuery,
  Theme,
} from "@mui/material";
import { IUser } from "../../api/usersApi";
import EmailIcon from "@mui/icons-material/Email";
import VerifiedIcon from "@mui/icons-material/Verified";
import PendingIcon from "@mui/icons-material/Pending";

interface UsersTableProps {
  users: IUser[];
  loading: boolean;
  isMobile?: boolean;
}

export const UsersTable: React.FC<UsersTableProps> = ({
  users,
  loading,
  isMobile = false,
}) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (isMobile) {
    return (
      <Paper>
        <List>
          {users.map((user) => (
            <ListItem key={user.user_id} divider>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: "primary.main", color: "white" }}>
                  {user.full_name
                    ? user.full_name.charAt(0).toUpperCase()
                    : "U"}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="body1" fontWeight={500}>
                    {user.full_name || "Не указано"}
                  </Typography>
                }
                secondary={
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                      mt: 1,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <EmailIcon color="action" fontSize="small" />
                      <Typography variant="body2">{user.email}</Typography>
                    </Box>
                    <Chip
                      icon={
                        user.is_verified ? <VerifiedIcon /> : <PendingIcon />
                      }
                      label={
                        user.is_verified
                          ? "Верифицирован"
                          : "Ожидает верификации"
                      }
                      color={user.is_verified ? "success" : "warning"}
                      size="small"
                    />
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>
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
