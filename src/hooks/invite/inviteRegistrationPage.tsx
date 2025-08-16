// src/pages/InviteRegistrationPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Stack,
} from "@mui/material";
import { useRegisterWithToken } from "./useInviteUser";
import { enqueueSnackbar } from "notistack";

type FormValues = {
  email: string;
  password: string;
  confirmPassword: string;
  full_name: string;
  position: string;
};

export const InviteRegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState<string>("");
  const [initialEmail, setInitialEmail] = useState<string>("");
  const [isValidLink, setIsValidLink] = useState<boolean>(true);
  const [formValues, setFormValues] = useState<FormValues>({
    email: "",
    password: "",
    confirmPassword: "",
    full_name: "",
    position: "",
  });

  const {
    mutate: registerWithToken,
    isPending,
    isError,
    error,
  } = useRegisterWithToken();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const urlToken = searchParams.get("token");
    const urlEmail = searchParams.get("email");

    if (!urlToken) {
      enqueueSnackbar("Неверная ссылка приглашения - отсутствует токен", {
        variant: "error",
      });
      setIsValidLink(false);
      return;
    }

    setToken(urlToken);
    const initialEmailValue = urlEmail || "";
    setInitialEmail(initialEmailValue);
    setFormValues((prev) => ({ ...prev, email: initialEmailValue }));
  }, [location.search]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formValues.password !== formValues.confirmPassword) {
      enqueueSnackbar("Пароли не совпадают", { variant: "error" });
      return;
    }

    registerWithToken(
      {
        token,
        email: formValues.email,
        password: formValues.password,
        full_name: formValues.full_name,
        position: formValues.position || "",
      },
      {
        onSuccess: () => {
          enqueueSnackbar("Регистрация завершена успешно!", {
            variant: "success",
          });
          navigate("/");
        },
      }
    );
  };

  if (!isValidLink) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            Ссылка приглашения недействительна. Пожалуйста, запросите новое
            приглашение.
          </Alert>
          <Button
            variant="contained"
            onClick={() => navigate("/login")}
            fullWidth
          >
            Перейти на страницу входа
          </Button>
        </Paper>
      </Container>
    );
  }

  if (!token) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Завершение регистрации
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            type="email"
            value={formValues.email}
            onChange={handleChange}
            required
            disabled={!!initialEmail}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Пароль"
            name="password"
            type="password"
            value={formValues.password}
            onChange={handleChange}
            required
            inputProps={{ minLength: 6 }}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Подтверждение пароля"
            name="confirmPassword"
            type="password"
            value={formValues.confirmPassword}
            onChange={handleChange}
            required
            inputProps={{ minLength: 6 }}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Ф.И.О."
            name="full_name"
            value={formValues.full_name}
            onChange={handleChange}
            required
            inputProps={{ minLength: 3 }}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Должность (необязательно)"
            name="position"
            value={formValues.position}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />

          {isError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error?.response?.data?.message || "Ошибка при регистрации"}
            </Alert>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isPending}
            sx={{ mt: 3 }}
          >
            {isPending ? (
              <CircularProgress size={24} />
            ) : (
              "Завершить регистрацию"
            )}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};
