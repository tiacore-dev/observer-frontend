// src/pages/loginPage.tsx
import React, { useCallback, useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useLocation } from "react-router-dom";
import {
  Button,
  Typography,
  CircularProgress,
  Box,
  TextField,
  Paper,
} from "@mui/material";
import { useAuth } from "../../context/authContext";
import { UserRegistrationModal } from "./userRegistrationModal";
import { ResetPasswordModal } from "./resetPasswordModal";
import {
  useVerifyEmailMutation,
  useResendVerificationMutation,
} from "../../hooks/register/useRegisterMutations";
import { enqueueSnackbar } from "notistack";

type FormData = {
  email: string;
  password: string;
};

export const LoginPage: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { login } = useAuth();
  const location = useLocation();
  const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);
  const [isResetPasswordModalVisible, setIsResetPasswordModalVisible] =
    useState(false);
  const [showResendLink, setShowResendLink] = useState(false);
  const emailValue = watch("email");

  const resendVerificationMutation = useResendVerificationMutation();
  const verifyEmailMutation = useVerifyEmailMutation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get("token");

    if (token) {
      verifyEmailMutation.mutate(token);
      // Очищаем URL от токена
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, [location]);

  const onSubmit = useCallback(
    async (data: FormData) => {
      try {
        await login(data);
        setShowResendLink(false);
      } catch (error: any) {
        if (error.response?.status === 403) {
          setShowResendLink(true);
          enqueueSnackbar("Email не подтвержден", { variant: "error" });
        } else if (error.response?.status === 401) {
          enqueueSnackbar("Неверный логин или пароль", { variant: "error" });
        } else if (error.response?.status === 404) {
          enqueueSnackbar("Пользователь с такой почтой не зарегистрирован", {
            variant: "error",
          });
        } else {
          setShowResendLink(false);
          enqueueSnackbar("Ошибка при авторизации", { variant: "error" });
        }
      }
    },
    [login]
  );

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
        }}
      >
        {showResendLink && (
          <Box
            sx={{
              mb: 2,
              display: "grid",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#fff0f0",
              borderRadius: 1,
            }}
          >
            <Typography
              color="error"
              sx={{
                mt: 1,
                display: "grid",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Email не подтвержден
            </Typography>
            <Button
              variant="text"
              disabled={resendVerificationMutation.isPending}
              onClick={() => resendVerificationMutation.mutate(emailValue)}
            >
              Отправить письмо повторно
            </Button>
          </Box>
        )}

        <Typography variant="h4" component="h1" gutterBottom align="center">
          Вход
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="email"
            control={control}
            rules={{
              required: "Email обязателен",
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Email"
                variant="outlined"
                margin="normal"
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            rules={{
              required: "Пароль обязателен",
              minLength: {
                value: 6,
                message: "Пароль должен содержать минимум 6 символов",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Пароль"
                type="password"
                variant="outlined"
                margin="normal"
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            )}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            Войти
          </Button>

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              type="button"
              variant="text"
              onClick={() => setIsRegisterModalVisible(true)}
            >
              Зарегистрироваться
            </Button>
            <Button
              type="button"
              variant="text"
              onClick={() => setIsResetPasswordModalVisible(true)}
            >
              Не помню пароль
            </Button>
          </Box>
        </form>
      </Paper>

      <UserRegistrationModal
        open={isRegisterModalVisible}
        onClose={() => setIsRegisterModalVisible(false)}
        onSuccess={() => {
          enqueueSnackbar(
            "Регистрация успешна! Пожалуйста, проверьте вашу почту для подтверждения email.",
            { variant: "success" }
          );
        }}
      />

      <ResetPasswordModal
        open={isResetPasswordModalVisible}
        onClose={() => setIsResetPasswordModalVisible(false)}
        onSuccess={() => {}}
      />
    </Box>
  );
};
