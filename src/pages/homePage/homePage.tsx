import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Container,
} from "@mui/material";
import {
  SmartToy,
  Psychology,
  Schedule,
  Analytics,
  Business,
  Group,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isSuperadmin } = useAuth();

  const dashboardCards = [
    {
      title: "Боты",
      description: "Управление Telegram ботами",
      icon: <SmartToy sx={{ fontSize: 40 }} />,
      path: "/bots",
      // color: "#1976d2",
    },
    {
      title: "Промпты",
      description: "Создание и редактирование промптов",
      icon: <Psychology sx={{ fontSize: 40 }} />,
      path: "/prompts",
      // color: "#388e3c",
    },
    {
      title: "Расписания",
      description: "Настройка автоматических задач",
      icon: <Schedule sx={{ fontSize: 40 }} />,
      path: "/schedules",
      // color: "#f57c00",
    },
    {
      title: "Анализы",
      description: "Просмотр результатов анализа чатов",
      icon: <Analytics sx={{ fontSize: 40 }} />,
      path: "/analysis",
      // color: "#7b1fa2",
    },
    // ...(isSuperadmin
    //   ?
    // [
    {
      title: "Компании",
      description: "Управление компаниями",
      icon: <Business sx={{ fontSize: 40 }} />,
      path: "/companies",
      // color: "#d32f2f",
    },
    // ]
    // : []),
    {
      title: "Аккаунты",
      description: "Список Telegram аккаунтов",
      icon: <Group sx={{ fontSize: 40 }} />,
      path: "/accounts",
      // color: "#1976d2",
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ mb: 4, textAlign: "center" }}
      >
        Добро пожаловать в систему управления Observer
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md:
              dashboardCards.length <= 4 ? "repeat(4, 1fr)" : "repeat(3, 1fr)",
            lg:
              dashboardCards.length <= 4 ? "repeat(4, 1fr)" : "repeat(3, 1fr)",
          },
          gap: 3,
        }}
      >
        {dashboardCards.map((card, index) => (
          <Card
            key={index}
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardContent sx={{ flexGrow: 1, textAlign: "center" }}>
              <Box sx={{ mb: 2 }}>{card.icon}</Box>
              <Typography variant="h6" component="h2" gutterBottom>
                {card.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {card.description}
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: "center", pb: 2 }}>
              <Button
                variant="contained"
                onClick={() => navigate(card.path)}
                // sx={{
                //   backgroundColor: card.color,
                //   "&:hover": { backgroundColor: card.color },
                // }}
              >
                Перейти
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
    </Container>
  );
};
