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

export const AnalysisDetailsPage: React.FC<{ developerMode: boolean }> = ({
  developerMode,
}) => {
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
      <Box display="flex" justifyContent="center" mt={4}>
        <Typography color="error">
          Ошибка при загрузке данных: {(error as Error).message}
        </Typography>
      </Box>
    );
  }

  if (!analysis) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Typography>Анализ не найден</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ pl: 2, pr: 2, mt: -1, maxWidth: 1600, mx: "auto" }}>
      {/* Заголовок с основной информацией */}
      <Paper
        sx={{
          p: 3,
          mb: 1,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: "white",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: "rgba(255,255,255,0.2)",
                fontSize: "1.5rem",
                fontWeight: "bold",
                mr: 3,
              }}
            >
              АН
            </Avatar>
            <Box>
              <Typography
                variant="h4"
                gutterBottom
                sx={{ fontWeight: "bold", color: "white" }}
              >
                Результат анализа чата
              </Typography>
              <Typography
                variant="h6"
                sx={{ opacity: 0.9, mb: 1, color: "white" }}
              >
                {chatMap.get(analysis.chat_id) || `Чат ${analysis.chat_id}`}
              </Typography>
              <Chip
                icon={<CalendarTodayIcon color="inherit" />}
                label={formatDate(analysis.created_at)}
                sx={{
                  bgcolor: "rgba(255,255,255,0.2)",
                  color: "white",
                  fontWeight: "bold",
                  "& .MuiSvgIcon-root": {
                    color: "white", // Это окрасит иконку в белый
                  },
                }}
              />
            </Box>
          </Box>

          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            variant="contained"
            sx={{
              backgroundColor: "white",
              color: "#764ba2",
              "&:hover": {
                backgroundColor: "#ffffffec",
                backgroundImage: "none", // Убедимся, что градиент не применяется при наведении
              },
              "& .MuiSvgIcon-root": {
                color: "#764ba2",
              },
              backgroundImage: "none", // Отключаем градиент полностью
              boxShadow: "none",
              // Добавляем transition для плавности
              transition: "background-color 0.2s ease",
            }}
          >
            Назад
          </Button>
        </Box>
      </Paper>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Результат анализа */}
        <Card sx={{ mb: -1 }}>
          <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: "flex", alignItems: "center" }}
            >
              <TextSnippetIcon sx={{ mr: 1, color: "primary.main" }} />
              Результат анализа
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography
              sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
            >
              {analysis.result_text || "Результат анализа отсутствует"}
            </Typography>
          </CardContent>
        </Card>

        {/* Параметры анализа */}
        <Card>
          <CardContent sx={{ p: 2 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: "flex", alignItems: "center" }}
            >
              <AnalyticsIcon sx={{ mr: 1, color: "primary.main" }} />
              Параметры анализа
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { sm: "1fr 1fr" },
                gap: 3,
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <CompactDetailItem
                  icon={<CalendarTodayIcon color="primary" fontSize="small" />}
                  label="Дата выполнения"
                  value={formatDate(analysis.created_at)}
                />
                <CompactDetailItem
                  icon={<DateRangeIcon color="primary" fontSize="small" />}
                  label="Период анализа"
                  value={formatDateRange(analysis.date_from, analysis.date_to)}
                />
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <CompactDetailItem
                  icon={<ChatIcon color="primary" fontSize="small" />}
                  label="Анализируемый чат"
                  value={chatMap.get(analysis.chat_id) || analysis.chat_id}
                />
                <CompactDetailItem
                  icon={<SmartToyIcon color="primary" fontSize="small" />}
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
                variant="h6"
                gutterBottom
                sx={{ display: "flex", alignItems: "center" }}
              >
                <FingerprintIcon sx={{ mr: 1, color: "primary.main" }} />
                Техническая информация
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  gap: 2,
                }}
              >
                <CompactDetailItem
                  icon={<FingerprintIcon color="primary" fontSize="small" />}
                  label="ID анализа"
                  value={analysis.analysis_id}
                />
                <CompactDetailItem
                  icon={<BusinessIcon color="primary" fontSize="small" />}
                  label="Компания"
                  value={
                    companyMap.get(analysis.company_id) || analysis.company_id
                  }
                />
                {analysis.schedule_id && (
                  <CompactDetailItem
                    icon={<FingerprintIcon color="primary" fontSize="small" />}
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
