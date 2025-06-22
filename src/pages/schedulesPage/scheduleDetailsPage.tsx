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
import { useScheduleDetailsQuery } from "../../hooks/schedules/useSchedulesQuery";
import {
  useUpdateSchedule,
  useDeleteSchedule,
} from "../../hooks/schedules/useScheduleMutations";
import { useCompanyMap } from "../../hooks/maps/useCompanyMap";
import { useChatMap } from "../../hooks/maps/useChatMap";
import { usePromptMap } from "../../hooks/maps/usePromptMap";
import { useBotMap } from "../../hooks/maps/useBotMap";
import { EditScheduleModal } from "./editScheduleModal";
import { DeleteDialog } from "../../components/deleteDialog";
import { DetailsPageSkeleton } from "../../components/skeleton/detailsPageSkeleton";

export const ScheduleDetailsPage: React.FC<{ developerMode: boolean }> = ({
  developerMode,
}) => {
  const { scheduleId } = useParams<{ scheduleId: string }>();
  const navigate = useNavigate();
  const {
    data: schedule,
    isLoading,
    error,
  } = useScheduleDetailsQuery(scheduleId || "");
  const updateScheduleMutation = useUpdateSchedule();
  const deleteScheduleMutation = useDeleteSchedule();

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

  const handleDelete = async () => {
    if (!scheduleId) return;

    try {
      await deleteScheduleMutation.mutateAsync(scheduleId);
      navigate("/schedules");
    } catch (error) {
      console.error("Error deleting schedule:", error);
    }
  };

  if (isLoadingAll) {
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

  if (!schedule) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Typography>Расписание не найдено</Typography>
      </Box>
    );
  }

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

        {schedule.target_chats && schedule.target_chats.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">Целевые чаты:</Typography>
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
              {new Date(
                `2000-01-01T${schedule.time_of_day}`
              ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </Typography>
          </Box>
        )}

        {schedule.schedule_type === "once" && schedule.run_at && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">Время выполнения:</Typography>
            <Typography variant="body1">
              {new Date(schedule.run_at).toLocaleString()}
            </Typography>
          </Box>
        )}

        {schedule.schedule_type === "cron" && schedule.cron_expression && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">Cron выражение:</Typography>
            <Typography variant="body1">{schedule.cron_expression}</Typography>
          </Box>
        )}

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
              {new Date(
                `2000-01-01T${schedule.time_to_send}`
              ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
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
              {new Date(schedule.last_run_at).toLocaleString()}
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
                {new Date(schedule.created_at).toLocaleString()}
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
