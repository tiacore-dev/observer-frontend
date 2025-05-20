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
  CircularProgress,
  Typography,
} from "@mui/material";
import { useCreateSchedule } from "../../hooks/schedules/useScheduleMutations";
import { useCompaniesQuery } from "../../hooks/companies/useCompaniesQuery";
import { useBotsQuery } from "../../hooks/bots/useBotsQuery";

interface AddScheduleModalProps {
  open: boolean;
  onClose: () => void;
}

export const AddScheduleModal: React.FC<AddScheduleModalProps> = ({
  open,
  onClose,
}) => {
  const [scheduleData, setScheduleData] = useState({
    chat: "",
    prompt: "",
    company: "",
    schedule_type: "interval",
    interval_hours: 0,
    interval_minutes: 0,
    enabled: true,
    send_strategy: "immediately",
    bot: "",
    target_chats: [] as number[],
  });

  const createSchedule = useCreateSchedule();
  const {
    data: companiesData,
    isLoading: companiesLoading,
    error: companiesError,
  } = useCompaniesQuery();
  const {
    data: botsData,
    isLoading: botsLoading,
    error: botsError,
  } = useBotsQuery();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setScheduleData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setScheduleData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMultiSelectChange = (e: any) => {
    const { value } = e.target;
    setScheduleData((prev) => ({ ...prev, target_chats: value as number[] }));
  };

  const [errors, setErrors] = useState({
    chat: "",
    prompt: "",
    company: "",
    bot: "",
  });

  const handleSubmit = async () => {
    const newErrors = {
      chat: !scheduleData.chat ? "Чат обязателен" : "",
      prompt: !scheduleData.prompt ? "Промпт обязателен" : "",
      company: !scheduleData.company ? "Компания обязательна" : "",
      bot: !scheduleData.bot ? "Бот обязателен" : "",
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((e) => e)) return;

    try {
      await createSchedule.mutateAsync({
        ...scheduleData,
        chat: Number(scheduleData.chat),
        bot: Number(scheduleData.bot),
        interval_hours: Number(scheduleData.interval_hours),
        interval_minutes: Number(scheduleData.interval_minutes),
      });
      onClose();
      setScheduleData({
        chat: "",
        prompt: "",
        company: "",
        schedule_type: "interval",
        interval_hours: 0,
        interval_minutes: 0,
        enabled: true,
        send_strategy: "immediately",
        bot: "",
        target_chats: [],
      });
    } catch (error) {
      console.error("Error creating schedule:", error);
    }
  };

  const isLoading = companiesLoading || botsLoading;
  const error = companiesError || botsError;

  if (isLoading) {
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

  if (error) {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Добавить новое расписание</DialogTitle>
        <DialogContent>
          <Typography color="error">
            Ошибка при загрузке данных: {(error as Error).message}
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
            label="ID чата"
            name="chat"
            value={scheduleData.chat}
            onChange={handleChange}
            error={!!errors.chat}
            helperText={errors.chat}
            required
            type="number"
          />

          <TextField
            fullWidth
            label="Промпт"
            name="prompt"
            value={scheduleData.prompt}
            onChange={handleChange}
            error={!!errors.prompt}
            helperText={errors.prompt}
            required
            multiline
            rows={3}
          />

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

          <FormControl fullWidth>
            <InputLabel>Тип расписания</InputLabel>
            <Select
              name="schedule_type"
              value={scheduleData.schedule_type}
              label="Тип расписания"
              onChange={handleSelectChange}
            >
              <MenuItem value="interval">Интервал</MenuItem>
              <MenuItem value="time_of_day">Время дня</MenuItem>
              <MenuItem value="cron">Cron выражение</MenuItem>
            </Select>
          </FormControl>

          {scheduleData.schedule_type === "interval" && (
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                label="Часы"
                name="interval_hours"
                value={scheduleData.interval_hours}
                onChange={handleChange}
                type="number"
                inputProps={{ min: 0 }}
              />
              <TextField
                fullWidth
                label="Минуты"
                name="interval_minutes"
                value={scheduleData.interval_minutes}
                onChange={handleChange}
                type="number"
                inputProps={{ min: 0, max: 59 }}
              />
            </Box>
          )}

          <FormControl fullWidth>
            <InputLabel>Стратегия отправки</InputLabel>
            <Select
              name="send_strategy"
              value={scheduleData.send_strategy}
              label="Стратегия отправки"
              onChange={handleSelectChange}
            >
              <MenuItem value="immediately">Немедленно</MenuItem>
              <MenuItem value="delayed">Отложенная</MenuItem>
              <MenuItem value="scheduled">По расписанию</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth required error={!!errors.bot}>
            <InputLabel>Бот</InputLabel>
            <Select
              name="bot"
              value={scheduleData.bot}
              label="Бот"
              onChange={handleSelectChange}
            >
              {botsData?.bots.map((bot) => (
                <MenuItem key={bot.bot_id} value={bot.bot_id}>
                  {bot.bot_username} ({bot.bot_first_name})
                </MenuItem>
              ))}
            </Select>
            {errors.bot && (
              <Typography variant="caption" color="error">
                {errors.bot}
              </Typography>
            )}
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Целевые чаты</InputLabel>
            <Select
              multiple
              value={scheduleData.target_chats}
              onChange={handleMultiSelectChange}
              renderValue={(selected) => (selected as number[]).join(", ")}
            >
              {botsData?.bots.map((bot) => (
                <MenuItem key={bot.bot_id} value={bot.bot_id}>
                  {bot.bot_username} ({bot.bot_first_name})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={
            !scheduleData.chat ||
            !scheduleData.prompt ||
            !scheduleData.company ||
            !scheduleData.bot
          }
        >
          Создать
        </Button>
      </DialogActions>
    </Dialog>
  );
};
