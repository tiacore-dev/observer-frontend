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
        return "Повторяющееся";
      case "once":
        return "Одноразово";
      case "daily_time":
        return "Ежедневно";
      default:
        return type;
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

  // Добавьте эту функцию в ваш файл scheduleDetailsPage.tsx
  const formatCronExpressionForDisplay = (cronExpression: string) => {
    if (!cronExpression) return "";

    try {
      const parts = cronExpression.split(" ");
      if (parts.length < 5) return cronExpression;

      // Получаем минуты и часы из cron выражения (они в UTC)
      const utcMinutes = parts[0];
      const utcHours = parts[1];
      const days = parts[4];

      // Конвертируем UTC время в локальное
      const utcTime = `${utcHours.padStart(2, "0")}:${utcMinutes.padStart(
        2,
        "0"
      )}`;
      const localTime = convertToLocalTime(utcTime);

      // Преобразуем дни недели в читаемый формат
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

  // // Затем в JSX замените отображение cron выражения:
  // {
  //   schedule.schedule_type === "cron" && schedule.cron_expression && (
  //     <Box sx={{ mt: 2 }}>
  //       <Typography variant="subtitle1">Расписание:</Typography>
  //       <Typography variant="body1">
  //         {formatCronExpressionForDisplay(schedule.cron_expression)}
  //       </Typography>
  //     </Box>
  //   );
  // }

  const formatTimeDisplay = (utcTime: string | undefined) => {
    if (!utcTime) return "";

    // Удаляем секунды если они есть (формат HH:MM:SS)
    const timeWithoutSeconds = utcTime.split(":").slice(0, 2).join(":");
    const localTime = convertToLocalTime(timeWithoutSeconds);

    try {
      return new Date(`2000-01-01T${localTime}`).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Error formatting time:", error);
      return localTime; // Возвращаем в формате HH:MM если не удалось отформатировать
    }
  };

  const formatDateTimeDisplay = (utcDateTime: string | undefined) => {
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

  const showToggleButton = schedule.schedule_type !== "once";

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "start", mb: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          variant="outlined"
        >
          Назад
        </Button>
        {showToggleButton && (
          <Button
            startIcon={<PowerSettingsNewIcon />}
            onClick={handleToggle}
            variant="outlined"
            color={schedule.enabled ? "error" : "success"}
            style={{ marginLeft: 8 }}
            disabled={toggleScheduleMutation.isPending}
          >
            {schedule.enabled ? "Выключить" : "Включить"}
            {toggleScheduleMutation.isPending && (
              <CircularProgress size={20} sx={{ ml: 1 }} />
            )}
          </Button>
        )}
        <Button
          startIcon={<EditIcon />}
          onClick={() => setIsEditModalOpen(true)}
          variant="contained"
          color="primary"
          style={{ marginLeft: 8 }}
        >
          Редактировать
        </Button>
        <Button
          startIcon={<DeleteIcon />}
          onClick={() => setIsDeleteDialogOpen(true)}
          variant="contained"
          color="error"
          style={{ marginLeft: 8 }}
        >
          Удалить
        </Button>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Детали расписания
        </Typography>

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1">Тип расписания:</Typography>
          <Typography variant="body1">
            {getScheduleTypeLabel(schedule.schedule_type)}
          </Typography>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1">Статус:</Typography>
          <Typography
            variant="body1"
            color={schedule.enabled ? "success.main" : "error"}
          >
            {schedule.enabled ? "Включено" : "Выключено"}
          </Typography>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1">Анализируемый чат:</Typography>
          <Typography variant="body1">
            {chatMap.get(schedule.chat_id) || schedule.chat_id}
          </Typography>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1">Промпт:</Typography>
          <Typography variant="body1">
            {promptMap.get(schedule.prompt_id) || schedule.prompt_id}
          </Typography>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1">Бот:</Typography>
          <Typography variant="body1">
            {botMap.get(schedule.bot_id.toString()) || schedule.bot_id}
          </Typography>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1">Шапка сообщения:</Typography>
          <Typography variant="body1">
            {schedule.message_intro || "-"}
          </Typography>
        </Box>
        {schedule.target_chats && schedule.target_chats.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">
              Чаты для получения отчёта:
            </Typography>
            <Stack
              direction="row"
              spacing={1}
              sx={{ mt: 1 }}
              flexWrap="wrap"
              gap={1}
            >
              {schedule.target_chats.map((chatId: number) => (
                <Chip
                  key={chatId}
                  label={chatMap.get(chatId) || chatId}
                  variant="outlined"
                />
              ))}
            </Stack>
          </Box>
        )}

        {schedule.schedule_type === "interval" && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">Интервал:</Typography>
            <Typography variant="body1">
              {schedule.interval_hours ? `${schedule.interval_hours} ч ` : ""}
              {schedule.interval_minutes
                ? `${schedule.interval_minutes} мин`
                : ""}
            </Typography>
          </Box>
        )}

        {schedule.schedule_type === "daily_time" && schedule.time_of_day && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">Время выполнения:</Typography>
            <Typography variant="body1">
              {formatTimeDisplay(schedule.time_of_day)}
            </Typography>
          </Box>
        )}

        {schedule.schedule_type === "once" && schedule.run_at && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">Время выполнения:</Typography>
            <Typography variant="body1">
              {formatDateTimeDisplay(schedule.run_at)}
            </Typography>
          </Box>
        )}

        {schedule.schedule_type === "cron" && schedule.cron_expression && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">Расписание:</Typography>
            <Typography variant="body1">
              {formatCronExpressionForDisplay(schedule.cron_expression!)}
            </Typography>
          </Box>
        )}

        {/* {schedule.schedule_type === "cron" && schedule.cron_expression && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">Cron выражение:</Typography>
            <Typography variant="body1">{schedule.cron_expression}</Typography>
          </Box>
        )} */}

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1">Стратегия отправки:</Typography>
          <Typography variant="body1">
            {getSendStrategyLabel(schedule.send_strategy)}
          </Typography>
        </Box>

        {schedule.send_strategy === "fixed" && schedule.time_to_send && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">Время отправки:</Typography>
            <Typography variant="body1">
              {formatTimeDisplay(schedule.time_to_send)}
            </Typography>
          </Box>
        )}

        {schedule.send_strategy === "relative" &&
          schedule.send_after_minutes && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">
                Отправить через (минуты):
              </Typography>
              <Typography variant="body1">
                {schedule.send_after_minutes}
              </Typography>
            </Box>
          )}

        {schedule.last_run_at && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">Последний запуск:</Typography>
            <Typography variant="body1">
              {formatDateTimeDisplay(schedule.last_run_at)}
            </Typography>
          </Box>
        )}

        {developerMode && (
          <>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">ID:</Typography>
              <Typography variant="body1">{schedule.schedule_id}</Typography>
            </Box>

            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">Компания:</Typography>
              <Typography variant="body1">
                {companyMap.get(schedule.company_id) || schedule.company_id}
              </Typography>
            </Box>

            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">Дата создания:</Typography>
              <Typography variant="body1">
                {formatDateTimeDisplay(schedule.created_at)}
              </Typography>
            </Box>
          </>
        )}
      </Paper>

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
