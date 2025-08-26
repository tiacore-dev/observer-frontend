// src/pages/AcceptInvitePage.tsx (вариант с использованием хука)
import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Paper,
  Container,
  Alert,
} from "@mui/material";
import { useAcceptInviteMutation } from "../../hooks/invite/useInviteUser";

export const AcceptInvitePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const { mutate, isPending, isError, isSuccess } = useAcceptInviteMutation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const urlToken = searchParams.get("token");

    if (urlToken) {
      setToken(urlToken);
      mutate(urlToken);
    } else {
      setError("Приглашение отсутствует или недействительно");
    }
  }, [location.search, mutate]);

  const goToHome = () => {
    navigate("/");
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
        {isPending ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <CircularProgress size={60} sx={{ mb: 3 }} />
            <Typography variant="h5" gutterBottom>
              Обработка приглашения...
            </Typography>
            <Typography color="text.secondary">
              Пожалуйста, подождите
            </Typography>
          </Box>
        ) : isError ? (
          <>
            <Alert severity="error" sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Ошибка при обработке приглашения
              </Typography>
              {error && <Typography variant="body1">{error}</Typography>}
            </Alert>
            <Button
              variant="contained"
              // onClick={() => navigate("/login")}
              onClick={() => navigate("/")}
              size="large"
            >
              Перейти на страницу входа
            </Button>
          </>
        ) : isSuccess ? (
          <>
            <Alert severity="success" sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Приглашение успешно принято!
              </Typography>
              <Typography>Теперь вы можете войти в систему</Typography>
            </Alert>
            <Button variant="contained" onClick={goToHome} size="large">
              Перейти на главную
            </Button>
          </>
        ) : null}
      </Paper>
    </Container>
  );
};
