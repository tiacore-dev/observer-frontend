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
  useMediaQuery,
  Theme,
  Container,
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
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { useBotsQuery } from "../../hooks/bots/useBotsQuery";
import { usePromptsQuery } from "../../hooks/prompts/usePromptsQuery";
import { useSchedulesQuery } from "../../hooks/schedules/useSchedulesQuery";
import { useCompaniesQuery } from "../../hooks/companies/useCompaniesQuery";
import { GuidedTour } from "../../components/guidedTour";
import { SetupProgress } from "../../components/setupProgress";
import ChatIcon from "@mui/icons-material/Chat";
import { useThemeMode } from "../../context/themeContext";

export const HomePage: React.FC = () => {
  const theme = useThemeMode();
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );
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
      title: "Анализ",
      description: "Просмотр выполненных анализов",
      icon: <Analytics />,
      color: "#6366f1",
      action: () => navigate("/analysis"),
      enabled: hasCompanies && hasBots && hasPrompts,
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
      title: "Промпты",
      description: "Промпты для обработки данных",
      icon: <Psychology />,
      color: "#6366f1",
      action: () => navigate("/prompts"),
      enabled: hasCompanies,
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
    <>
      <Box
        sx={{
          p: { xs: 1, sm: 3 },
          maxWidth: 1600,
          mx: "auto",
          mt: { xs: -2, sm: -3 },
        }}
      >
        {/* Приветствие */}
        <Paper
          sx={{
            p: { xs: 2, sm: 3 },
            mb: { xs: 1, sm: 2 },
            background: theme.isDarkMode
              ? "linear-gradient(135deg, #6366f1aa 0%, #8b5cf6aa 100%)"
              : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            borderRadius: 1,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "flex-start" },
              width: "100%",
              position: "relative",
              minHeight: { xs: "auto", sm: "100px" },
              gap: { xs: 2, sm: 0 },
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h6"
                component="h6"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  color: "white",
                  fontSize: { xs: "1.35rem", sm: "1.7rem", md: "1.9rem" },
                  lineHeight: { xs: 1.2, sm: 1.3 },
                }}
              >
                Добро пожаловать в систему управления Observer
              </Typography>
              <Typography
                sx={{
                  mb: 0,
                  color: "white",
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                }}
              >
                Сервис анализа Telegram-чатов
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
                  alignSelf: { xs: "stretch", sm: "flex-start" },
                  minWidth: { xs: "100%", sm: "auto" },
                  mt: { xs: 1, sm: 0 },
                  order: { xs: 2, sm: 1 },
                }}
              >
                Начать ознакомительный тур
              </Button>
            )}

            {!isMobile && (
              <Typography
                variant="body1"
                sx={{
                  position: { xs: "static", sm: "absolute" },
                  right: { sm: -1 },
                  bottom: { sm: -4 },
                  opacity: 0.9,
                  color: "white",
                  textAlign: "right",
                  fontStyle: "italic",
                  maxWidth: { xs: "100%", sm: "500px" },
                  mt: { xs: 2, sm: 0 },
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                  order: { xs: 3, sm: 2 },
                }}
              >
                Контролируйте обсуждения, не погружаясь в рутину.{" "}
              </Typography>
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
            gap: { xs: 1, sm: 2 },
            mb: { xs: 1, sm: 2 },
            "& > *": {
              flex: "1 1 calc(100% - 24px)",
              minWidth: 0,
              height: "200px",

              "@media (min-width: 600px)": {
                flex: "1 1 calc(50% - 24px)",
              },
              "@media (min-width: 1200px)": {
                flex: "1 1 calc(25% - 24px)",
              },
            },
          }}
        >
          {mainFeatures.map((feature, index) => (
            <Card
              key={index}
              sx={{
                height: "100%",
                minHeight: "120px",
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
              <Box
                sx={{
                  p: 3,
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                  position: "relative", // Добавляем относительное позиционирование
                }}
              >
                {/* Кнопка в правом верхнем углу */}
                {feature.enabled && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation(); // Предотвращаем срабатывание onClick карточки
                        feature.action();
                      }}
                      sx={{
                        color: feature.color,
                        "&:hover": {
                          backgroundColor: "rgba(99, 102, 241, 0.08)",
                        },
                      }}
                    >
                      <ArrowForward />
                    </IconButton>
                  </Box>
                )}

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 0,
                    mt: -2,
                    pr: feature.enabled ? 4 : 0, // Добавляем отступ справа для иконки
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
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ ml: 0, mt: 0 }}
                >
                  {feature.description}
                </Typography>
              </Box>
            </Card>
          ))}
        </Box>

        {/* Быстрые советы */}

        {/* Guided Tour */}
        <GuidedTour
          open={showTour}
          onClose={() => setShowTour(false)}
          onComplete={handleTourComplete}
        />
        {!isNewUser && (
          <Card sx={{ mb: 0, borderRadius: 1 }}>
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
        )}
      </Box>

      {!isMobile && (
        <Box
          sx={{
            py: 3,
            mb: -3,
            backgroundColor: theme.isDarkMode ? "#1e293b" : "#ffffff",
            borderTop: "1px solid",
            borderColor: theme.isDarkMode
              ? "rgba(51, 65, 85, 0.3)"
              : "rgba(226, 232, 240, 0.8)",
          }}
        >
          <Container maxWidth="lg">
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "1.5fr 1fr 1fr 1fr 1.5fr",
                },
                gap: 4,
                alignItems: "start",
                justifyContent: "space-between",
              }}
            >
              {/* Общий столбец */}
              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{
                    // mb: 1.5,
                    fontWeight: "bold",
                    color: theme.isDarkMode ? "#f1f5f9" : "#1e293b",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Analytics sx={{ mr: 1, fontSize: 22 }} />
                  Observer
                </Typography>

                <Typography
                  variant="caption"
                  sx={{
                    color: theme.isDarkMode ? "#94a3b8" : "#64748b",
                  }}
                >
                  © 2025 Observer. Все права защищены.
                </Typography>
              </Box>

              {/* Объединенный столбец "Продукт" + "Тарифы/Справка" */}
              <Box
                sx={{
                  gridColumn: { md: "span 2" },
                  display: "flex",
                  gap: 3,
                  justifyContent: "center",
                }}
              >
                {/* Столбец "Продукт" */}
                <Box sx={{ minWidth: "80px" }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      mb: 1.5,
                      fontWeight: "bold",
                      color: theme.isDarkMode ? "#f1f5f9" : "#1e293b",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Продукт
                  </Typography>
                </Box>

                {/* Столбец "Тарифы/Справка" */}
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 0.5,
                      mt: 0.5,
                    }}
                  >
                    <Link
                      to="/subscriptions"
                      style={{
                        textDecoration: "none",
                        color: theme.isDarkMode ? "#94a3b8" : "#64748b",
                        fontSize: "0.875rem",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = theme.isDarkMode
                          ? "#6366f1"
                          : "#6366f1";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = theme.isDarkMode
                          ? "#94a3b8"
                          : "#64748b";
                      }}
                    >
                      Тарифы
                    </Link>
                    <Link
                      to="/help"
                      style={{
                        textDecoration: "none",
                        color: theme.isDarkMode ? "#94a3b8" : "#64748b",
                        fontSize: "0.875rem",
                        cursor: "pointer",
                        marginTop: "4px",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = theme.isDarkMode
                          ? "#6366f1"
                          : "#6366f1";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = theme.isDarkMode
                          ? "#94a3b8"
                          : "#64748b";
                      }}
                    >
                      Справка
                    </Link>
                  </Box>
                </Box>
              </Box>

              {/* Объединенный столбец "Правовая информация" + "Политика/Соглашение" */}
              <Box
                sx={{
                  gridColumn: { md: "span 2" },
                  display: "flex",
                  gap: 3,
                  justifyContent: "flex-end",
                }}
              >
                {/* Столбец "Правовая информация" */}
                <Box sx={{ minWidth: "140px" }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      mb: 1.5,
                      fontWeight: "bold",
                      color: theme.isDarkMode ? "#f1f5f9" : "#1e293b",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Правовая информация
                  </Typography>
                </Box>

                {/* Столбец "Политика/Соглашение" */}
                <Box sx={{ minWidth: "200px" }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 0.5,
                      mt: 0.5,
                    }}
                  >
                    <Link
                      to="/privacy"
                      style={{
                        textDecoration: "none",
                        color: theme.isDarkMode ? "#94a3b8" : "#64748b",
                        fontSize: "0.875rem",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = theme.isDarkMode
                          ? "#6366f1"
                          : "#6366f1";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = theme.isDarkMode
                          ? "#94a3b8"
                          : "#64748b";
                      }}
                    >
                      Политика конфиденциальности
                    </Link>
                    <Link
                      to="/terms"
                      style={{
                        textDecoration: "none",
                        color: theme.isDarkMode ? "#94a3b8" : "#64748b",
                        fontSize: "0.875rem",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                        marginTop: "4px",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = theme.isDarkMode
                          ? "#6366f1"
                          : "#6366f1";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = theme.isDarkMode
                          ? "#94a3b8"
                          : "#64748b";
                      }}
                    >
                      Пользовательское соглашение
                    </Link>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Container>
        </Box>
      )}
      {isMobile && (
        // Footer - замените текущий футер на этот код
        // Footer - замените текущий футер на этот код
        <Box
          sx={{
            py: 3,
            mb: -3,
            backgroundColor: theme.isDarkMode ? "#1e293b" : "#ffffff",
            borderTop: "1px solid",
            borderColor: theme.isDarkMode
              ? "rgba(51, 65, 85, 0.3)"
              : "rgba(226, 232, 240, 0.8)",
          }}
        >
          <Container maxWidth="lg">
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 2,
                alignItems: { xs: "center", md: "start" },
                textAlign: { xs: "center", md: "left" },
              }}
            >
              {/* Продукт и Справка */}
              <Box
                sx={{
                  display: "flex",
                  gap: 8,
                }}
              >
                <Box
                  sx={{
                    display: "grid",
                    textAlign: "left",
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: "bold",
                      color: theme.isDarkMode ? "#f1f5f9" : "#1e293b",
                    }}
                  >
                    Продукт
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 0.5,
                    }}
                  >
                    <Link
                      to="/subscriptions"
                      style={{
                        textDecoration: "none",
                        color: theme.isDarkMode ? "#94a3b8" : "#64748b",
                        fontSize: "0.875rem",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = theme.isDarkMode
                          ? "#6366f1"
                          : "#6366f1";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = theme.isDarkMode
                          ? "#94a3b8"
                          : "#64748b";
                      }}
                    >
                      Тарифы
                    </Link>
                    <Link
                      to="/help"
                      style={{
                        textDecoration: "none",
                        color: theme.isDarkMode ? "#94a3b8" : "#64748b",
                        fontSize: "0.875rem",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = theme.isDarkMode
                          ? "#6366f1"
                          : "#6366f1";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = theme.isDarkMode
                          ? "#94a3b8"
                          : "#64748b";
                      }}
                    >
                      Справка
                    </Link>
                  </Box>
                </Box>

                {/* Правовая информация */}
                <Box
                  sx={{
                    display: "grid",
                    textAlign: "right",
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: "bold",
                      color: theme.isDarkMode ? "#f1f5f9" : "#1e293b",
                    }}
                  >
                    Правовая информация
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 0.5,
                    }}
                  >
                    <Link
                      to="/privacy"
                      style={{
                        textDecoration: "none",
                        color: theme.isDarkMode ? "#94a3b8" : "#64748b",
                        fontSize: "0.875rem",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = theme.isDarkMode
                          ? "#6366f1"
                          : "#6366f1";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = theme.isDarkMode
                          ? "#94a3b8"
                          : "#64748b";
                      }}
                    >
                      Политика конфиденциальности
                    </Link>
                    <Link
                      to="/terms"
                      style={{
                        textDecoration: "none",
                        color: theme.isDarkMode ? "#94a3b8" : "#64748b",
                        fontSize: "0.875rem",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = theme.isDarkMode
                          ? "#6366f1"
                          : "#6366f1";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = theme.isDarkMode
                          ? "#94a3b8"
                          : "#64748b";
                      }}
                    >
                      Пользовательское соглашение
                    </Link>
                  </Box>
                </Box>
              </Box>
              {/* Логотип и копирайт */}
              <Box sx={{ flex: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: { xs: "center", md: "flex-start" },
                  }}
                >
                  <img
                    src="/favicon.ico"
                    alt="Observer Logo"
                    style={{
                      width: 22,
                      height: 22,
                      marginRight: "8px",
                      borderRadius: "4px",
                    }}
                  />
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: "bold",
                      color: theme.isDarkMode ? "#f1f5f9" : "#1e293b",
                    }}
                  >
                    Observer
                  </Typography>
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.isDarkMode ? "#94a3b8" : "#64748b",
                  }}
                >
                  © 2025 Observer. Все права защищены.
                </Typography>
              </Box>
            </Box>
          </Container>
        </Box>
      )}
    </>
  );
};
