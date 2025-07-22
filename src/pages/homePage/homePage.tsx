import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Container,
  // WarningIcon,
} from "@mui/material";
import {
  SmartToy,
  Psychology,
  Schedule,
  Analytics,
  Business,
  Group,
  Info,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isSuperadmin, availableCompanies } = useAuth();

  // Проверка на отсутствие компаний у обычного пользователя
  const hasNoCompanies = !isSuperadmin && availableCompanies.length === 0;

  const dashboardCards = [
    {
      title: "Боты",
      description: "Управление Telegram ботами",
      icon: <SmartToy sx={{ fontSize: 40 }} />,
      path: "/bots",
    },
    {
      title: "Промпты",
      description: "Создание и редактирование промптов",
      icon: <Psychology sx={{ fontSize: 40 }} />,
      path: "/prompts",
    },
    {
      title: "Расписания",
      description: "Настройка автоматических задач",
      icon: <Schedule sx={{ fontSize: 40 }} />,
      path: "/schedules",
    },
    {
      title: "Анализы",
      description: "Просмотр результатов анализа чатов",
      icon: <Analytics sx={{ fontSize: 40 }} />,
      path: "/analysis",
    },
    {
      title: "Компании",
      description: "Управление компаниями",
      icon: <Business sx={{ fontSize: 40 }} />,
      path: "/companies",
    },
    {
      title: "Аккаунты",
      description: "Список Telegram аккаунтов",
      icon: <Group sx={{ fontSize: 40 }} />,
      path: "/accounts",
    },
    {
      title: "Чаты",
      description: "Список Telegram чатов",
      icon: <QuestionAnswerIcon sx={{ fontSize: 40 }} />,
      path: "/chats",
    },
    {
      title: "Справка",
      description: "",
      icon: <Info sx={{ fontSize: 40 }} />,
      path: "/help",
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ textAlign: "center" }}
      >
        Добро пожаловать в систему управления Observer
      </Typography>

      {hasNoCompanies && (
        <Box
          sx={{
            backgroundColor: "#e0eefb",
            p: 2,
            borderRadius: 2,
            mb: 2,
            textAlign: "center",
          }}
        >
          <Typography variant="body1">
            Для доступа ко всем функциям необходимо
          </Typography>
          <Typography variant="body1">
            создать новую компанию или получить доступ к существующей
          </Typography>
        </Box>
      )}

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
              transition: "transform 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 3,
              },
            }}
          >
            <CardContent sx={{ flexGrow: 1, textAlign: "center" }}>
              <Box sx={{ mb: 2, color: "primary.main" }}>{card.icon}</Box>
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
                disabled={hasNoCompanies && card.path !== "/companies"}
                sx={{
                  fontWeight: "bold",
                }}
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
