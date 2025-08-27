"use client";

import type React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAnalysDetailsQuery } from "../../hooks/analysis/useAnalysisQuery";
import { useCompaniesQuery } from "../../hooks/companies/useCompaniesQuery";
import { useChatsSelectQuery } from "../../hooks/chats/useChatsQuery";
import { usePromptsQuery } from "../../hooks/prompts/usePromptsQuery";
import {
  Box,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  Divider,
  Chip,
  Avatar,
  useMediaQuery,
  Theme,
  IconButton,
  Stack,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import ChatIcon from "@mui/icons-material/Chat";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import BusinessIcon from "@mui/icons-material/Business";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import TokenIcon from "@mui/icons-material/Token";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import DateRangeIcon from "@mui/icons-material/DateRange";
import { useCompanyMap } from "../../hooks/maps/useCompanyMap";
import { useChatMap } from "../../hooks/maps/useChatMap";
import { usePromptMap } from "../../hooks/maps/usePromptMap";
import { DetailsPageSkeleton } from "../../components/skeleton/detailsPageSkeleton";
import { useThemeMode } from "../../context/themeContext";

export const AnalysisDetailsPage: React.FC<{ developerMode: boolean }> = ({
  developerMode,
}) => {
  const theme = useThemeMode();
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );
  const { analysisId } = useParams<{ analysisId: string }>();
  const navigate = useNavigate();
  const {
    data: analysis,
    isLoading: analysisLoading,
    error: analysisError,
  } = useAnalysDetailsQuery(analysisId || "");

  const { isLoading: companiesLoading, error: companiesError } =
    useCompaniesQuery();
  const { isLoading: chatsLoading, error: chatsError } = useChatsSelectQuery();
  const { isLoading: promptsLoading, error: promptsError } = usePromptsQuery();
  const { isLoadingCompanyMap } = useCompanyMap();

  const isLoading =
    analysisLoading ||
    companiesLoading ||
    chatsLoading ||
    promptsLoading ||
    isLoadingCompanyMap;
  const error = analysisError || companiesError || chatsError || promptsError;

  const { chatMap } = useChatMap();
  const { promptMap } = usePromptMap();
  const { companyMap } = useCompanyMap();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateRange = (dateFrom: string, dateTo: string) => {
    const from = new Date(dateFrom).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "short",
    });
    const to = new Date(dateTo).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    return `${from} - ${to}`;
  };

  const CompactDetailItem = ({
    icon,
    label,
    value,
  }: {
    icon: React.ReactNode;
    label: string;
    value: string | React.ReactNode;
  }) => (
    <Box sx={{ mb: 1.5, display: "flex", alignItems: "flex-start" }}>
      <Box sx={{ mr: 1, mt: 0.5 }}>{icon}</Box>
      <Box>
        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{ fontWeight: 600, fontSize: "0.875rem" }}
        >
          {label}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "inherit",
            fontFamily:
              typeof value === "string" && value.match(/^\d+$/)
                ? "monospace"
                : "inherit",
          }}
        >
          {value}
        </Typography>
      </Box>
    </Box>
  );

  if (isLoading) {
    return <DetailsPageSkeleton developerMode={developerMode} />;
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" mt={-1}>
        <Typography color="error">
          Ошибка при загрузке данных: {(error as Error).message}
        </Typography>
      </Box>
    );
  }

  if (!analysis) {
    return (
      <Box display="flex" justifyContent="center" mt={-1}>
        <Typography>Анализ не найден</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        pl: isMobile ? 1 : 2,
        pr: isMobile ? 1 : 2,
        mt: 1.75,
        mb: -2,
        maxWidth: 1600,
        mx: "auto",
        position: "relative",
      }}
    >
      {/* Заголовок с основной информацией */}
      <Paper
        sx={{
          p: isMobile ? 2 : 3,
          mb: 1,
          background: theme.isDarkMode
            ? "linear-gradient(135deg, #6366f1aa 0%, #8b5cf6aa 100%)"
            : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          position: "relative",
        }}
      >
        {/* Кнопка назад для мобильной версии */}
        {isMobile && (
          <IconButton
            onClick={() => navigate(-1)}
            size="small"
            sx={{
              position: "absolute",
              top: 8,
              left: 8,
              zIndex: 1,
              color: "white",
              // backgroundColor: "rgba(255,255,255,0.2)",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.1)",
              },
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        )}
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "center" : "center",
            justifyContent: "space-between",
            color: "white",
            gap: isMobile ? 2 : 0,
            pt: isMobile ? 4 : 0,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: isMobile ? "column" : "row",
              textAlign: isMobile ? "center" : "left",
              gap: isMobile ? 2 : 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {!isMobile && (
                <Avatar
                  sx={{
                    width: isMobile ? 60 : 80,
                    height: isMobile ? 60 : 80,
                    bgcolor: "rgba(255,255,255,0.2)",
                    color: "white",
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    mr: isMobile ? 0 : 3,
                  }}
                >
                  АН
                </Avatar>
              )}
              <Box>
                <Typography
                  variant={isMobile ? "h5" : "h4"}
                  gutterBottom
                  sx={{ fontWeight: "bold", color: "white" }}
                >
                  Результат анализа чата
                </Typography>
                <Typography
                  variant={isMobile ? "body1" : "h6"}
                  sx={{ opacity: 0.9, mb: 1, color: "white" }}
                >
                  {chatMap.get(analysis.chat_id) || `Чат ${analysis.chat_id}`}
                </Typography>
                {!isMobile && (
                  <Chip
                    icon={<CalendarTodayIcon color="inherit" />}
                    label={formatDate(analysis.created_at)}
                    sx={{
                      bgcolor: "rgba(255,255,255,0.2)",
                      color: "white",
                      fontWeight: "bold",
                      "& .MuiSvgIcon-root": {
                        color: "white",
                      },
                    }}
                  />
                )}
              </Box>
            </Box>
          </Box>

          {!isMobile && (
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
              variant="contained"
              sx={{
                fontWeight: 600,
                border: "1px solid rgba(255, 255, 255, 0.25)",
                backgroundColor: "#ffffffee",
                color: "#764ba2",
                "&:hover": {
                  backgroundColor: "#ffffffec",
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
              Назад
            </Button>
          )}
        </Box>
      </Paper>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Результат анализа */}
        <Card sx={{ mb: -1 }}>
          <CardContent>
            <Typography
              variant={isMobile ? "subtitle1" : "h6"}
              gutterBottom
              sx={{ display: "flex", alignItems: "center" }}
            >
              <TextSnippetIcon
                sx={{
                  mr: 1,
                  color: "primary.main",
                  fontSize: isMobile ? "1rem" : "1.25rem",
                }}
              />
              Результат анализа
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography
              sx={{
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                fontSize: isMobile ? "0.875rem" : "1rem",
              }}
            >
              {analysis.result_text || "Результат анализа отсутствует"}
            </Typography>
          </CardContent>
        </Card>

        {/* Параметры анализа */}
        <Card>
          <CardContent sx={{ p: 2 }}>
            <Typography
              variant={isMobile ? "subtitle1" : "h6"}
              gutterBottom
              sx={{ display: "flex", alignItems: "center" }}
            >
              <AnalyticsIcon
                sx={{
                  mr: 1,
                  color: "primary.main",
                  fontSize: isMobile ? "1rem" : "1.25rem",
                }}
              />
              Параметры анализа
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: 3,
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <CompactDetailItem
                  icon={
                    <CalendarTodayIcon
                      color="primary"
                      fontSize={isMobile ? "small" : "medium"}
                    />
                  }
                  label="Дата выполнения"
                  value={formatDate(analysis.created_at)}
                />
                <CompactDetailItem
                  icon={
                    <DateRangeIcon
                      color="primary"
                      fontSize={isMobile ? "small" : "medium"}
                    />
                  }
                  label="Период анализа"
                  value={formatDateRange(analysis.date_from, analysis.date_to)}
                />
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <CompactDetailItem
                  icon={
                    <ChatIcon
                      color="primary"
                      fontSize={isMobile ? "small" : "medium"}
                    />
                  }
                  label="Анализируемый чат"
                  value={chatMap.get(analysis.chat_id) || analysis.chat_id}
                />
                <CompactDetailItem
                  icon={
                    <SmartToyIcon
                      color="primary"
                      fontSize={isMobile ? "small" : "medium"}
                    />
                  }
                  label="Промпт анализа"
                  value={
                    promptMap.get(analysis.prompt_id) || analysis.prompt_id
                  }
                />
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Дополнительная информация (только в режиме разработчика) */}
        {developerMode && (
          <Card>
            <CardContent sx={{ p: 2 }}>
              <Typography
                variant={isMobile ? "subtitle1" : "h6"}
                gutterBottom
                sx={{ display: "flex", alignItems: "center" }}
              >
                <FingerprintIcon
                  sx={{
                    mr: 1,
                    color: "primary.main",
                    fontSize: isMobile ? "1rem" : "1.25rem",
                  }}
                />
                Техническая информация
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                  gap: 2,
                }}
              >
                <CompactDetailItem
                  icon={
                    <FingerprintIcon
                      color="primary"
                      fontSize={isMobile ? "small" : "medium"}
                    />
                  }
                  label="ID анализа"
                  value={analysis.analysis_id}
                />
                <CompactDetailItem
                  icon={
                    <BusinessIcon
                      color="primary"
                      fontSize={isMobile ? "small" : "medium"}
                    />
                  }
                  label="Компания"
                  value={
                    companyMap.get(analysis.company_id) || analysis.company_id
                  }
                />
                {analysis.schedule_id && (
                  <CompactDetailItem
                    icon={
                      <FingerprintIcon
                        color="primary"
                        fontSize={isMobile ? "small" : "medium"}
                      />
                    }
                    label="ID расписания"
                    value={analysis.schedule_id}
                  />
                )}
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
};
