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
} from "@mui/material";
import { useCreateSchedule } from "../../hooks/schedules/useScheduleMutations";
import { useCompaniesQuery } from "../../hooks/companies/useCompaniesQuery";
import { usePromptsQuery } from "../../hooks/prompts/usePromptsQuery";
import { enqueueSnackbar } from "notistack";

interface AddScheduleModalProps {
  open: boolean;
  onClose: () => void;
}

export const AddScheduleModal: React.FC<AddScheduleModalProps> = ({
  open,
  onClose,
}) => {
  const [scheduleData, setScheduleData] = useState<{
    chat: string;
    prompt: string;
    company: string;
    schedule_type: "interval" | "cron" | "once";
    interval_hours?: number;
    interval_minutes?: number;
    time_of_day?: string;
    cron_expression?: string;
    enabled: boolean;
    bot: string;
    target_chats: string;
    send_strategy: "fixed" | "relative";
    time_to_send?: string;
    send_after_minutes?: number;
  }>({
    chat: "",
    prompt: "",
    company: "",
    schedule_type: "interval",
    enabled: true,
    bot: "",
    target_chats: "",
    send_strategy: "fixed",
  });

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

  const validateFields = () => {
    const newErrors: Record<string, string> = {};

    if (!scheduleData.chat) newErrors.chat = "Чат обязателен";
    if (!scheduleData.prompt) newErrors.prompt = "Промпт обязателен";
    if (!scheduleData.company) newErrors.company = "Компания обязательна";
    if (!scheduleData.bot) newErrors.bot = "Бот обязателен";
    if (!scheduleData.target_chats)
      newErrors.target_chats = "Целевые чаты обязательны";

    if (scheduleData.schedule_type === "interval") {
      if (!scheduleData.interval_hours && !scheduleData.interval_minutes) {
        newErrors.interval = "Укажите интервал (часы или минуты)";
      }
    } else if (
      scheduleData.schedule_type === "cron" &&
      !scheduleData.cron_expression
    ) {
      newErrors.cron_expression = "Cron выражение обязательно";
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
      const targetChatsArray = scheduleData.target_chats
        .split(",")
        .map((chat) => parseInt(chat.trim()));

      await createSchedule.mutateAsync({
        chat: parseInt(scheduleData.chat),
        prompt: scheduleData.prompt,
        company: scheduleData.company,
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
            ? scheduleData.cron_expression
            : undefined,
        enabled: scheduleData.enabled,
        bot: parseInt(scheduleData.bot),
        target_chats: targetChatsArray,
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
        chat: "",
        prompt: "",
        company: "",
        schedule_type: "interval",
        enabled: true,
        bot: "",
        target_chats: "",
        send_strategy: "fixed",
      });
    } catch (error) {
      enqueueSnackbar("Ошибка при создании расписания", { variant: "error" });
      console.error("Error creating schedule:", error);
    }
  };

  if (companiesLoading || promptsLoading) {
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

  if (companiesError || promptsError) {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Добавить новое расписание</DialogTitle>
        <DialogContent>
          <Typography color="error">
            Ошибка при загрузке данных:{" "}
            {(companiesError || promptsError)?.message}
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
            name="chat"
            value={scheduleData.chat}
            onChange={handleChange}
            error={!!errors.chat}
            helperText={errors.chat}
            required
          />

          <FormControl fullWidth required error={!!errors.prompt}>
            <InputLabel>Промпт</InputLabel>
            <Select
              name="prompt"
              value={scheduleData.prompt}
              label="Промпт"
              onChange={handleSelectChange}
            >
              {promptsData?.prompts.map((prompt) => (
                <MenuItem key={prompt.prompt_id} value={prompt.prompt_id}>
                  {prompt.prompt_name || prompt.prompt_id}
                </MenuItem>
              ))}
            </Select>
            {errors.prompt && (
              <Typography variant="caption" color="error">
                {errors.prompt}
              </Typography>
            )}
          </FormControl>

          <FormControl fullWidth required error={!!errors.company}>
            <InputLabel>Компания</InputLabel>
            <Select
              name="company"
              value={scheduleData.company}
              label="Компания"
              onChange={handleSelectChange}
            >
              {companiesData?.companies.map((company) => (
                <MenuItem key={company.company_id} value={company.company_id}>
                  {company.company_name}
                </MenuItem>
              ))}
            </Select>
            {errors.company && (
              <Typography variant="caption" color="error">
                {errors.company}
              </Typography>
            )}
          </FormControl>

          <TextField
            fullWidth
            label="ID бота (число)"
            name="bot"
            value={scheduleData.bot}
            onChange={handleChange}
            error={!!errors.bot}
            helperText={errors.bot}
            required
          />

          <TextField
            fullWidth
            label="Целевые чаты (через запятую, числа)"
            name="target_chats"
            value={scheduleData.target_chats}
            onChange={handleChange}
            error={!!errors.target_chats}
            helperText={errors.target_chats || "Например: 123, 456, 789"}
            required
          />

          <FormControl fullWidth required>
            <InputLabel>Тип расписания</InputLabel>
            <Select
              name="schedule_type"
              value={scheduleData.schedule_type}
              label="Тип расписания"
              onChange={handleSelectChange}
            >
              <MenuItem value="interval">Интервал</MenuItem>
              <MenuItem value="cron">Cron</MenuItem>
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
            <TextField
              fullWidth
              label="Cron выражение"
              name="cron_expression"
              value={scheduleData.cron_expression || ""}
              onChange={handleChange}
              error={!!errors.cron_expression}
              helperText={
                errors.cron_expression ||
                "Например: 0 9 * * 1-5 (каждый будний день в 9:00)"
              }
              required
            />
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
