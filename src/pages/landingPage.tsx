"use client";

import type React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Paper,
  IconButton,
  useMediaQuery,
  Theme,
  Tooltip,
  Fade,
  Grow,
} from "@mui/material";
import {
  Analytics,
  Security,
  Settings,
  SmartToy,
  Psychology,
  Schedule,
  PlayArrow,
  DarkMode,
  LightMode,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useThemeMode } from "../context/themeContext";

const HeroSection = styled(Box)(({ theme }) => ({
  background:
    theme.palette.mode === "dark"
      ? "linear-gradient(135deg, #6366f1aa 0%, #8b5cf6aa 100%)"
      : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  color: "white",
  padding: theme.spacing(8, 0, 6),
  textAlign: "center",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      "radial-gradient(circle at 20% 80%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)",
    pointerEvents: "none",
  },
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: "100%",
  borderRadius: "12px",
  background:
    theme.palette.mode === "dark"
      ? "rgba(30, 41, 59, 0.8)"
      : "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(12px)",
  border:
    theme.palette.mode === "dark"
      ? "1px solid rgba(51, 65, 85, 0.5)"
      : "1px solid rgba(226, 232, 240, 0.8)",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  boxShadow: theme.shadows[1],
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 8px 24px rgba(99, 102, 241, 0.2)"
        : "0 8px 24px rgba(99, 102, 241, 0.1)",
  },
}));

const GradientText = styled(Typography)(({ theme }) => ({
  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
}));

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useThemeMode();
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );

  const features = [
    {
      title: "Автоматический анализ чатов",
      description:
        "Настройте ботов для регулярного мониторинга ваших Telegram-чатов и получения структурированных отчётов.",
      icon: <SmartToy sx={{ fontSize: 40, color: "#6366f1" }} />,
    },
    {
      title: "Умные отчёты",
      description:
        "Получайте детальную аналитику по заранее заданным сценариям и промптам для вашего бизнеса.",
      icon: <Analytics sx={{ fontSize: 40, color: "#6366f1" }} />,
    },
    {
      title: "Безопасность данных",
      description:
        "Используем только официальные API Telegram. Содержимое сообщений не сохраняется на наших серверах.",
      icon: <Security sx={{ fontSize: 40, color: "#6366f1" }} />,
    },
    {
      title: "Гибкие настройки",
      description:
        "Создавайте собственные промпты и сценарии анализа под специфические задачи вашей компании.",
      icon: <Settings sx={{ fontSize: 40, color: "#6366f1" }} />,
    },
  ];

  const steps = [
    {
      number: 1,
      title: "Подключите бота",
      description: "Интегрируйте Telegram-бота с вашими чатами",
      icon: <SmartToy />,
    },
    {
      number: 2,
      title: "Создайте промпт",
      description: "Настройте сценарии анализа под ваши задачи",
      icon: <Psychology />,
    },
    {
      number: 3,
      title: "Получайте отчёты",
      description: "Настройте расписание и получайте регулярные отчёты",
      icon: <Schedule />,
    },
  ];

  const useCases = [
    "Мониторинг настроений в корпоративных чатах",
    "Анализ обратной связи от клиентов",
    "Отслеживание обсуждаемых тем и трендов",
    "Поиск вопросов и проблем для решения",
    "Контроль качества коммуникации",
    "Выявление инсайтов для принятия решений",
  ];

  const securityFeatures = [
    {
      title: "Официальные API",
      description:
        "Используем только официальные API Telegram для безопасного доступа к данным",
      icon: "🔐",
    },
    {
      title: "Шифрование данных",
      description:
        "Все данные обрабатываются в зашифрованном виде и защищены современными протоколами",
      icon: "🛡️",
    },
    {
      title: "Не храним сообщения",
      description:
        "Содержимое сообщений не сохраняется на наших серверах после обработки",
      icon: "🗑️",
    },
  ];

  return (
    <Box
      sx={{
        background: theme.isDarkMode ? "#0f172a" : "#f8fafc",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <Paper
        sx={{
          py: 0,
          px: 2,
          background: theme.isDarkMode
            ? "rgba(30, 41, 59, 0.95)"
            : "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          borderBottom: 1,
          borderColor: "divider",
          borderRadius: 0,
          // position: "sticky",
          top: 0,
          zIndex: 1000,
          height: "70px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              cursor: "pointer",
              textDecoration: "none",
              color: "inherit",
            }}
            onClick={() => navigate("/")}
          >
            <img
              src="/favicon.ico"
              alt="Observer Logo"
              style={{
                width: 35,
                height: 35,
                borderRadius: "4px",
              }}
            />
            {!isMobile && (
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  color: theme.isDarkMode ? "#6366f1" : "#6366f1",
                }}
              >
                Observer
              </Typography>
            )}
          </Box>
          <Tooltip title={theme.isDarkMode ? "Светлая тема" : "Темная тема"}>
            <IconButton
              onClick={theme.toggleTheme}
              sx={{
                bgcolor: theme.isDarkMode
                  ? "rgba(99, 102, 241, 0.1)"
                  : "rgba(99, 102, 241, 0.1)",
                "&:hover": {
                  bgcolor: theme.isDarkMode
                    ? "rgba(99, 102, 241, 0.2)"
                    : "rgba(99, 102, 241, 0.2)",
                },
                borderRadius: 4,
              }}
            >
              {theme.isDarkMode ? <LightMode /> : <DarkMode />}
            </IconButton>
          </Tooltip>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => navigate("/login")}
            sx={{
              borderRadius: "8px",
              borderColor: theme.isDarkMode
                ? "rgba(51, 65, 85, 0.5)"
                : "rgba(226, 232, 240, 0.8)",
              color: theme.isDarkMode ? "#cbd5e1" : "#475569",
              fontSize: "0.875rem",
              padding: "6px 16px",
              "&:hover": {
                borderColor: theme.isDarkMode ? "#818cf8" : "#6366f1",
                backgroundColor: theme.isDarkMode
                  ? "rgba(129, 140, 248, 0.08)"
                  : "rgba(99, 102, 241, 0.04)",
              },
            }}
          >
            Войти
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate("/login")}
            sx={{
              borderRadius: "8px",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              boxShadow: "0 2px 8px rgba(99, 102, 241, 0.2)",
              fontSize: "0.875rem",
              padding: "6px 20px",
              "&:hover": {
                background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
              },
            }}
          >
            Регистрация
          </Button>
        </Box>
      </Paper>
      <HeroSection>
        <Container maxWidth="lg">
          <Fade in timeout={1000}>
            <Box>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: "bold",
                  mb: 2,
                  fontSize: { xs: "2rem", md: "2.8rem" },
                  color: "white",
                  lineHeight: 1.2,
                }}
              >
                Автоматизация анализа
                <Box
                  component="br"
                  sx={{ display: { xs: "none", md: "block" } }}
                />
                Telegram-чатов
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  mb: 3,
                  opacity: 0.9,
                  maxWidth: "700px",
                  mx: "auto",
                  fontSize: { xs: "1rem", md: "1.1rem" },
                  color: "white",
                  lineHeight: 1.5,
                }}
              >
                Получайте краткие и полезные AI-отчёты по заранее заданным
                сценариям. Превратите хаос сообщений в структурированную
                аналитику.
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate("/login")}
                  sx={{
                    borderRadius: "10px",
                    px: 4,
                    py: 1.2,
                    fontSize: "16px",
                    background: "white",
                    color: "#6366f1",
                    fontWeight: "bold",
                    boxShadow: "0 4px 12px rgba(255, 255, 255, 0.2)",
                    "&:hover": {
                      background: "#f8fafc",
                      transform: "translateY(-1px)",
                      boxShadow: "0 6px 16px rgba(255, 255, 255, 0.3)",
                    },
                  }}
                >
                  Начать
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate("/help")}
                  sx={{
                    borderRadius: "10px",
                    px: 4,
                    py: 1.2,
                    fontSize: "16px",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    color: "white",
                    fontWeight: "bold",
                    background: "#ffffff19",

                    "&:hover": {
                      borderColor: "#ffffff",
                      background: "rgba(255, 255, 255, 0.1)",
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  Узнать больше
                </Button>
              </Box>
            </Box>
          </Fade>
        </Container>
      </HeroSection>
      {/* Features Section */}
      <Box sx={{ py: 6, background: theme.isDarkMode ? "#0f172a" : "#f8fafc" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <GradientText
              variant="h4"
              sx={{
                fontWeight: "bold",
                mb: 1,
                fontSize: { xs: "1.8rem", md: "2.2rem" },
              }}
            >
              Ключевые преимущества
            </GradientText>
            <Typography
              variant="body1"
              sx={{
                color: theme.isDarkMode ? "#94a3b8" : "#64748b",
                maxWidth: "500px",
                mx: "auto",
                lineHeight: 1.5,
              }}
            >
              Observer помогает превратить неструктурированные данные из чатов в
              ценные инсайты для вашего бизнеса
            </Typography>
          </Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 3,
            }}
          >
            {features.map((feature, index) => (
              <Grow in timeout={(index + 1) * 300} key={index}>
                <Box>
                  <FeatureCard>
                    <CardContent
                      sx={{
                        p: 3,
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                      }}
                    >
                      <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                      <Typography
                        variant="h6"
                        sx={{
                          mb: 1.5,
                          fontWeight: "bold",
                          color: theme.isDarkMode ? "#f1f5f9" : "#1e293b",
                        }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: theme.isDarkMode ? "#94a3b8" : "#64748b",
                          lineHeight: 1.6,
                          flexGrow: 1,
                        }}
                      >
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </FeatureCard>
                </Box>
              </Grow>
            ))}
          </Box>
        </Container>
      </Box>
      {/* How it works */}
      <Box sx={{ py: 6, background: theme.isDarkMode ? "#1e293b" : "#ffffff" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <GradientText
              variant="h4"
              sx={{
                fontWeight: "bold",
                mb: 1,
                fontSize: { xs: "1.8rem", md: "2.2rem" },
              }}
            >
              Как это работает
            </GradientText>
            <Typography
              variant="body1"
              sx={{
                color: theme.isDarkMode ? "#94a3b8" : "#64748b",
              }}
            >
              Простой процесс настройки за 3 шага
            </Typography>
          </Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr",
                md: "1fr 1fr 1fr",
              },
              gap: 3,
            }}
          >
            {steps.map((step, index) => (
              <Grow in timeout={(index + 1) * 400} key={index}>
                <Card
                  sx={{
                    p: 3,
                    textAlign: "center",
                    borderRadius: "12px",
                    border: theme.isDarkMode
                      ? "1px solid rgba(51, 65, 85, 0.5)"
                      : "1px solid rgba(226, 232, 240, 0.8)",
                    background: theme.isDarkMode
                      ? "rgba(30, 41, 59, 0.8)"
                      : "rgba(255, 255, 255, 0.95)",
                  }}
                >
                  <Box
                    sx={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "24px",
                      fontWeight: "bold",
                      margin: "0 auto 16px",
                      boxShadow: "0 3px 8px rgba(99, 102, 241, 0.3)",
                    }}
                  >
                    {step.number}
                  </Box>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      mb: 1,
                      fontWeight: "bold",
                      color: theme.isDarkMode ? "#f1f5f9" : "#1e293b",
                    }}
                  >
                    {step.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.isDarkMode ? "#94a3b8" : "#64748b",
                      lineHeight: 1.5,
                    }}
                  >
                    {step.description}
                  </Typography>
                </Card>
              </Grow>
            ))}
          </Box>
        </Container>
      </Box>
      {/* Use Cases */}
      <Box sx={{ py: 6, background: theme.isDarkMode ? "#0f172a" : "#f8fafc" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <GradientText
              variant="h4"
              sx={{
                fontWeight: "bold",
                mb: 1,
                fontSize: { xs: "1.8rem", md: "2.2rem" },
              }}
            >
              Примеры использования
            </GradientText>
            <Typography
              variant="body1"
              sx={{
                color: theme.isDarkMode ? "#94a3b8" : "#64748b",
              }}
            >
              Observer подходит для различных сценариев анализа коммуникации
            </Typography>
          </Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            {useCases.map((useCase, index) => (
              <Grow in timeout={(index + 1) * 200} key={index}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    borderRadius: "8px",
                    background: theme.isDarkMode
                      ? "rgba(30, 41, 59, 0.8)"
                      : "rgba(255, 255, 255, 0.95)",
                    border: theme.isDarkMode
                      ? "1px solid rgba(51, 65, 85, 0.3)"
                      : "1px solid rgba(226, 232, 240, 0.8)",
                    transition: "transform 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  <PlayArrow
                    sx={{
                      mr: 1.5,
                      flexShrink: 0,
                      color: "#6366f1",
                      fontSize: "20px",
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.isDarkMode ? "#cbd5e1" : "#475569",
                      fontWeight: 500,
                    }}
                  >
                    {useCase}
                  </Typography>
                </Paper>
              </Grow>
            ))}
          </Box>
        </Container>
      </Box>
      {/* Security Section */}
      <Box sx={{ py: 6, background: theme.isDarkMode ? "#1e293b" : "#ffffff" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <GradientText
              variant="h4"
              sx={{
                fontWeight: "bold",
                mb: 1,
                fontSize: { xs: "1.8rem", md: "2.2rem" },
              }}
            >
              Безопасность и доверие
            </GradientText>
          </Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
              gap: 3,
            }}
          >
            {securityFeatures.map((feature, index) => (
              <Grow in timeout={(index + 1) * 300} key={index}>
                <Card
                  sx={{
                    textAlign: "center",
                    p: 3,
                    borderRadius: "12px",
                    border: theme.isDarkMode
                      ? "1px solid rgba(51, 65, 85, 0.5)"
                      : "1px solid rgba(226, 232, 240, 0.8)",
                    background: theme.isDarkMode
                      ? "rgba(30, 41, 59, 0.8)"
                      : "rgba(255, 255, 255, 0.95)",
                  }}
                >
                  <Box
                    sx={{
                      fontSize: "40px",
                      mb: 2,
                      lineHeight: 1,
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      mb: 1,
                      fontWeight: "bold",
                      color: theme.isDarkMode ? "#f1f5f9" : "#1e293b",
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.isDarkMode ? "#94a3b8" : "#64748b",
                      lineHeight: 1.5,
                    }}
                  >
                    {feature.description}
                  </Typography>
                </Card>
              </Grow>
            ))}
          </Box>
        </Container>
      </Box>
      {/* CTA Section */}
      <Box
        sx={{
          py: 8,
          background: theme.isDarkMode
            ? "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"
            : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",

          color: "white",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)",
            pointerEvents: "none",
          },
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", position: "relative", zIndex: 1 }}>
            <Typography
              variant="h4"
              sx={{ mb: 2, fontWeight: "bold", color: "white" }}
            >
              Готовы начать?
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mb: 3,
                opacity: 0.9,
                color: "white",
                maxWidth: "500px",
                mx: "auto",
              }}
            >
              Присоединяйтесь к Observer и получите доступ к функциям
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/login")}
              sx={{
                borderRadius: "10px",
                px: 5,
                py: 1.5,
                fontSize: "16px",
                background: "white",
                color: "#6366f1",
                fontWeight: "bold",
                boxShadow: "0 4px 12px rgba(255, 255, 255, 0.3)",
                "&:hover": {
                  background: "#f8fafc",
                  transform: "translateY(-1px)",
                  boxShadow: "0 6px 16px rgba(255, 255, 255, 0.4)",
                },
              }}
            >
              Зарегистрироваться
            </Button>
          </Box>
        </Container>
      </Box>
      {/* Footer */}
      {!isMobile && (
        <Box
          sx={{
            py: 3,
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

              {/* Объединенный столбец "Продукт" + "Тарифы/Помощь" */}
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

                {/* Столбец "Тарифы/Помощь" */}
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
                      Помощь
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
              {/* Продукт и Помощь */}
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
                      Помощь
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
    </Box>
  );
};
