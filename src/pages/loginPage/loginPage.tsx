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
  const [showResendLink, setShowResendLink] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      setIsSubmitting(true);
      try {
        await login(data);
        setShowResendLink(false);
      } catch (error: any) {
        if (error.response?.status === 403) {
          setShowResendLink(true);
          enqueueSnackbar("Email не подтвержден", { variant: "error" });
        } else {
          setShowResendLink(false);
          enqueueSnackbar("Ошибка при авторизации", { variant: "error" });
        }
      } finally {
        setIsSubmitting(false);
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
          borderRadius: 2,
        }}
      >
        {showResendLink && (
          <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
            <Typography color="error" sx={{ mr: 1 }}>
              Email не подтвержден
            </Typography>
            <Button
              variant="text"
              size="small"
              disabled={resendVerificationMutation.isPending}
              onClick={() => resendVerificationMutation.mutate(emailValue)}
            >
              {resendVerificationMutation.isPending ? (
                <CircularProgress size={20} />
              ) : (
                "Отправить письмо повторно"
              )}
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
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={24} /> : "Войти"}
          </Button>

          <Button
            type="button"
            fullWidth
            variant="text"
            onClick={() => setIsRegisterModalVisible(true)}
            disabled={isSubmitting}
          >
            Зарегистрироваться
          </Button>
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
    </Box>
  );
};
