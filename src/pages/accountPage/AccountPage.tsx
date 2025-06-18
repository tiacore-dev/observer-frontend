// AccountPage.tsx
"use client";

import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Divider,
  Button,
} from "@mui/material";
import { useAuth } from "../../context/authContext";
import { useUserDetailsQuery } from "../../hooks/users/useUsersQuery";
import { IUserEdit, useUpdateUser } from "../../hooks/users/useUserMutations";
import { EditUserModal } from "./userFormModal";

export const AccountPage: React.FC = () => {
  const { user, updateUser: updateAuthUser } = useAuth();
  const { data: userDetails } = useUserDetailsQuery();
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);

  if (!userDetails) {
    return <Typography>Загрузка...</Typography>;
  }

  const handleUpdateUser = (updatedData: Partial<IUserEdit>) => {
    updateUser(
      {
        user_id: userDetails.user_id,
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

  return (
    <Box sx={{ pt: 4, pl: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Мой аккаунт
        </Typography>
        <Button
          variant="contained"
          onClick={() => setIsEditModalOpen(true)}
          style={{ marginRight: 16 }}
        >
          Редактировать
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Card>
          <CardContent>
            {/* <Typography variant="h6" gutterBottom>
              Информация о пользователе
            </Typography> */}
            {/* <Divider sx={{ mb: 2 }} /> */}

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Полное имя
              </Typography>
              <Typography variant="body1">{userDetails.full_name}</Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Email
              </Typography>
              <Typography variant="body1">{userDetails.email}</Typography>
            </Box>

            {userDetails.position && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Должность
                </Typography>
                <Typography variant="body1">{userDetails.position}</Typography>
              </Box>
            )}

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Статус верификации
              </Typography>
              <Chip
                label={
                  userDetails.is_verified ? "Подтвержден" : "Не подтвержден"
                }
                color={userDetails.is_verified ? "success" : "warning"}
                size="small"
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>

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
    </Box>
  );
};
