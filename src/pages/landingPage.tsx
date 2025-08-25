"use client";

import type React from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Paper,
  Chip,
  IconButton,
  useMediaQuery,
  Theme,
  Tooltip,
} from "@mui/material";
import {
  Analytics,
  Security,
  Settings,
  SmartToy,
  Psychology,
  Schedule,
  Business,
  PlayArrow,
  ArrowForward,
  DarkMode,
  LightMode,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useThemeMode } from "../context/themeContext";

const HeroSection = styled(Box)(({ theme }) => ({
  background:
    theme.palette.mode === "dark"
      ? "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"
      : "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
  color: "white",
  padding: theme.spacing(8, 0),
  textAlign: "center",
  position: "relative",
  overflow: "hidden",
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: "100%",
  borderRadius: "12px",
  background:
    theme.palette.mode === "dark"
      ? "rgba(30, 41, 59, 0.7)"
      : "rgba(255, 255, 255, 0.9)",
  backdropFilter: "blur(10px)",
  border:
    theme.palette.mode === "dark" ? "1px solid #334155" : "1px solid #e2e8f0",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 8px 30px rgba(99, 102, 241, 0.2)"
        : "0 8px 30px rgba(99, 102, 241, 0.15)",
  },
}));

const StepBox = styled(Box)(({ theme }) => ({
  textAlign: "center",
  padding: theme.spacing(3),
  "& .step-number": {
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
  },
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
      icon: <SmartToy sx={{ fontSize: 48, color: "#6366f1" }} />,
    },
    {
      title: "Умные отчёты",
      description:
        "Получайте детальную аналитику по заранее заданным сценариям и промптам для вашего бизнеса.",
      icon: <Analytics sx={{ fontSize: 48, color: "#6366f1" }} />,
    },
    {
      title: "Безопасность данных",
      description:
        "Используем только официальные API Telegram. Содержимое сообщений не сохраняется на наших серверах.",
      icon: <Security sx={{ fontSize: 48, color: "#6366f1" }} />,
    },
    {
      title: "Гибкие настройки",
      description:
        "Создавайте собственные промпты и сценарии анализа под специфические задачи вашей компании.",
      icon: <Settings sx={{ fontSize: 48, color: "#6366f1" }} />,
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
    "Мониторинг настроений в корпоративных чатов",
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
          py: 2,
          px: 3,
          background: theme.isDarkMode
            ? "rgba(30, 41, 59, 0.95)"
            : "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          borderBottom: theme.isDarkMode
            ? "1px solid #334155"
            : "1px solid #e2e8f0",
          borderRadius: 0,
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  color: theme.isDarkMode ? "#6366f1" : "#6366f1",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                {/* <Analytics /> Observer */}
              </Typography>

              {/* Кнопка переключения темы */}
              <Tooltip
                title={theme.isDarkMode ? "Светлая тема" : "Темная тема"}
              >
                <IconButton
                  onClick={theme.toggleTheme}
                  sx={{
                    bgcolor: theme.isDarkMode
                      ? "rgba(255, 255, 255, 0.1)"
                      : "rgba(99, 102, 241, 0.1)",
                    color: theme.isDarkMode ? "#ffffff" : "#6366f1",
                    "&:hover": {
                      bgcolor: theme.isDarkMode
                        ? "rgba(255, 255, 255, 0.2)"
                        : "rgba(99, 102, 241, 0.2)",
                    },
                    borderRadius: 1,
                  }}
                >
                  {theme.isDarkMode ? <LightMode /> : <DarkMode />}
                </IconButton>
              </Tooltip>
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => navigate("/login")}
                sx={{
                  borderRadius: "10px",
                  borderColor: theme.isDarkMode ? "#334155" : "#e2e8f0",
                  color: theme.isDarkMode ? "#cbd5e1" : "#475569",
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
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                  },
                }}
              >
                Регистрация
              </Button>
            </Box>
          </Box>
        </Container>
      </Paper>

      {/* Остальной код landingPage остается без изменений */}
      <HeroSection>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            sx={{
              fontWeight: "bold",
              mb: 3,
              fontSize: { xs: "2.5rem", md: "3rem" },
              color: "white",
            }}
          >
            Автоматизация анализа Telegram-чатов
          </Typography>
          <Typography
            variant="h5"
            sx={{
              mb: 4,
              opacity: 0.9,
              maxWidth: "600px",
              mx: "auto",
              fontSize: { xs: "1.1rem", md: "1.25rem" },
              color: "white",
            }}
          >
            Получайте краткие и полезные отчёты по заранее заданным сценариям.
            Превратите хаос сообщений в структурированную аналитику.
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
                borderRadius: "12px",
                px: 4,
                py: 1.5,
                fontSize: "18px",
                background: "white",
                color: "#6366f1",
                "&:hover": {
                  background: "#f8fafc",
                  transform: "translateY(-2px)",
                },
              }}
            >
              Начать бесплатно
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate("/help")}
              sx={{
                borderRadius: "12px",
                px: 4,
                py: 1.5,
                fontSize: "18px",
                borderColor: "white",
                color: "white",
                "&:hover": {
                  borderColor: "#f8fafc",
                  background: "rgba(255, 255, 255, 0.1)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              Узнать больше
            </Button>
          </Box>
        </Container>
      </HeroSection>

      {/* Features Section */}
      <Box sx={{ py: 8, background: theme.isDarkMode ? "#0f172a" : "#f8fafc" }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            sx={{
              textAlign: "center",
              mb: 2,
              fontWeight: "bold",
              color: theme.isDarkMode ? "#f1f5f9" : "#1e293b",
            }}
          >
            Ключевые преимущества
          </Typography>
          <Typography
            variant="h6"
            sx={{
              textAlign: "center",
              mb: 6,
              color: theme.isDarkMode ? "#94a3b8" : "#64748b",
              maxWidth: "600px",
              mx: "auto",
            }}
          >
            Observer помогает превратить неструктурированные данные из чатов в
            ценные инсайты для вашего бизнеса
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 3,
            }}
          >
            {features.map((feature, index) => (
              <FeatureCard key={index}>
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
                    variant="h5"
                    sx={{
                      mb: 2,
                      fontWeight: "bold",
                      color: theme.isDarkMode ? "#f1f5f9" : "#1e293b",
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body1"
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
            ))}
          </Box>
        </Container>
      </Box>

      {/* How it works */}
      <Box sx={{ py: 8, background: theme.isDarkMode ? "#1e293b" : "#ffffff" }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            sx={{
              textAlign: "center",
              mb: 2,
              fontWeight: "bold",
              color: theme.isDarkMode ? "#f1f5f9" : "#1e293b",
            }}
          >
            Как это работает
          </Typography>
          <Typography
            variant="h6"
            sx={{
              textAlign: "center",
              mb: 6,
              color: theme.isDarkMode ? "#94a3b8" : "#64748b",
            }}
          >
            Простой процесс настройки за 3 шага
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr 1fr",
                md: "1fr 1fr 1fr ",
              },
              gap: 3,
            }}
          >
            {steps.map((step, index) => (
              <Card key={index} sx={{ p: 3, textAlign: "center" }}>
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
                  }}
                >
                  {step.number}
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 2,
                    fontWeight: "bold",
                    color: theme.isDarkMode ? "#f1f5f9" : "#1e293b",
                  }}
                >
                  {step.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: theme.isDarkMode ? "#94a3b8" : "#64748b" }}
                >
                  {step.description}
                </Typography>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Use Cases */}
      <Box sx={{ py: 8, background: theme.isDarkMode ? "#0f172a" : "#f8fafc" }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            sx={{
              textAlign: "center",
              mb: 2,
              fontWeight: "bold",
              color: theme.isDarkMode ? "#f1f5f9" : "#1e293b",
            }}
          >
            Примеры использования
          </Typography>
          <Typography
            variant="h6"
            sx={{
              textAlign: "center",
              mb: 6,
              color: theme.isDarkMode ? "#94a3b8" : "#64748b",
            }}
          >
            Observer подходит для различных сценариев анализа коммуникации
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            {useCases.map((useCase, index) => (
              <Paper
                key={index}
                sx={{ p: 3, display: "flex", alignItems: "center" }}
              >
                <PlayArrow color="primary" sx={{ mr: 2, flexShrink: 0 }} />
                <Typography
                  variant="body1"
                  sx={{ color: theme.isDarkMode ? "#cbd5e1" : "#475569" }}
                >
                  {useCase}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Security Section */}
      <Box sx={{ py: 8, background: theme.isDarkMode ? "#1e293b" : "#ffffff" }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            sx={{
              textAlign: "center",
              mb: 2,
              fontWeight: "bold",
              color: theme.isDarkMode ? "#f1f5f9" : "#1e293b",
            }}
          >
            Безопасность и доверие
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
              gap: 3,
              mt: 4,
            }}
          >
            {securityFeatures.map((feature, index) => (
              <Card key={index} sx={{ textAlign: "center", p: 3 }}>
                <Box sx={{ fontSize: "48px", mb: 2 }}>{feature.icon}</Box>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 2,
                    fontWeight: "bold",
                    color: theme.isDarkMode ? "#f1f5f9" : "#1e293b",
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: theme.isDarkMode ? "#94a3b8" : "#64748b" }}
                >
                  {feature.description}
                </Typography>
              </Card>
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
            : "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
          color: "white",
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="h3"
              sx={{ mb: 3, fontWeight: "bold", color: "white" }}
            >
              Готовы начать?
            </Typography>
            <Typography
              variant="h6"
              sx={{ mb: 4, opacity: 0.9, color: "white" }}
            >
              Присоединяйтесь к Observer и получите неограниченный доступ ко
              всем функциям
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/login")}
              sx={{
                borderRadius: "12px",
                px: 6,
                py: 2,
                fontSize: "18px",
                background: "white",
                color: "#6366f1",
                "&:hover": {
                  background: "#f8fafc",
                  transform: "translateY(-2px)",
                },
              }}
            >
              Зарегистрироваться бесплатно
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          py: 6,
          backgroundColor: theme.isDarkMode ? "#1e293b" : "#ffffff",
          borderTop: "1px solid",
          borderColor: theme.isDarkMode ? "#334155" : "#e2e8f0",
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
              gap: 4,
            }}
          >
            <Box>
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  fontWeight: "bold",
                  color: theme.isDarkMode ? "#f1f5f9" : "#1e293b",
                }}
              >
                <Analytics sx={{ mr: 1, verticalAlign: "middle" }} />
                Observer
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: theme.isDarkMode ? "#94a3b8" : "#64748b", mb: 2 }}
              >
                Автоматизация анализа Telegram-чатов для современного бизнеса
              </Typography>
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  fontWeight: "bold",
                  color: theme.isDarkMode ? "#f1f5f9" : "#1e293b",
                }}
              >
                Продукт
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Button
                  variant="text"
                  onClick={() => navigate("/subscriptions")}
                  sx={{
                    justifyContent: "flex-start",
                    color: theme.isDarkMode ? "#94a3b8" : "#64748b",
                  }}
                >
                  Тарифы
                </Button>
                <Button
                  variant="text"
                  onClick={() => navigate("/help")}
                  sx={{
                    justifyContent: "flex-start",
                    color: theme.isDarkMode ? "#94a3b8" : "#64748b",
                  }}
                >
                  Справка
                </Button>
              </Box>
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  fontWeight: "bold",
                  color: theme.isDarkMode ? "#f1f5f9" : "#1e293b",
                }}
              >
                Правовая информация
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Button
                  variant="text"
                  onClick={() => navigate("/privacy")}
                  sx={{
                    justifyContent: "flex-start",
                    color: theme.isDarkMode ? "#94a3b8" : "#64748b",
                  }}
                >
                  Политика конфиденциальности
                </Button>
                <Button
                  variant="text"
                  onClick={() => navigate("/terms")}
                  sx={{
                    justifyContent: "flex-start",
                    color: theme.isDarkMode ? "#94a3b8" : "#64748b",
                  }}
                >
                  Пользовательское соглашение
                </Button>
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              mt: 6,
              pt: 4,
              borderTop: "1px solid",
              borderColor: theme.isDarkMode ? "#334155" : "#e2e8f0",
              textAlign: "center",
            }}
          >
            <Typography
              variant="body2"
              sx={{ color: theme.isDarkMode ? "#94a3b8" : "#64748b" }}
            >
              © 2024 Observer. Все права защищены.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};
