import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Button,
  TextField,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Link,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useResetPasswordMutation } from "../../hooks/register/useRegisterMutations";
import { useForm, Controller } from "react-hook-form";

interface FormData {
  password: string;
  confirmPassword: string;
}

export const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const resetPasswordMutation = useResetPasswordMutation();
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    if (!token) return;

    resetPasswordMutation.mutate(
      { password: data.password, token },
      {
        onSuccess: () => {},
        onError: (error: any) => {},
      }
    );
  };

  if (!token) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            width: "100%",
            maxWidth: 400,
            borderRadius: 1,
            textAlign: "center",
          }}
        >
          <Typography variant="h5" gutterBottom>
            Неверная ссылка для сброса пароля
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Ссылка для сброса пароля недействительна или отсутствует токен.
          </Typography>
          <Button variant="contained" onClick={() => navigate("/login")}>
            Вернуться на страницу входа
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        position: "relative",
      }}
    >
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate("/login")}
        sx={{ position: "absolute", left: 20, top: 20 }}
      >
        Вернуться
      </Button>

      <Paper
        elevation={3}
        sx={{
          padding: 4,
          width: "100%",
          maxWidth: 400,
          borderRadius: 1,
        }}
      >
        <Typography variant="h5" gutterBottom align="center">
          Сброс пароля
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }} align="center">
          Введите новый пароль для вашей учетной записи
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="password"
            control={control}
            rules={{
              required: "Пожалуйста, введите новый пароль",
              minLength: {
                value: 6,
                message: "Пароль должен содержать минимум 6 символов",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Новый пароль"
                type="password"
                margin="normal"
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            )}
          />

          <Controller
            name="confirmPassword"
            control={control}
            rules={{
              required: "Пожалуйста, подтвердите пароль",
              validate: (value) =>
                value === watch("password") || "Пароли не совпадают",
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Подтвердите пароль"
                type="password"
                margin="normal"
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
              />
            )}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
            disabled={resetPasswordMutation.isPending}
          >
            {resetPasswordMutation.isPending ? (
              <CircularProgress size={24} />
            ) : (
              "Изменить пароль"
            )}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};
