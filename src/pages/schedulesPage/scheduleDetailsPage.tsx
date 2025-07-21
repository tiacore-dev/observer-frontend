// src/pages/schedules/scheduleDetailsPage.tsx
import React, { useState } from "react";
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
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
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
        return "Интервал";
      case "cron":
        return "По дням недели";
      default:
        return type;
    }
  };

  const getScheduleStrategyLabel = (strategy: string) => {
    switch (strategy) {
      case "analysis":
        return "Анализ";
      case "notification":
        return "Уведомление";
      default:
        return strategy;
    }
  };

  const getSendStrategyLabel = (strategy: string) => {
    switch (strategy) {
      case "fixed":
        return "Фиксированное время";
      case "relative":
        return "Относительно времени выполнения";
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
      return date.toLocaleString(undefined, {
        year: "numeric",
        month: "numeric",
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

  const DetailItem = ({
    label,
    value,
    color,
    multiline = false,
  }: {
    label: string;
    value: string | React.ReactNode;
    color?: string;
    multiline?: boolean;
  }) => (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2" color="text.secondary">
        {label}
      </Typography>
      {multiline ? (
        <Typography
          variant="body1"
          sx={{
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            color: color || "inherit",
          }}
        >
          {value}
        </Typography>
      ) : (
        <Typography
          variant="body1"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            color: color || "inherit",
          }}
        >
          {value}
        </Typography>
      )}
    </Box>
  );

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
    <Box sx={{ p: 3 }}>
      {/* Заголовок и кнопки действий */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        {/* <Typography variant="h4">Детали расписания</Typography> */}
        <Stack direction="row" spacing={1}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            variant="outlined"
          >
            Назад
          </Button>
          <Button
            startIcon={<PowerSettingsNewIcon />}
            onClick={handleToggle}
            variant="outlined"
            color={schedule.enabled ? "error" : "success"}
            disabled={toggleScheduleMutation.isPending}
          >
            {schedule.enabled ? "Выключить" : "Включить"}
            {toggleScheduleMutation.isPending && (
              <CircularProgress size={20} sx={{ ml: 1 }} />
            )}
          </Button>
          <Button
            startIcon={<EditIcon />}
            onClick={() => setIsEditModalOpen(true)}
            variant="contained"
            color="primary"
          >
            Редактировать
          </Button>
          <Button
            startIcon={<DeleteIcon />}
            onClick={() => setIsDeleteDialogOpen(true)}
            variant="contained"
            color="error"
          >
            Удалить
          </Button>
        </Stack>
      </Box>

      {/* Основная информация */}
      <Grid container spacing={3}>
        {/* Основные параметры */}
        <Grid>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Основные параметры
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <DetailItem
                label="Стратегия"
                value={getScheduleStrategyLabel(schedule.schedule_strategy)}
              />

              <DetailItem
                label="Тип расписания"
                value={getScheduleTypeLabel(schedule.schedule_type)}
              />

              <DetailItem
                label="Статус"
                value={schedule.enabled ? "Включено" : "Выключено"}
                color={schedule.enabled ? "success.main" : "error"}
              />

              <DetailItem
                label="Бот"
                value={
                  botMap.get(schedule.bot_id.toString()) || schedule.bot_id
                }
              />

              {developerMode && (
                <>
                  <DetailItem label="ID" value={schedule.schedule_id} />
                  <DetailItem
                    label="Компания"
                    value={
                      companyMap.get(schedule.company_id) || schedule.company_id
                    }
                  />
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Детали стратегии */}
        <Grid>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {schedule.schedule_strategy === "analysis"
                  ? "Параметры анализа"
                  : "Параметры уведомления"}
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {schedule.schedule_strategy === "notification" ? (
                <DetailItem
                  label="Текст уведомления"
                  value={schedule.notification_text || "-"}
                  multiline
                />
              ) : (
                <>
                  {schedule.chat_id && (
                    <DetailItem
                      label="Анализируемый чат"
                      value={chatMap.get(schedule.chat_id) || schedule.chat_id}
                    />
                  )}

                  {schedule.prompt_id && (
                    <DetailItem
                      label="Промпт"
                      value={
                        promptMap.get(schedule.prompt_id) || schedule.prompt_id
                      }
                    />
                  )}

                  {schedule.message_intro && (
                    <DetailItem
                      label="Шапка сообщения"
                      value={schedule.message_intro}
                      multiline
                    />
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Расписание */}
        <Grid>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Расписание
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {schedule.schedule_type === "interval" ? (
                <DetailItem
                  label="Интервал"
                  value={`${
                    schedule.interval_hours
                      ? `${schedule.interval_hours} ч `
                      : ""
                  }
                    ${
                      schedule.interval_minutes
                        ? `${schedule.interval_minutes} мин`
                        : ""
                    }`}
                />
              ) : (
                schedule.cron_expression && (
                  <DetailItem
                    label="Расписание"
                    value={formatCronExpressionForDisplay(
                      schedule.cron_expression
                    )}
                  />
                )
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Получатели */}
        <Grid>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Получатели
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {schedule.target_chats && schedule.target_chats.length > 0 ? (
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Чаты для получения:
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                    {schedule.target_chats.map((chatId: number) => (
                      <Chip
                        key={chatId}
                        label={chatMap.get(chatId) || chatId}
                        variant="outlined"
                      />
                    ))}
                  </Stack>
                </Box>
              ) : (
                <Typography variant="body2">Нет выбранных чатов</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Стратегия отправки (только для анализа) */}
        {schedule.schedule_strategy === "analysis" && (
          <Grid>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Стратегия отправки
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <DetailItem
                  label="Стратегия"
                  value={getSendStrategyLabel(schedule.send_strategy || "")}
                />

                {schedule.send_strategy === "fixed" &&
                  schedule.time_to_send && (
                    <DetailItem
                      label="Время отправки"
                      value={formatTimeDisplay(schedule.time_to_send)}
                    />
                  )}

                {schedule.send_strategy === "relative" &&
                  schedule.send_after_minutes && (
                    <DetailItem
                      label="Отправить через (минуты)"
                      value={schedule.send_after_minutes.toString()}
                    />
                  )}
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* История выполнения */}
        {schedule.last_run_at && (
          <Grid>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  История выполнения
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <DetailItem
                  label="Последний запуск"
                  value={formatDateTimeDisplay(schedule.last_run_at)}
                />

                {developerMode && schedule.created_at && (
                  <DetailItem
                    label="Дата создания"
                    value={formatDateTimeDisplay(schedule.created_at)}
                  />
                )}
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

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
