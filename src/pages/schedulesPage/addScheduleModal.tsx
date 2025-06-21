import React, { useState, useEffect } from "react";
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
  Chip,
  Stack,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";
import { useCreateSchedule } from "../../hooks/schedules/useScheduleMutations";
import { useCompaniesQuery } from "../../hooks/companies/useCompaniesQuery";
import { usePromptsQuery } from "../../hooks/prompts/usePromptsQuery";
import { useBotsQuery } from "../../hooks/bots/useBotsQuery";
import { useChatsQuery } from "../../hooks/chats/useChatsQuery";
import { enqueueSnackbar } from "notistack";
import { format, parse, isBefore } from "date-fns";
import { ru } from "date-fns/locale";
import { ModalSkeleton } from "../../components/skeleton/modalSkeleton";

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

export const generateCronExpression = (
  time: string,
  selectedDays: number[]
) => {
  if (!time || selectedDays.length === 0) return "";

  const [hours, minutes] = time.split(":");
  const daysPart = selectedDays.join(",");

  return `${minutes} ${hours} * * ${daysPart}`;
};

const convertLocalTimeToUTC = (timeString: string) => {
  if (!timeString) return "";

  try {
    const [hours, minutes] = timeString.split(":");
    const localDate = new Date();
    localDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

    const utcHours = localDate.getUTCHours().toString().padStart(2, "0");
    const utcMinutes = localDate.getUTCMinutes().toString().padStart(2, "0");

    return `${utcHours}:${utcMinutes}`;
  } catch (error) {
    console.error("Error converting time to UTC:", error);
    return timeString;
  }
};

const formatDateRussian = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return format(date, "dd/MM/yyyy", { locale: ru });
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
};

export const AddScheduleModal: React.FC<AddScheduleModalProps> = ({
  open,
  onClose,
}) => {
  const [scheduleData, setScheduleData] = useState<{
    chat_id: string;
    prompt_id: string;
    company_id: string;
    schedule_type: "interval" | "cron" | "once" | "daily_time";
    interval_hours?: number;
    interval_minutes?: number;
    time_of_day?: string;
    cron_expression?: string;
    run_at?: string;
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
    refetch: refetchChats,
  } = useChatsQuery(
    scheduleData.bot_id ? parseInt(scheduleData.bot_id) : undefined
  );

  const isLoadingAll = companiesLoading || promptsLoading || botsLoading;

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

    setScheduleData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: { target: { name: string; value: any } }) => {
    const { name, value } = e.target;

    if (name === "bot_id") {
      setScheduleData((prev) => ({
        ...prev,
        [name]: value,
        chat_id: "",
        target_chats: [],
      }));
    } else {
      setScheduleData((prev) => ({ ...prev, [name]: value }));
    }
  };

  useEffect(() => {
    if (scheduleData.bot_id && open) {
      refetchChats();
    }
  }, [scheduleData.bot_id, open, refetchChats]);

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
    const now = new Date();

    if (!scheduleData.bot_id) newErrors.bot_id = "Бот обязателен";
    if (!scheduleData.chat_id) newErrors.chat_id = "Чат обязателен";
    if (!scheduleData.prompt_id) newErrors.prompt_id = "Промпт обязателен";
    if (!scheduleData.company_id) newErrors.company_id = "Компания обязательна";
    if (scheduleData.target_chats.length === 0)
      newErrors.target_chats = "Необходимо выбрать хотя бы один чат";

    if (scheduleData.schedule_type === "interval") {
      if (!scheduleData.interval_hours && !scheduleData.interval_minutes) {
        newErrors.interval = "Укажите интервал (часы или минуты)";
      } else {
        if (scheduleData.interval_hours && scheduleData.interval_hours < 0) {
          newErrors.interval_hours = "Часы не могут быть отрицательными";
        }
        if (
          scheduleData.interval_minutes &&
          scheduleData.interval_minutes < 0
        ) {
          newErrors.interval_minutes = "Минуты не могут быть отрицательными";
        }
      }
    } else if (scheduleData.schedule_type === "cron") {
      if (selectedDays.length === 0 || !cronTime) {
        newErrors.cron_expression = "Выберите дни и время";
      }
    } else if (scheduleData.schedule_type === "once") {
      if (!scheduleData.run_at) {
        newErrors.run_at = "Время выполнения обязательно";
      } else {
        const selectedDateTime = new Date(scheduleData.run_at);
        if (isBefore(selectedDateTime, now)) {
          newErrors.run_at = "Нельзя выбрать прошедшую дату/время";
        }
      }
    } else if (scheduleData.schedule_type === "daily_time") {
      if (!scheduleData.time_of_day) {
        newErrors.time_of_day = "Время выполнения обязательно";
      }
    }

    if (scheduleData.send_strategy === "fixed" && !scheduleData.time_to_send) {
      newErrors.time_to_send = "Время отправки обязательно";
    } else if (
      scheduleData.send_strategy === "relative" &&
      !scheduleData.send_after_minutes
    ) {
      newErrors.send_after_minutes = "Интервал отправки обязателен";
    } else if (
      scheduleData.send_strategy === "relative" &&
      scheduleData.send_after_minutes !== undefined &&
      scheduleData.send_after_minutes < 0
    ) {
      newErrors.send_after_minutes = "Интервал не может быть отрицательным";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateFields()) return;

    try {
      const utcTimeOfDay = scheduleData.time_of_day
        ? convertLocalTimeToUTC(scheduleData.time_of_day)
        : undefined;
      const utcRunAt = scheduleData.run_at
        ? convertLocalTimeToUTC(scheduleData.run_at)
        : undefined;
      const utcTimeToSend = scheduleData.time_to_send
        ? convertLocalTimeToUTC(scheduleData.time_to_send)
        : undefined;

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
          scheduleData.schedule_type === "daily_time"
            ? `${new Date().toISOString().split("T")[0]}T${utcTimeOfDay}:00Z`
            : undefined,
        cron_expression:
          scheduleData.schedule_type === "cron"
            ? generateCronExpression(cronTime, selectedDays)
            : undefined,
        run_at:
          scheduleData.schedule_type === "once"
            ? `${new Date().toISOString().split("T")[0]}T${utcRunAt}:00Z`
            : undefined,
        enabled: scheduleData.enabled,
        bot_id: parseInt(scheduleData.bot_id),
        target_chats: scheduleData.target_chats,
        send_strategy: scheduleData.send_strategy,
        time_to_send:
          scheduleData.send_strategy === "fixed"
            ? `${new Date().toISOString().split("T")[0]}T${utcTimeToSend}:00Z`
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

  if (isLoadingAll) {
    return <ModalSkeleton fieldCount={8} hasActions />;
  }

  if (companiesError || promptsError || botsError) {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Добавить новое расписание</DialogTitle>
        <DialogContent>
          <Typography color="error">
            Ошибка при загрузке данных:{" "}
            {(companiesError || promptsError || botsError)?.message}
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

          {scheduleData.bot_id && (
            <>
              <FormControl fullWidth required error={!!errors.chat_id}>
                <InputLabel>Анализируемый чат</InputLabel>
                <Select
                  name="chat_id"
                  value={scheduleData.chat_id}
                  label="Анализируемый чат"
                  onChange={handleSelectChange}
                  disabled={chatsLoading}
                >
                  {chatsData?.chats.map((chat) => (
                    <MenuItem
                      key={chat.chat_id}
                      value={chat.chat_id.toString()}
                    >
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
                    <MenuItem
                      key={company.company_id}
                      value={company.company_id}
                    >
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
                  )}
                </Box>
                {errors.target_chats && (
                  <Typography variant="caption" color="error">
                    {errors.target_chats}
                  </Typography>
                )}
              </FormControl>
            </>
          )}

          <FormControl fullWidth required>
            <InputLabel>Тип расписания</InputLabel>
            <Select
              name="schedule_type"
              value={scheduleData.schedule_type}
              label="Тип расписания"
              onChange={handleSelectChange}
            >
              <MenuItem value="interval">Интервал</MenuItem>
              <MenuItem value="cron">Повторяющееся (Cron)</MenuItem>
              <MenuItem value="once">Одноразово</MenuItem>
              <MenuItem value="daily_time">Ежедневно</MenuItem>
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
                error={!!errors.interval || !!errors.interval_hours}
                helperText={errors.interval || errors.interval_hours}
                inputProps={{ min: 0 }}
              />
              <TextField
                fullWidth
                label="Интервал (минуты)"
                name="interval_minutes"
                type="number"
                value={scheduleData.interval_minutes || ""}
                onChange={handleChange}
                error={!!errors.interval_minutes}
                helperText={errors.interval_minutes}
                inputProps={{ min: 0 }}
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
              label="Время выполнения"
              name="run_at"
              type="datetime-local"
              value={scheduleData.run_at || ""}
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

          {scheduleData.schedule_type === "daily_time" && (
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
              inputProps={{ min: 0 }}
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
