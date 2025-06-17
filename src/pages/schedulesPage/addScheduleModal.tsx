import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  CircularProgress,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  FormControlLabel,
  Chip,
  Stack,
} from "@mui/material";
import { useCreateSchedule } from "../../hooks/schedules/useScheduleMutations";
import { useCompaniesQuery } from "../../hooks/companies/useCompaniesQuery";
import { usePromptsQuery } from "../../hooks/prompts/usePromptsQuery";
import { useBotsQuery } from "../../hooks/bots/useBotsQuery";
import { useChatsQuery } from "../../hooks/chats/useChatsQuery";
import { enqueueSnackbar } from "notistack";

interface AddScheduleModalProps {
  open: boolean;
  onClose: () => void;
}

const daysOfWeek = [
  { id: 1, name: "Понедельник" },
  { id: 2, name: "Вторник" },
  { id: 3, name: "Среда" },
  { id: 4, name: "Четверг" },
  { id: 5, name: "Пятница" },
  { id: 6, name: "Суббота" },
  { id: 0, name: "Воскресенье" },
];

const generateCronExpression = (time: string, selectedDays: number[]) => {
  if (!time || selectedDays.length === 0) return "";

  const [hours, minutes] = time.split(":");
  const daysPart = selectedDays.join(",");

  return `${minutes} ${hours} * * ${daysPart}`;
};

export const AddScheduleModal: React.FC<AddScheduleModalProps> = ({
  open,
  onClose,
}) => {
  const [scheduleData, setScheduleData] = useState<{
    chat_id: string;
    prompt_id: string;
    company_id: string;
    schedule_type: "interval" | "cron" | "once";
    interval_hours?: number;
    interval_minutes?: number;
    time_of_day?: string;
    cron_expression?: string;
    enabled: boolean;
    bot_id: string;
    target_chats: number[];
    send_strategy: "fixed" | "relative";
    time_to_send?: string;
    send_after_minutes?: number;
  }>({
    chat_id: "",
    prompt_id: "",
    company_id: "",
    schedule_type: "interval",
    enabled: true,
    bot_id: "",
    target_chats: [],
    send_strategy: "fixed",
  });

  const [cronTime, setCronTime] = useState<string>("09:00");
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const createSchedule = useCreateSchedule();

  const {
    data: companiesData,
    isLoading: companiesLoading,
    error: companiesError,
  } = useCompaniesQuery();
  const {
    data: promptsData,
    isLoading: promptsLoading,
    error: promptsError,
  } = usePromptsQuery();
  const {
    data: botsData,
    isLoading: botsLoading,
    error: botsError,
  } = useBotsQuery();
  const {
    data: chatsData,
    isLoading: chatsLoading,
    error: chatsError,
  } = useChatsQuery();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setScheduleData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: { target: { name: string; value: any } }) => {
    const { name, value } = e.target;
    setScheduleData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChatToggle = (chatId: number) => () => {
    setScheduleData((prev) => {
      const newTargetChats = [...prev.target_chats];
      const chatIndex = newTargetChats.indexOf(chatId);

      if (chatIndex === -1) {
        newTargetChats.push(chatId);
      } else {
        newTargetChats.splice(chatIndex, 1);
      }

      return {
        ...prev,
        target_chats: newTargetChats,
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

  const validateFields = () => {
    const newErrors: Record<string, string> = {};

    if (!scheduleData.chat_id) newErrors.chat_id = "Чат обязателен";
    if (!scheduleData.prompt_id) newErrors.prompt_id = "Промпт обязателен";
    if (!scheduleData.company_id) newErrors.company_id = "Компания обязательна";
    if (!scheduleData.bot_id) newErrors.bot_id = "Бот обязателен";
    if (scheduleData.target_chats.length === 0)
      newErrors.target_chats = "Необходимо выбрать хотя бы один чат";

    if (scheduleData.schedule_type === "interval") {
      if (!scheduleData.interval_hours && !scheduleData.interval_minutes) {
        newErrors.interval = "Укажите интервал (часы или минуты)";
      }
    } else if (
      scheduleData.schedule_type === "cron" &&
      (selectedDays.length === 0 || !cronTime)
    ) {
      newErrors.cron_expression = "Выберите дни и время";
    } else if (
      scheduleData.schedule_type === "once" &&
      !scheduleData.time_of_day
    ) {
      newErrors.time_of_day = "Время обязательно";
    }

    if (scheduleData.send_strategy === "fixed" && !scheduleData.time_to_send) {
      newErrors.time_to_send = "Время отправки обязательно";
    } else if (
      scheduleData.send_strategy === "relative" &&
      !scheduleData.send_after_minutes
    ) {
      newErrors.send_after_minutes = "Интервал отправки обязателен";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateFields()) return;

    try {
      await createSchedule.mutateAsync({
        chat_id: parseInt(scheduleData.chat_id),
        prompt_id: scheduleData.prompt_id,
        company_id: scheduleData.company_id,
        schedule_type: scheduleData.schedule_type,
        interval_hours:
          scheduleData.schedule_type === "interval"
            ? Number(scheduleData.interval_hours)
            : undefined,
        interval_minutes:
          scheduleData.schedule_type === "interval"
            ? Number(scheduleData.interval_minutes)
            : undefined,
        time_of_day:
          scheduleData.schedule_type === "once"
            ? scheduleData.time_of_day
            : undefined,
        cron_expression:
          scheduleData.schedule_type === "cron"
            ? generateCronExpression(cronTime, selectedDays)
            : undefined,
        enabled: scheduleData.enabled,
        bot_id: parseInt(scheduleData.bot_id),
        target_chats: scheduleData.target_chats,
        send_strategy: scheduleData.send_strategy,
        time_to_send:
          scheduleData.send_strategy === "fixed"
            ? scheduleData.time_to_send
            : undefined,
        send_after_minutes:
          scheduleData.send_strategy === "relative"
            ? Number(scheduleData.send_after_minutes)
            : undefined,
      });

      enqueueSnackbar("Расписание успешно создано", { variant: "success" });
      onClose();
      setScheduleData({
        chat_id: "",
        prompt_id: "",
        company_id: "",
        schedule_type: "interval",
        enabled: true,
        bot_id: "",
        target_chats: [],
        send_strategy: "fixed",
      });
      setCronTime("09:00");
      setSelectedDays([1, 2, 3, 4, 5]);
    } catch (error) {
      enqueueSnackbar("Ошибка при создании расписания", { variant: "error" });
      console.error("Error creating schedule:", error);
    }
  };

  if (companiesLoading || promptsLoading || botsLoading || chatsLoading) {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Добавить новое расписание</DialogTitle>
        <DialogContent>
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  if (companiesError || promptsError || botsError || chatsError) {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Добавить новое расписание</DialogTitle>
        <DialogContent>
          <Typography color="error">
            Ошибка при загрузке данных:{" "}
            {
              (companiesError || promptsError || botsError || chatsError)
                ?.message
            }
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Закрыть</Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Добавить новое расписание</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <TextField
            fullWidth
            label="ID чата (число)"
            name="chat_id"
            value={scheduleData.chat_id}
            onChange={handleChange}
            error={!!errors.chat_id}
            helperText={errors.chat_id}
            required
          />

          <FormControl fullWidth required error={!!errors.prompt_id}>
            <InputLabel>Промпт</InputLabel>
            <Select
              name="prompt_id"
              value={scheduleData.prompt_id}
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

          <FormControl fullWidth required error={!!errors.company_id}>
            <InputLabel>Компания</InputLabel>
            <Select
              name="company_id"
              value={scheduleData.company_id}
              label="Компания"
              onChange={handleSelectChange}
            >
              {companiesData?.companies.map((company) => (
                <MenuItem key={company.company_id} value={company.company_id}>
                  {company.company_name}
                </MenuItem>
              ))}
            </Select>
            {errors.company_id && (
              <Typography variant="caption" color="error">
                {errors.company_id}
              </Typography>
            )}
          </FormControl>

          <FormControl fullWidth required error={!!errors.bot_id}>
            <InputLabel>Бот</InputLabel>
            <Select
              name="bot_id"
              value={scheduleData.bot_id}
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
              <List dense>
                {chatsData?.chats.map((chat) => (
                  <ListItem key={chat.chat_id}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={scheduleData.target_chats.includes(
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
            </Box>
            {errors.target_chats && (
              <Typography variant="caption" color="error">
                {errors.target_chats}
              </Typography>
            )}
          </FormControl>

          <FormControl fullWidth required>
            <InputLabel>Тип расписания</InputLabel>
            <Select
              name="schedule_type"
              value={scheduleData.schedule_type}
              label="Тип расписания"
              onChange={handleSelectChange}
            >
              <MenuItem value="interval">Интервал</MenuItem>
              <MenuItem value="cron">Повторяющееся</MenuItem>
              <MenuItem value="once">Одноразово</MenuItem>
            </Select>
          </FormControl>

          {scheduleData.schedule_type === "interval" && (
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                label="Интервал (часы)"
                name="interval_hours"
                type="number"
                value={scheduleData.interval_hours || ""}
                onChange={handleChange}
                error={!!errors.interval}
                helperText={errors.interval}
              />
              <TextField
                fullWidth
                label="Интервал (минуты)"
                name="interval_minutes"
                type="number"
                value={scheduleData.interval_minutes || ""}
                onChange={handleChange}
              />
            </Box>
          )}

          {scheduleData.schedule_type === "cron" && (
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

              {/* <Typography variant="body2" color="textSecondary">
                Cron выражение:{" "}
                {generateCronExpression(cronTime, selectedDays) || "не задано"}
              </Typography> */}

              {errors.cron_expression && (
                <Typography variant="caption" color="error">
                  {errors.cron_expression}
                </Typography>
              )}
            </Box>
          )}

          {scheduleData.schedule_type === "once" && (
            <TextField
              fullWidth
              label="Время выполнения (HH:MM)"
              name="time_of_day"
              type="time"
              value={scheduleData.time_of_day || ""}
              onChange={handleChange}
              error={!!errors.time_of_day}
              helperText={errors.time_of_day}
              required
              InputLabelProps={{ shrink: true }}
            />
          )}

          <FormControl fullWidth required>
            <InputLabel>Стратегия отправки</InputLabel>
            <Select
              name="send_strategy"
              value={scheduleData.send_strategy}
              label="Стратегия отправки"
              onChange={handleSelectChange}
            >
              <MenuItem value="fixed">Фиксированное время</MenuItem>
              <MenuItem value="relative">
                Относительно времени выполнения
              </MenuItem>
            </Select>
          </FormControl>

          {scheduleData.send_strategy === "fixed" && (
            <TextField
              fullWidth
              label="Время отправки (HH:MM)"
              name="time_to_send"
              type="time"
              value={scheduleData.time_to_send || ""}
              onChange={handleChange}
              error={!!errors.time_to_send}
              helperText={errors.time_to_send}
              required
              InputLabelProps={{ shrink: true }}
            />
          )}

          {scheduleData.send_strategy === "relative" && (
            <TextField
              fullWidth
              label="Отправить через (минуты)"
              name="send_after_minutes"
              type="number"
              value={scheduleData.send_after_minutes || ""}
              onChange={handleChange}
              error={!!errors.send_after_minutes}
              helperText={errors.send_after_minutes}
              required
            />
          )}

          <FormControl fullWidth>
            <InputLabel>Статус</InputLabel>
            <Select
              name="enabled"
              value={scheduleData.enabled ? "true" : "false"}
              label="Статус"
              onChange={(e) =>
                setScheduleData((prev) => ({
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
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Создать
        </Button>
      </DialogActions>
    </Dialog>
  );
};
