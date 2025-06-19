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
} from "@mui/material";
import { ISchedule } from "../../api/schedulesApi";

interface EditScheduleModalProps {
  open: boolean;
  onClose: () => void;
  schedule: ISchedule;
  onUpdate: (data: {
    schedule_id: string;
    updatedData: Partial<ISchedule>;
  }) => Promise<void>;
  isSubmitting: boolean;
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

export const EditScheduleModal: React.FC<EditScheduleModalProps> = ({
  open,
  onClose,
  schedule,
  onUpdate,
  isSubmitting,
}) => {
  const [updatedData, setUpdatedData] = React.useState<Partial<ISchedule>>({
    enabled: schedule.enabled,
  });
  const [selectedDays, setSelectedDays] = React.useState<number[]>([]);
  const [cronTime, setCronTime] = React.useState<string>("09:00");

  React.useEffect(() => {
    if (schedule.schedule_type === "cron" && schedule.cron_expression) {
      // Парсим cron выражение для получения дней и времени
      const parts = schedule.cron_expression.split(" ");
      if (parts.length >= 5) {
        setCronTime(`${parts[1]}:${parts[0]}`);
        setSelectedDays(parts[4].split(",").map(Number));
      }
    }
  }, [schedule]);

  const handleSubmit = async () => {
    try {
      await onUpdate({
        schedule_id: schedule.schedule_id,
        updatedData: {
          ...updatedData,
          cron_expression:
            schedule.schedule_type === "cron"
              ? generateCronExpression(cronTime, selectedDays)
              : undefined,
        },
      });
      onClose();
    } catch (error) {
      console.error("Error updating schedule:", error);
    }
  };

  const handleToggleDay = (dayId: number) => {
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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Редактировать расписание</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Статус</InputLabel>
            <Select
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

          {schedule.schedule_type === "interval" && (
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                label="Интервал (часы)"
                type="number"
                value={
                  updatedData.interval_hours ?? schedule.interval_hours ?? ""
                }
                onChange={(e) =>
                  setUpdatedData((prev) => ({
                    ...prev,
                    interval_hours: parseInt(e.target.value) || undefined,
                  }))
                }
              />
              <TextField
                fullWidth
                label="Интервал (минуты)"
                type="number"
                value={
                  updatedData.interval_minutes ??
                  schedule.interval_minutes ??
                  ""
                }
                onChange={(e) =>
                  setUpdatedData((prev) => ({
                    ...prev,
                    interval_minutes: parseInt(e.target.value) || undefined,
                  }))
                }
              />
            </Box>
          )}

          {schedule.schedule_type === "daily_time" && (
            <TextField
              fullWidth
              label="Время выполнения (HH:MM)"
              type="time"
              value={
                updatedData.time_of_day ??
                schedule.time_of_day?.substring(11, 16) ??
                ""
              }
              onChange={(e) =>
                setUpdatedData((prev) => ({
                  ...prev,
                  time_of_day: `2000-01-01T${e.target.value}:00Z`,
                }))
              }
              InputLabelProps={{ shrink: true }}
            />
          )}

          {schedule.schedule_type === "once" && (
            <TextField
              fullWidth
              label="Время выполнения"
              type="datetime-local"
              value={
                updatedData.run_at
                  ? new Date(updatedData.run_at).toISOString().slice(0, 16)
                  : schedule.run_at
                  ? new Date(schedule.run_at).toISOString().slice(0, 16)
                  : ""
              }
              onChange={(e) =>
                setUpdatedData((prev) => ({
                  ...prev,
                  run_at: new Date(e.target.value).toISOString(),
                }))
              }
              InputLabelProps={{ shrink: true }}
            />
          )}

          {schedule.schedule_type === "cron" && (
            <>
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
                    onClick={() => handleToggleDay(day.id)}
                    variant={
                      selectedDays.includes(day.id) ? "filled" : "outlined"
                    }
                  />
                ))}
              </Stack>
            </>
          )}
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
