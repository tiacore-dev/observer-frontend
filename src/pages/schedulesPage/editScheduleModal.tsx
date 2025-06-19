// src/pages/schedules/editScheduleModal.tsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Chip,
  Stack,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";
import { ISchedule, IscheduleEdit } from "../../api/schedulesApi";
import { useBotsQuery } from "../../hooks/bots/useBotsQuery";
import { useChatsQuery } from "../../hooks/chats/useChatsQuery";
import { usePromptsQuery } from "../../hooks/prompts/usePromptsQuery";
import { useCompaniesQuery } from "../../hooks/companies/useCompaniesQuery";

const daysOfWeek = [
  { id: 1, name: "Понедельник" },
  { id: 2, name: "Вторник" },
  { id: 3, name: "Среда" },
  { id: 4, name: "Четверг" },
  { id: 5, name: "Пятница" },
  { id: 6, name: "Суббота" },
  { id: 0, name: "Воскресенье" },
];

interface EditScheduleModalProps {
  open: boolean;
  onClose: () => void;
  schedule: ISchedule;
  onUpdate: (data: {
    schedule_id: string;
    updatedData: IscheduleEdit;
  }) => Promise<void>;
  isSubmitting: boolean;
}

export const EditScheduleModal: React.FC<EditScheduleModalProps> = ({
  open,
  onClose,
  schedule,
  onUpdate,
  isSubmitting,
}) => {
  const [updatedData, setUpdatedData] = React.useState<IscheduleEdit>({
    chat_id: schedule.chat_id,
    prompt_id: schedule.prompt_id,
    schedule_type: schedule.schedule_type,
    target_chats: [...schedule.target_chats],
    removed_chats: [],
    bot_id: schedule.bot_id,
    send_strategy: schedule.send_strategy,
    interval_hours: schedule.interval_hours,
    interval_minutes: schedule.interval_minutes,
    time_of_day: schedule.time_of_day,
    cron_expression: schedule.cron_expression,
    run_at: schedule.run_at,
    enabled: schedule.enabled,
    time_to_send: schedule.time_to_send,
    send_after_minutes: schedule.send_after_minutes,
  });

  const [selectedDays, setSelectedDays] = React.useState<number[]>([]);
  const [cronTime, setCronTime] = React.useState<string>("09:00");
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const { data: botsData, isLoading: botsLoading } = useBotsQuery();
  const { data: chatsData, isLoading: chatsLoading } = useChatsQuery(
    updatedData.bot_id
  );
  const { data: promptsData, isLoading: promptsLoading } = usePromptsQuery();
  const { data: companiesData, isLoading: companiesLoading } =
    useCompaniesQuery();

  React.useEffect(() => {
    if (schedule.schedule_type === "cron" && schedule.cron_expression) {
      const parts = schedule.cron_expression.split(" ");
      if (parts.length >= 5) {
        setCronTime(`${parts[1]}:${parts[0]}`);
        setSelectedDays(parts[4].split(",").map(Number));
      }
    }
  }, [schedule]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (
      name === "interval_hours" ||
      name === "interval_minutes" ||
      name === "send_after_minutes"
    ) {
      const numValue = parseInt(value);
      if (numValue < 0) {
        setErrors((prev) => ({
          ...prev,
          [name]: "Значение не может быть отрицательным",
        }));
        return;
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    }

    setUpdatedData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: { target: { name: string; value: any } }) => {
    const { name, value } = e.target;

    if (name === "bot_id") {
      setUpdatedData((prev) => ({
        ...prev,
        [name]: value,
        chat_id: 0,
        target_chats: [],
        removed_chats: [],
      }));
    } else {
      setUpdatedData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleChatToggle = (chatId: number) => () => {
    setUpdatedData((prev) => {
      const currentTargetChats = prev.target_chats || [];
      const currentRemovedChats = prev.removed_chats || [];

      let newTargetChats = [...currentTargetChats];
      let newRemovedChats = [...currentRemovedChats];

      const chatIndex = newTargetChats.indexOf(chatId);
      const removedIndex = newRemovedChats.indexOf(chatId);

      if (chatIndex === -1) {
        newTargetChats.push(chatId);
        if (removedIndex !== -1) {
          newRemovedChats.splice(removedIndex, 1);
        }
      } else {
        newTargetChats.splice(chatIndex, 1);
        if (schedule.target_chats.includes(chatId)) {
          newRemovedChats.push(chatId);
        }
      }

      return {
        ...prev,
        target_chats: newTargetChats,
        removed_chats: newRemovedChats,
      };
    });
  };

  const toggleDaySelection = (dayId: number) => {
    setSelectedDays((prev) =>
      prev.includes(dayId)
        ? prev.filter((id) => id !== dayId)
        : [...prev, dayId]
    );
  };

  const generateCronExpression = (time: string, days: number[]) => {
    if (!time || days.length === 0) return "";
    const [hours, minutes] = time.split(":");
    return `${minutes} ${hours} * * ${days.join(",")}`;
  };

  const validateFields = () => {
    const newErrors: Record<string, string> = {};
    const now = new Date();

    if (!updatedData.bot_id) newErrors.bot_id = "Бот обязателен";
    if (!updatedData.chat_id) newErrors.chat_id = "Чат обязателен";
    if (!updatedData.prompt_id) newErrors.prompt_id = "Промпт обязателен";
    if (updatedData.target_chats.length === 0)
      newErrors.target_chats = "Необходимо выбрать хотя бы один чат";

    if (updatedData.schedule_type === "interval") {
      if (!updatedData.interval_hours && !updatedData.interval_minutes) {
        newErrors.interval = "Укажите интервал (часы или минуты)";
      } else {
        if (updatedData.interval_hours && updatedData.interval_hours < 0) {
          newErrors.interval_hours = "Часы не могут быть отрицательными";
        }
        if (updatedData.interval_minutes && updatedData.interval_minutes < 0) {
          newErrors.interval_minutes = "Минуты не могут быть отрицательными";
        }
      }
    } else if (updatedData.schedule_type === "cron") {
      if (selectedDays.length === 0 || !cronTime) {
        newErrors.cron_expression = "Выберите дни и время";
      }
    } else if (updatedData.schedule_type === "once") {
      if (!updatedData.run_at) {
        newErrors.run_at = "Время выполнения обязательно";
      } else {
        const selectedDateTime = new Date(updatedData.run_at);
        if (selectedDateTime < now) {
          newErrors.run_at = "Нельзя выбрать прошедшую дату/время";
        }
      }
    } else if (updatedData.schedule_type === "daily_time") {
      if (!updatedData.time_of_day) {
        newErrors.time_of_day = "Время выполнения обязательно";
      }
    }

    if (updatedData.send_strategy === "fixed" && !updatedData.time_to_send) {
      newErrors.time_to_send = "Время отправки обязательно";
    } else if (
      updatedData.send_strategy === "relative" &&
      !updatedData.send_after_minutes
    ) {
      newErrors.send_after_minutes = "Интервал отправки обязателен";
    } else if (
      updatedData.send_strategy === "relative" &&
      updatedData.send_after_minutes !== undefined &&
      updatedData.send_after_minutes < 0
    ) {
      newErrors.send_after_minutes = "Интервал не может быть отрицательным";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateFields()) return;

    try {
      const dataToUpdate: IscheduleEdit = {
        ...updatedData,
        cron_expression:
          updatedData.schedule_type === "cron"
            ? generateCronExpression(cronTime, selectedDays)
            : undefined,
      };

      await onUpdate({
        schedule_id: schedule.schedule_id,
        updatedData: dataToUpdate,
      });
      onClose();
    } catch (error) {
      console.error("Error updating schedule:", error);
    }
  };

  if (botsLoading || chatsLoading || promptsLoading || companiesLoading) {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Редактировать расписание</DialogTitle>
        <DialogContent>
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Редактировать расписание</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <FormControl fullWidth required error={!!errors.bot_id}>
            <InputLabel>Бот</InputLabel>
            <Select
              name="bot_id"
              value={updatedData.bot_id || ""}
              label="Бот"
              onChange={handleSelectChange}
            >
              {botsData?.bots.map((bot) => (
                <MenuItem key={bot.bot_id} value={bot.bot_id}>
                  {bot.bot_username} (ID: {bot.bot_id})
                </MenuItem>
              ))}
            </Select>
            {errors.bot_id && (
              <Typography variant="caption" color="error">
                {errors.bot_id}
              </Typography>
            )}
          </FormControl>

          <FormControl fullWidth required error={!!errors.chat_id}>
            <InputLabel>Анализируемый чат</InputLabel>
            <Select
              name="chat_id"
              value={updatedData.chat_id || ""}
              label="Анализируемый чат"
              onChange={handleSelectChange}
              disabled={chatsLoading}
            >
              {chatsData?.chats.map((chat) => (
                <MenuItem key={chat.chat_id} value={chat.chat_id}>
                  {chat.chat_name} (ID: {chat.chat_id})
                </MenuItem>
              ))}
            </Select>
            {errors.chat_id && (
              <Typography variant="caption" color="error">
                {errors.chat_id}
              </Typography>
            )}
          </FormControl>

          <FormControl fullWidth required error={!!errors.prompt_id}>
            <InputLabel>Промпт</InputLabel>
            <Select
              name="prompt_id"
              value={updatedData.prompt_id || ""}
              label="Промпт"
              onChange={handleSelectChange}
            >
              {promptsData?.prompts.map((prompt) => (
                <MenuItem key={prompt.prompt_id} value={prompt.prompt_id}>
                  {prompt.prompt_name || prompt.prompt_id}
                </MenuItem>
              ))}
            </Select>
            {errors.prompt_id && (
              <Typography variant="caption" color="error">
                {errors.prompt_id}
              </Typography>
            )}
          </FormControl>

          <FormControl fullWidth required error={!!errors.target_chats}>
            <Typography variant="subtitle1" gutterBottom>
              Выберите целевые чаты:
            </Typography>
            <Box
              sx={{
                maxHeight: 200,
                overflow: "auto",
                border: "1px solid rgba(0, 0, 0, 0.23)",
                borderRadius: 1,
                p: 1,
              }}
            >
              {chatsLoading ? (
                <Box display="flex" justifyContent="center" py={2}>
                  <CircularProgress size={24} />
                </Box>
              ) : (
                <List dense>
                  {chatsData?.chats.map((chat) => (
                    <ListItem key={chat.chat_id}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={updatedData.target_chats.includes(
                              chat.chat_id
                            )}
                            onChange={handleChatToggle(chat.chat_id)}
                          />
                        }
                        label={
                          <ListItemText
                            primary={chat.chat_name}
                            secondary={`ID: ${chat.chat_id}`}
                          />
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
            {errors.target_chats && (
              <Typography variant="caption" color="error">
                {errors.target_chats}
              </Typography>
            )}
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Тип расписания</InputLabel>
            <Select
              name="schedule_type"
              value={updatedData.schedule_type || "interval"}
              label="Тип расписания"
              onChange={handleSelectChange}
            >
              <MenuItem value="interval">Интервал</MenuItem>
              <MenuItem value="cron">Повторяющееся (Cron)</MenuItem>
              <MenuItem value="once">Одноразово</MenuItem>
              <MenuItem value="daily_time">Ежедневно</MenuItem>
            </Select>
          </FormControl>

          {updatedData.schedule_type === "interval" && (
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                label="Интервал (часы)"
                name="interval_hours"
                type="number"
                value={updatedData.interval_hours || ""}
                onChange={handleChange}
                error={!!errors.interval || !!errors.interval_hours}
                helperText={errors.interval || errors.interval_hours}
                inputProps={{ min: 0 }}
              />
              <TextField
                fullWidth
                label="Интервал (минуты)"
                name="interval_minutes"
                type="number"
                value={updatedData.interval_minutes || ""}
                onChange={handleChange}
                error={!!errors.interval_minutes}
                helperText={errors.interval_minutes}
                inputProps={{ min: 0 }}
              />
            </Box>
          )}

          {updatedData.schedule_type === "cron" && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                fullWidth
                label="Время выполнения (HH:MM)"
                type="time"
                value={cronTime}
                onChange={(e) => setCronTime(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />

              <Typography variant="subtitle2">Дни недели:</Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                {daysOfWeek.map((day) => (
                  <Chip
                    key={day.id}
                    label={day.name}
                    color={
                      selectedDays.includes(day.id) ? "primary" : "default"
                    }
                    onClick={() => toggleDaySelection(day.id)}
                    variant={
                      selectedDays.includes(day.id) ? "filled" : "outlined"
                    }
                  />
                ))}
              </Stack>

              {errors.cron_expression && (
                <Typography variant="caption" color="error">
                  {errors.cron_expression}
                </Typography>
              )}
            </Box>
          )}

          {updatedData.schedule_type === "once" && (
            <TextField
              fullWidth
              label="Время выполнения"
              name="run_at"
              type="datetime-local"
              value={
                updatedData.run_at
                  ? new Date(updatedData.run_at).toISOString().slice(0, 16)
                  : ""
              }
              onChange={handleChange}
              error={!!errors.run_at}
              helperText={errors.run_at}
              required
              InputLabelProps={{ shrink: true }}
              inputProps={{
                min: new Date().toISOString().slice(0, 16),
              }}
            />
          )}

          {updatedData.schedule_type === "daily_time" && (
            <TextField
              fullWidth
              label="Время выполнения (HH:MM)"
              name="time_of_day"
              type="time"
              value={
                updatedData.time_of_day
                  ? updatedData.time_of_day.substring(11, 16)
                  : ""
              }
              onChange={handleChange}
              error={!!errors.time_of_day}
              helperText={errors.time_of_day}
              required
              InputLabelProps={{ shrink: true }}
            />
          )}

          <FormControl fullWidth>
            <InputLabel>Стратегия отправки</InputLabel>
            <Select
              name="send_strategy"
              value={updatedData.send_strategy || "fixed"}
              label="Стратегия отправки"
              onChange={handleSelectChange}
            >
              <MenuItem value="fixed">Фиксированное время</MenuItem>
              <MenuItem value="relative">
                Относительно времени выполнения
              </MenuItem>
            </Select>
          </FormControl>

          {updatedData.send_strategy === "fixed" && (
            <TextField
              fullWidth
              label="Время отправки (HH:MM)"
              name="time_to_send"
              type="time"
              value={
                updatedData.time_to_send
                  ? updatedData.time_to_send.substring(11, 16)
                  : ""
              }
              onChange={handleChange}
              error={!!errors.time_to_send}
              helperText={errors.time_to_send}
              required
              InputLabelProps={{ shrink: true }}
            />
          )}

          {updatedData.send_strategy === "relative" && (
            <TextField
              fullWidth
              label="Отправить через (минуты)"
              name="send_after_minutes"
              type="number"
              value={updatedData.send_after_minutes || ""}
              onChange={handleChange}
              error={!!errors.send_after_minutes}
              helperText={errors.send_after_minutes}
              required
              inputProps={{ min: 0 }}
            />
          )}

          <FormControl fullWidth>
            <InputLabel>Статус</InputLabel>
            <Select
              name="enabled"
              value={updatedData.enabled ? "true" : "false"}
              label="Статус"
              onChange={(e) =>
                setUpdatedData((prev) => ({
                  ...prev,
                  enabled: e.target.value === "true",
                }))
              }
            >
              <MenuItem value="true">Включено</MenuItem>
              <MenuItem value="false">Выключено</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={isSubmitting}
        >
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
};
