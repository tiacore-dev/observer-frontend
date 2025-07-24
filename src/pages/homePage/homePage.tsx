"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Alert,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Fab,
  Zoom,
  Paper,
  Chip,
  IconButton,
  Divider,
} from "@mui/material";
import {
  SmartToy,
  Psychology,
  Schedule,
  Analytics,
  Business,
  PlayArrow,
  Help,
  TipsAndUpdates,
  ArrowForward,
  Dashboard,
  People,
  Chat,
  Settings,
  Assessment,
  Info,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { useBotsQuery } from "../../hooks/bots/useBotsQuery";
import { usePromptsQuery } from "../../hooks/prompts/usePromptsQuery";
import { useSchedulesQuery } from "../../hooks/schedules/useSchedulesQuery";
import { useCompaniesQuery } from "../../hooks/companies/useCompaniesQuery";
import { GuidedTour } from "../../components/guidedTour";
import { SetupProgress } from "../../components/setupProgress";
import ChatIcon from "@mui/icons-material/Chat";

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isSuperadmin, availableCompanies } = useAuth();
  const [showTour, setShowTour] = useState(false);
  const [tourCompleted, setTourCompleted] = useState(() => {
    return localStorage.getItem("tourCompleted") === "true";
  });

  // Загружаем данные для анализа состояния системы
  const { data: botsData } = useBotsQuery();
  const { data: promptsData } = usePromptsQuery();
  const { data: schedulesData } = useSchedulesQuery();
  const { data: companiesData } = useCompaniesQuery();

  const hasCompanies = isSuperadmin
    ? (companiesData?.companies?.length || 0) > 0
    : availableCompanies.length > 0;
  const hasBots = (botsData?.bots?.length || 0) > 0;
  const hasPrompts = (promptsData?.prompts?.length || 0) > 0;
  const hasSchedules = (schedulesData?.schedules?.length || 0) > 0;
  const isNewUser = !hasCompanies && !hasBots && !hasPrompts && !hasSchedules;

  useEffect(() => {
    if (isNewUser && !tourCompleted) {
      const timer = setTimeout(() => setShowTour(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [isNewUser, tourCompleted]);

  const setupSteps = [
    {
      id: "company",
      title: "Создать компанию",
      description: "Рабочее пространство для ваших проектов",
      completed: hasCompanies,
      action: () => navigate("/companies"),
      actionText: "Создать",
    },
    {
      id: "bot",
      title: "Добавить бота",
      description: "Telegram-бот для отправки сообщений",
      completed: hasBots,
      action: () => navigate("/bots"),
      actionText: "Добавить",
    },
    {
      id: "prompt",
      title: "Создать промпт",
      description: "Шаблон анализа с переменными",
      completed: hasPrompts,
      action: () => navigate("/prompts"),
      actionText: "Создать",
    },
    {
      id: "schedule",
      title: "Настроить расписание",
      description: "Автоматическая отправка по времени",
      completed: hasSchedules,
      action: () => navigate("/schedules"),
      actionText: "Настроить",
    },
  ];

  const completedSteps = setupSteps.filter((step) => step.completed).length;
  const allStepsCompleted = completedSteps === setupSteps.length;

  // Основные функции системы
  const mainFeatures = [
    {
      title: "Компании",
      description: "Управление рабочими пространствами",
      icon: <Business />,
      color: "#6366f1",
      action: () => navigate("/companies"),
      enabled: true,
    },
    {
      title: "Telegram Боты",
      description: "Управление ботами для отправки",
      icon: <SmartToy />,
      color: "#6366f1",
      action: () => navigate("/bots"),
      enabled: hasCompanies,
    },
    {
      title: "Промпты",
      description: "Промпты для обработки данных",
      icon: <Psychology />,
      color: "#6366f1",
      action: () => navigate("/prompts"),
      enabled: hasCompanies,
    },
    {
      title: "Расписания",
      description: "Автоматизация задач по времени",
      icon: <Schedule />,
      color: "#6366f1",
      action: () => navigate("/schedules"),
      enabled: hasCompanies && hasBots && hasPrompts,
    },
    {
      title: "Анализ",
      description: "Просмотр выполненных анализов",
      icon: <Analytics />,
      color: "#6366f1",
      action: () => navigate("/analysis"),
      enabled: hasCompanies && hasBots && hasPrompts,
    },
    {
      title: "Аккаунты",
      description: "Просмотр Telegram аккаунтов",
      icon: <People />,
      color: "#6366f1",
      action: () => navigate("/accounts"),
      enabled: hasCompanies && hasBots,
    },
    {
      title: "Чаты",
      description: "Просмотр Telegram чатов",
      icon: <ChatIcon />,
      color: "#6366f1",
      action: () => navigate("/chats"),
      enabled: hasCompanies && hasBots,
    },
    {
      title: "Справка",
      description: "Справочная информация",
      icon: <Info />,
      color: "#6366f1",
      action: () => navigate("/help"),
      enabled: true,
    },
  ];

  const handleTourComplete = () => {
    setTourCompleted(true);
    localStorage.setItem("tourCompleted", "true");
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1600, mx: "auto", mt: -3 }}>
      {/* Приветствие */}
      <Paper
        sx={{
          p: 4,
          mb: 2,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          borderRadius: 2,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Box>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{ fontWeight: 700, color: "white" }}
            >
              Добро пожаловать в систему управления Observer
            </Typography>
            <Typography
              variant="body1"
              sx={{ opacity: 0.9, mb: 2, color: "white" }}
            >
              Система анализа Telegram-чатов
            </Typography>
          </Box>

          {isNewUser && (
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setShowTour(true)}
              sx={{
                backgroundColor: "white",
                color: "#764ba2",
                "&:hover": {
                  backgroundColor: "#f0f0f0",
                  backgroundImage: "none",
                },
                "& .MuiSvgIcon-root": {
                  color: "#764ba2",
                },
                backgroundImage: "none",
                boxShadow: "none",
                transition: "background-color 0.2s ease",
              }}
            >
              Начать ознакомительный тур
            </Button>
          )}
        </Box>
      </Paper>

      {/* Прогресс настройки (только для новых пользователей) */}
      {isNewUser && (
        <Box sx={{ mb: 2 }}>
          <SetupProgress steps={setupSteps} />
        </Box>
      )}

      {/* Основные функции */}

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          mb: 2,
          "& > *": {
            flex: "1 1 280px",
            maxWidth: "100%",
          },
        }}
      >
        {mainFeatures.map((feature, index) => (
          <Card
            key={index}
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              opacity: feature.enabled ? 1 : 0.6,
              transition: "all 0.3s ease",
              "&:hover": feature.enabled
                ? {
                    transform: "translateY(-4px)",
                    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
                  }
                : {},
            }}
            onClick={feature.enabled ? feature.action : undefined}
          >
            <CardContent sx={{ p: 3, flexGrow: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    color: feature.enabled ? feature.color : "#94a3b8",
                    mr: 2,
                    fontSize: "2rem",
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {feature.title}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {feature.description}
              </Typography>
              {feature.enabled && (
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    size="small"
                    endIcon={<ArrowForward />}
                    sx={{
                      color: feature.color,
                      "&:hover": {
                        backgroundColor: "rgba(99, 102, 241, 0.08)",
                      },
                    }}
                  >
                    Перейти
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Быстрые советы */}
      <Card sx={{ mb: 2, borderRadius: 2 }}>
        <CardContent>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              display: "flex",
              alignItems: "center",
              fontWeight: 600,
            }}
          >
            <TipsAndUpdates color="primary" sx={{ mr: 1 }} />
            Советы по началу работы
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <List dense>
            <ListItem sx={{ px: 0 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <PlayArrow color="primary" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="Создайте компанию для начала работы"
                primaryTypographyProps={{ variant: "body2" }}
              />
            </ListItem>
            <ListItem sx={{ px: 0 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <PlayArrow color="primary" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="Добавьте Telegram-бота для подключения к системе"
                primaryTypographyProps={{ variant: "body2" }}
              />
            </ListItem>
            <ListItem sx={{ px: 0 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <PlayArrow color="primary" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="Создайте промпты для анализа сообщений"
                primaryTypographyProps={{ variant: "body2" }}
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* Кнопка помощи */}
      <Zoom in={!showTour}>
        <Fab
          color="primary"
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
            "&:hover": {
              background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
            },
          }}
          onClick={() => navigate("/help")}
        >
          <Help />
        </Fab>
      </Zoom>

      {/* Guided Tour */}
      <GuidedTour
        open={showTour}
        onClose={() => setShowTour(false)}
        onComplete={handleTourComplete}
      />
    </Box>
  );
};
