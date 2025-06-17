"use client";

import type React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Divider,
} from "@mui/material";
import { useAuth } from "../../context/authContext";

export const AccountPage: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <Typography>Загрузка...</Typography>;
  }

  return (
    <Box sx={{ pt: 4, pl: 4 }}>
      <Typography variant="h4" gutterBottom>
        Мой аккаунт
      </Typography>

      <Grid container spacing={3}>
        {/* <Grid item xs={12} md={6}> */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Информация о пользователе
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Полное имя
              </Typography>
              <Typography variant="body1">{user.full_name}</Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Email
              </Typography>
              <Typography variant="body1">{user.email}</Typography>
            </Box>

            {user.position && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Должность
                </Typography>
                <Typography variant="body1">{user.position}</Typography>
              </Box>
            )}

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Статус верификации
              </Typography>
              <Chip
                label={user.is_verified ? "Подтвержден" : "Не подтвержден"}
                color={user.is_verified ? "success" : "warning"}
                size="small"
              />
            </Box>

            {/* {isSuperAdmin && (
                <Box sx={{ mb: 2 }}>
                  <Chip label="Суперадминистратор" color="secondary" size="small" />
                </Box>
              )} */}
          </CardContent>
        </Card>
      </Grid>
      {/* </Grid> */}

      {/* <Grid item xs={12} md={6}> */}
      {/* <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Компании
          </Typography>
          <Divider sx={{ mb: 2 }} /> */}

      {/* {selectedCompany && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Текущая компания
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    {selectedCompany.company_name}
                  </Typography>
                  {selectedCompany.description && (
                    <Typography variant="body2" color="text.secondary">
                      {selectedCompany.description}
                    </Typography>
                  )}
                </Box>
              )} */}

      {/* <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Доступные компании ({companies.length})
            </Typography>
            {companies.map((company) => (
                  <Chip
                    key={company.company_id}
                    label={company.company_name}
                    variant={
                      selectedCompany?.company_id === company.company_id
                        ? "filled"
                        : "outlined"
                    }
                    sx={{ mr: 1, mb: 1 }}
                  />
                ))}
          </Box> */}
      {/* </CardContent>
      </Card> */}
      {/* </Grid> */}
      {/* </Grid> */}
    </Box>
  );
};
