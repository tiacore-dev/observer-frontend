import React, { useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Button,
  Typography,
  CircularProgress,
  Box,
  TextField,
  Paper,
} from "@mui/material";
import { useLoginMutation } from "../../hooks/auth/useAuthMutations";

type FormData = {
  username: string;
  password: string;
};

export const LoginPage: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const loginMutation = useLoginMutation(); // Предполагается, что хук уже адаптирован

  const onSubmit = useCallback(
    (data: FormData) => {
      console.log("Submitting form data:", data); // Логирование
      loginMutation.mutate(data);
    },
    [loginMutation]
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
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Вход
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="username"
            control={control}
            rules={{
              required: "Логин обязателен",
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="username"
                variant="outlined"
                margin="normal"
                disabled={loginMutation.isPending}
                error={!!errors.username}
                helperText={errors.username?.message}
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
                disabled={loginMutation.isPending}
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
            disabled={loginMutation.isPending}
            sx={{ mt: 3, mb: 2 }}
          >
            {loginMutation.isPending ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Войти"
            )}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};
