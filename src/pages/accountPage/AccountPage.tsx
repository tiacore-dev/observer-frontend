// AccountPage.tsx
"use client";

import React from "react";
import {
  Box,
  Card,
  Typography,
  Grid,
  Chip,
  Button,
  CircularProgress,
  Avatar,
  Divider,
} from "@mui/material";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Badge as BadgeIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { useAuth } from "../../context/authContext";
import { useUserDetailsQuery } from "../../hooks/users/useUsersQuery";
import { IUserEdit, useUpdateUser } from "../../hooks/users/useUserMutations";
import { EditUserModal } from "./userFormModal";
import { getInitials } from "../../components/AppLayout";

// const getInitials = (fullName?: string) => {
//   if (!fullName) return "?";
//   return fullName
//     .split(" ")
//     .map((name) => name.charAt(0))
//     .join("")
//     .toUpperCase()
//     .slice(0, 2);
// };

export const AccountPage: React.FC = () => {
  const { user, updateUser: updateAuthUser } = useAuth();
  const { data: userDetails, isLoading } = useUserDetailsQuery();
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);

  const handleUpdateUser = (updatedData: Partial<IUserEdit>) => {
    updateUser(
      {
        user_id: userDetails?.user_id || "",
        updatedData,
      },
      {
        onSuccess: () => {
          updateAuthUser(updatedData);
        },
      }
    );
    setIsEditModalOpen(false);
  };

  const handleVerify = async () => {
    if (userDetails) {
      handleUpdateUser({ is_verified: true });
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!userDetails) {
    return (
      <Card
        sx={{
          width: "100%",
          maxWidth: 800,
          textAlign: "center",
          p: 5,
          mx: "auto",
          my: 1,
        }}
      >
        <PersonIcon sx={{ fontSize: 48, color: "action.disabled", mb: 1 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Информация о пользователе недоступна
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Не удалось загрузить данные пользователя
        </Typography>
      </Card>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Информация о пользователе
        </Typography>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => setIsEditModalOpen(true)}
          sx={{ mb: 2 }}
        >
          Редактировать
        </Button>
      </Box>

      <Card sx={{ width: "100%", maxWidth: 800, mx: "auto" }}>
        <Box sx={{ p: 3, borderBottom: 1, borderColor: "divider" }}>
          <Grid container spacing={3} alignItems="center">
            {/* Аватар и основная информация */}
            <Grid>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                  textAlign: "center",
                }}
              >
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: "#20B2AA",
                    color: "white",
                    fontSize: 24,
                    fontWeight: "bold",
                  }}
                >
                  {getInitials(userDetails.full_name)}
                </Avatar>
              </Box>
            </Grid>

            {/* Детальная информация */}
            <Grid>
              <Box sx={{ "& > div": { mb: 2 } }}>
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                  >
                    <EmailIcon fontSize="small" />
                    Email адрес
                  </Typography>
                  <Typography variant="body1">{userDetails.email}</Typography>
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                  >
                    <PersonIcon fontSize="small" />
                    Полное имя
                  </Typography>
                  <Typography variant="body1">
                    {userDetails.full_name || "Не указано"}
                  </Typography>
                </Box>
                {userDetails?.position && (
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      Должность
                    </Typography>
                    <Typography variant="body1">
                      {userDetails.position}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Card>

      {userDetails && (
        <EditUserModal
          open={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          userData={{
            email: userDetails.email,
            full_name: userDetails.full_name,
            position: userDetails.position,
            is_verified: userDetails.is_verified,
          }}
          onSubmit={handleUpdateUser}
          isSubmitting={isUpdating}
        />
      )}
    </Box>
  );
};
