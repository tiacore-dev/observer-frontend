"use client";

// src/pages/schedules/scheduleDetailsPage.tsx
import type React from "react";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Button,
  Chip,
  Stack,
  Grid,
  CardContent,
  Card,
  Divider,
  Avatar,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import ScheduleIcon from "@mui/icons-material/Schedule";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import ChatIcon from "@mui/icons-material/Chat";
import BusinessIcon from "@mui/icons-material/Business";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import SendIcon from "@mui/icons-material/Send";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import HistoryIcon from "@mui/icons-material/History";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import { useScheduleDetailsQuery } from "../../hooks/schedules/useSchedulesQuery";
import {
  useUpdateSchedule,
  useDeleteSchedule,
  useToggleSchedule,
} from "../../hooks/schedules/useScheduleMutations";
import { useCompanyMap } from "../../hooks/maps/useCompanyMap";
import { useChatMap } from "../../hooks/maps/useChatMap";
import { usePromptMap } from "../../hooks/maps/usePromptMap";
import { useBotMap } from "../../hooks/maps/useBotMap";
import { EditScheduleModal } from "./editScheduleModal";
import { DeleteDialog } from "../../components/deleteDialog";
import { DetailsPageSkeleton } from "../../components/skeleton/detailsPageSkeleton";
import { daysOfWeek, convertToLocalTime } from "./helpers/scheduleUtils";

export const ScheduleDetailsPage: React.FC<{ developerMode: boolean }> = ({
  developerMode,
}) => {
  const { scheduleId } = useParams<{ scheduleId: string }>();
  const navigate = useNavigate();
  const {
    data: schedule,
    isLoading,
    error,
    refetch,
  } = useScheduleDetailsQuery(scheduleId || "");
  const updateScheduleMutation = useUpdateSchedule();
  const deleteScheduleMutation = useDeleteSchedule();
  const toggleScheduleMutation = useToggleSchedule();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Используем хуки для маппинга
  const { companyMap, isLoadingCompanyMap } = useCompanyMap();
  const { chatMap, isLoadingChatsMap } = useChatMap();
  const { promptMap, isLoadingPromptMap } = usePromptMap();
  const { botMap, isLoadingBotMap } = useBotMap();

  const isLoadingAll = isLoading || isLoadingCompanyMap;

  const getScheduleTypeLabel = (type: string) => {
    switch (type) {
      case "interval":
        return "По интервалу";
      case "cron":
        return "По расписанию";
      default:
        return type;
    }
  };

  const getScheduleStrategyLabel = (strategy: string) => {
    switch (strategy) {
      case "analysis":
        return "Анализ чата";
      case "notification":
        return "Отправка уведомлений";
      default:
        return strategy;
    }
  };

  const getSendStrategyLabel = (strategy: string) => {
    switch (strategy) {
      case "fixed":
        return "В определенное время";
      case "relative":
        return "Сразу после выполнения";
      default:
        return strategy;
    }
  };

  const formatCronExpressionForDisplay = (cronExpression: string) => {
    if (!cronExpression) return "";

    try {
      const parts = cronExpression.split(" ");
      if (parts.length < 5) return cronExpression;

      const utcMinutes = parts[0];
      const utcHours = parts[1];
      const days = parts[4];

      const utcTime = `${utcHours.padStart(2, "0")}:${utcMinutes.padStart(
        2,
        "0"
      )}`;
      const localTime = convertToLocalTime(utcTime);

      const dayNumbers = days.split(",").map(Number);
      const dayNames = dayNumbers.map((dayNum) => {
        const day = daysOfWeek.find((d) => d.id === dayNum);
        return day ? day.name : dayNum;
      });

      return `${dayNames.join(", ")} в ${localTime}`;
    } catch (error) {
      console.error("Error formatting cron expression:", error);
      return cronExpression;
    }
  };

  const formatTimeDisplay = (utcTime: string | undefined | null) => {
    if (!utcTime) return "";

    const timeWithoutSeconds = utcTime.split(":").slice(0, 2).join(":");
    const localTime = convertToLocalTime(timeWithoutSeconds);

    try {
      return new Date(`2000-01-01T${localTime}`).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Error formatting time:", error);
      return localTime;
    }
  };

  const formatDateTimeDisplay = (utcDateTime: string | undefined | null) => {
    if (!utcDateTime) return "";

    try {
      const date = new Date(utcDateTime);
      return date.toLocaleString("ru-RU", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Error formatting datetime:", error);
      return utcDateTime;
    }
  };

  const handleDelete = async () => {
    if (!scheduleId) return;

    try {
      await deleteScheduleMutation.mutateAsync(scheduleId);
      navigate("/schedules");
    } catch (error) {
      console.error("Error deleting schedule:", error);
    }
  };

  const handleToggle = async () => {
    if (!scheduleId) return;

    try {
      await toggleScheduleMutation.mutateAsync(scheduleId);
      refetch();
    } catch (error) {
      console.error("Error toggling schedule:", error);
    }
  };

  const CompactDetailItem = ({
    icon,
    label,
    value,
    multiline = false,
  }: {
    icon: React.ReactNode;
    label: string;
    value: string | React.ReactNode;
    multiline?: boolean;
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
        {multiline ? (
          <Typography
            variant="body2"
            sx={{
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {value}
          </Typography>
        ) : (
          <Typography
            variant="body2"
            sx={{
              fontFamily:
                typeof value === "string" && value.match(/^\d+$/)
                  ? "monospace"
                  : "inherit",
            }}
          >
            {value}
          </Typography>
        )}
      </Box>
    </Box>
  );

  const getScheduleInitials = () => {
    if (schedule?.schedule_strategy === "analysis") return "АН";
    if (schedule?.schedule_strategy === "notification") return "УВ";
    return "РС";
  };

  if (isLoadingAll) {
    return (
      <DetailsPageSkeleton developerMode={developerMode} buttonCount={4} />
    );
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

  if (!schedule) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Typography>Расписание не найдено</Typography>
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
              {getScheduleInitials()}
            </Avatar>
            <Box>
              <Typography
                variant="h4"
                gutterBottom
                sx={{ fontWeight: "bold", color: "white" }}
              >
                {getScheduleStrategyLabel(schedule.schedule_strategy)}
              </Typography>
              <Typography
                variant="h6"
                sx={{ opacity: 0.9, mb: 1, color: "white" }}
              >
                {getScheduleTypeLabel(schedule.schedule_type)}
              </Typography>
              <Chip
                icon={
                  schedule.enabled ? <CheckCircleIcon /> : <PauseCircleIcon />
                }
                label={schedule.enabled ? "Активно" : "Приостановлено"}
                sx={{
                  bgcolor: "rgba(255,255,255,0.9)",
                  color: schedule.enabled ? "#059669" : "#dc2626",
                  fontWeight: "bold",
                  "& .MuiSvgIcon-root": {
                    color: schedule.enabled ? "#059669" : "#dc2626",
                  },
                }}
              />
            </Box>
          </Box>

          {/* Кнопки действий */}
          <Stack direction="row" spacing={1}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
              variant="contained"
              sx={{
                backgroundColor: "white",
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
            <Button
              startIcon={<PowerSettingsNewIcon />}
              onClick={handleToggle}
              variant="contained"
              sx={{
                backgroundColor: "#ffffff",
                color: schedule.enabled ? "#dc2626" : "#059669", // "white",
                "&:hover": {
                  backgroundColor: "#ffffffec",
                  backgroundImage: "none",
                },
                "& .MuiSvgIcon-root": {
                  color: schedule.enabled ? "#dc2626" : "#059669",
                },
                backgroundImage: "none",
                boxShadow: "none",
                transition: "background-color 0.2s ease",
              }}
              disabled={toggleScheduleMutation.isPending}
            >
              {schedule.enabled ? "Приостановить" : "Активировать"}
              {toggleScheduleMutation.isPending && (
                <CircularProgress size={20} sx={{ ml: 1, color: "white" }} />
              )}
            </Button>
            <Button
              startIcon={<EditIcon />}
              onClick={() => setIsEditModalOpen(true)}
              variant="contained"
              sx={{
                backgroundColor: "white",
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
              Изменить
            </Button>
            <Button
              startIcon={<DeleteIcon />}
              onClick={() => setIsDeleteDialogOpen(true)}
              variant="contained"
              sx={{
                backgroundColor: "#ffffff",
                color: "#dc2626", // "white",
                "&:hover": {
                  backgroundColor: "#ffffffec",
                  backgroundImage: "none",
                },
                "& .MuiSvgIcon-root": {
                  color: "#dc2626",
                },
                backgroundImage: "none",
                boxShadow: "none",
                transition: "background-color 0.2s ease",
              }}
            >
              Удалить
            </Button>
          </Stack>
        </Box>
      </Paper>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Основные параметры */}
        <Card>
          <CardContent sx={{ p: 2 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: "flex", alignItems: "center" }}
            >
              <ScheduleIcon sx={{ mr: 1, color: "primary.main" }} />
              Основные параметры
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
                  icon={
                    schedule.schedule_strategy === "analysis" ? (
                      <AnalyticsIcon color="primary" fontSize="small" />
                    ) : (
                      <NotificationsIcon color="primary" fontSize="small" />
                    )
                  }
                  label="Тип задачи"
                  value={getScheduleStrategyLabel(schedule.schedule_strategy)}
                />

                <CompactDetailItem
                  icon={<AccessTimeIcon color="primary" fontSize="small" />}
                  label="Когда выполнять"
                  value={getScheduleTypeLabel(schedule.schedule_type)}
                />
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <CompactDetailItem
                  icon={<SmartToyIcon color="primary" fontSize="small" />}
                  label="Telegram Бот"
                  value={
                    botMap.get(schedule.bot_id.toString()) || schedule.bot_id
                  }
                />

                {developerMode && (
                  <>
                    <CompactDetailItem
                      icon={
                        <FingerprintIcon color="primary" fontSize="small" />
                      }
                      label="ID расписания"
                      value={schedule.schedule_id}
                    />
                    <CompactDetailItem
                      icon={<BusinessIcon color="primary" fontSize="small" />}
                      label="Компания"
                      value={
                        companyMap.get(schedule.company_id) ||
                        schedule.company_id
                      }
                    />
                  </>
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Детали задачи */}
        <Card>
          <CardContent sx={{ p: 2 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: "flex", alignItems: "center" }}
            >
              {schedule.schedule_strategy === "analysis" ? (
                <AnalyticsIcon sx={{ mr: 1, color: "primary.main" }} />
              ) : (
                <NotificationsIcon sx={{ mr: 1, color: "primary.main" }} />
              )}
              {schedule.schedule_strategy === "analysis"
                ? "Параметры анализа"
                : "Параметры уведомления"}
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {schedule.schedule_strategy === "notification" ? (
              <CompactDetailItem
                icon={<NotificationsIcon color="primary" fontSize="small" />}
                label="Текст уведомления"
                value={schedule.notification_text || "Не указан"}
                multiline
              />
            ) : (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { sm: "1fr 1fr" },
                  gap: 3,
                }}
              >
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {schedule.chat_id && (
                    <CompactDetailItem
                      icon={<ChatIcon color="primary" fontSize="small" />}
                      label="Анализируемый чат"
                      value={chatMap.get(schedule.chat_id) || schedule.chat_id}
                    />
                  )}

                  {schedule.prompt_id && (
                    <CompactDetailItem
                      icon={<AnalyticsIcon color="primary" fontSize="small" />}
                      label="Промпт"
                      value={
                        promptMap.get(schedule.prompt_id) || schedule.prompt_id
                      }
                    />
                  )}
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {schedule.message_intro && (
                    <CompactDetailItem
                      icon={
                        <NotificationsIcon color="primary" fontSize="small" />
                      }
                      label="Заголовок сообщения"
                      value={schedule.message_intro}
                      multiline
                    />
                  )}
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Расписание выполнения */}
        <Card>
          <CardContent sx={{ p: 2 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: "flex", alignItems: "center" }}
            >
              <CalendarTodayIcon sx={{ mr: 1, color: "primary.main" }} />
              Расписание выполнения
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {schedule.schedule_type === "interval" ? (
              <CompactDetailItem
                icon={<AccessTimeIcon color="primary" fontSize="small" />}
                label="Интервал выполнения"
                value={`${
                  schedule.interval_hours ? `${schedule.interval_hours} ч ` : ""
                }${
                  schedule.interval_minutes
                    ? `${schedule.interval_minutes} мин`
                    : ""
                }`}
              />
            ) : (
              schedule.cron_expression && (
                <CompactDetailItem
                  icon={<CalendarTodayIcon color="primary" fontSize="small" />}
                  label="Дни и время"
                  value={formatCronExpressionForDisplay(
                    schedule.cron_expression
                  )}
                />
              )
            )}
          </CardContent>
        </Card>

        {/* Получатели */}
        <Card>
          <CardContent sx={{ p: 2 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: "flex", alignItems: "center" }}
            >
              <SendIcon sx={{ mr: 1, color: "primary.main" }} />
              Куда отправлять результаты
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {schedule.target_chats && schedule.target_chats.length > 0 ? (
              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{ fontWeight: 600, fontSize: "0.875rem", mb: 1 }}
                >
                  Выбранные чаты:
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                  {schedule.target_chats.map((chatId: number) => (
                    <Chip
                      key={chatId}
                      label={chatMap.get(chatId) || chatId}
                      variant="outlined"
                      color="primary"
                      size="small"
                    />
                  ))}
                </Stack>
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Чаты для получения результатов не выбраны
              </Typography>
            )}
          </CardContent>
        </Card>

        {/* Время отправки (только для анализа) */}
        {schedule.schedule_strategy === "analysis" && (
          <Card>
            <CardContent sx={{ p: 2 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: "flex", alignItems: "center" }}
              >
                <SendIcon sx={{ mr: 1, color: "primary.main" }} />
                Когда отправлять результаты
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
                    icon={<AccessTimeIcon color="primary" fontSize="small" />}
                    label="Способ отправки"
                    value={getSendStrategyLabel(schedule.send_strategy || "")}
                  />
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {schedule.send_strategy === "fixed" &&
                    schedule.time_to_send && (
                      <CompactDetailItem
                        icon={
                          <AccessTimeIcon color="primary" fontSize="small" />
                        }
                        label="Время отправки"
                        value={formatTimeDisplay(schedule.time_to_send)}
                      />
                    )}

                  {schedule.send_strategy === "relative" &&
                    schedule.send_after_minutes && (
                      <CompactDetailItem
                        icon={
                          <AccessTimeIcon color="primary" fontSize="small" />
                        }
                        label="Отправить через"
                        value={`${schedule.send_after_minutes} минут после анализа`}
                      />
                    )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* История выполнения */}
        {schedule.last_run_at && (
          <Card>
            <CardContent sx={{ p: 2 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: "flex", alignItems: "center" }}
              >
                <HistoryIcon sx={{ mr: 1, color: "primary.main" }} />
                История выполнения
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
                    icon={
                      <CalendarTodayIcon color="primary" fontSize="small" />
                    }
                    label="Последний запуск"
                    value={formatDateTimeDisplay(schedule.last_run_at)}
                  />
                </Box>
                {developerMode && schedule.created_at && (
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    <CompactDetailItem
                      icon={
                        <CalendarTodayIcon color="primary" fontSize="small" />
                      }
                      label="Дата создания"
                      value={formatDateTimeDisplay(schedule.created_at)}
                    />
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>

      <EditScheduleModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        schedule={schedule}
        onUpdate={updateScheduleMutation.mutateAsync}
        isSubmitting={updateScheduleMutation.isPending}
      />

      <DeleteDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        isDeleting={deleteScheduleMutation.isPending}
      />
    </Box>
  );
};
