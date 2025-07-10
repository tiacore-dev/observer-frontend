import type React from "react";
import { Box, TextField } from "@mui/material";
import { DaySelector } from "./daySelector";
import {
  convertToServerTime,
  convertToLocalTime,
  localToServerDatetime,
  serverToLocalDatetime,
} from "../helpers/scheduleUtils";

interface ScheduleTypeFieldsProps {
  scheduleType: "interval" | "cron" | "once" | "daily_time";
  intervalHours?: string;
  intervalMinutes?: string;
  timeOfDay?: string; // Локальное время (HH:MM)
  runAt?: string; // Локальная дата-время (YYYY-MM-DDTHH:MM)
  cronTime: string; // Локальное время (HH:MM)
  selectedDays: number[];
  errors: Record<string, string>;
  disabled?: boolean;
  tooltipMessage?: string;
  onFieldChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCronTimeChange: (time: string) => void;
  onToggleDay: (dayId: number) => void;
}

export const ScheduleTypeFields: React.FC<ScheduleTypeFieldsProps> = ({
  scheduleType,
  intervalHours,
  intervalMinutes,
  timeOfDay,
  runAt,
  cronTime,
  selectedDays,
  errors,
  disabled = false,
  tooltipMessage,
  onFieldChange,
  onCronTimeChange,
  onToggleDay,
}) => {
  const renderWithTooltip = (element: React.ReactElement) => {
    return disabled && tooltipMessage ? (
      <div title={tooltipMessage}>{element}</div>
    ) : (
      element
    );
  };

  // Обработчик для числовых полей (часы/минуты)
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Разрешаем только цифры или пустую строку
    if (value === "" || /^\d+$/.test(value)) {
      // Дополнительная проверка для минут (0-59)
      if (name === "interval_minutes") {
        const numValue = Number.parseInt(value);
        if (value !== "" && (numValue < 0 || numValue > 59)) {
          return;
        }
      }
      onFieldChange(e);
    }
  };

  // Блокировка нечисловых символов
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = [
      "Backspace",
      "Delete",
      "Tab",
      "Escape",
      "Enter",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "Home",
      "End",
    ];

    if (e.ctrlKey && ["a", "c", "v", "x", "z"].includes(e.key.toLowerCase())) {
      return;
    }

    if (!allowedKeys.includes(e.key) && !/^[0-9]$/.test(e.key)) {
      e.preventDefault();
    }
  };

  // Блокировка нечислового вставления
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData("text");
    if (!/^\d*$/.test(pastedText)) {
      e.preventDefault();
    }
  };

  switch (scheduleType) {
    case "interval":
      return renderWithTooltip(
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            fullWidth
            label="Интервал (часы)"
            name="interval_hours"
            type="text"
            value={intervalHours || ""}
            onChange={handleNumberChange}
            onKeyDown={handleKeyPress}
            onPaste={handlePaste}
            error={!!errors.interval || !!errors.interval_hours}
            helperText={
              errors.interval ||
              errors.interval_hours ||
              "Только целые положительные числа"
            }
            inputProps={{
              inputMode: "numeric",
              pattern: "[0-9]*",
            }}
            disabled={disabled}
          />
          <TextField
            fullWidth
            label="Интервал (минуты)"
            name="interval_minutes"
            type="text"
            value={intervalMinutes || ""}
            onChange={handleNumberChange}
            onKeyDown={handleKeyPress}
            onPaste={handlePaste}
            error={!!errors.interval_minutes}
            helperText={errors.interval_minutes || "От 0 до 59 минут"}
            inputProps={{
              inputMode: "numeric",
              pattern: "[0-9]*",
            }}
            disabled={disabled}
          />
        </Box>
      );

    case "cron":
      return renderWithTooltip(
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            fullWidth
            label="Время выполнения (HH:MM)"
            type="time"
            value={cronTime}
            onChange={(e) => onCronTimeChange(e.target.value)}
            InputLabelProps={{ shrink: true }}
            disabled={disabled}
          />
          <DaySelector
            selectedDays={selectedDays}
            onToggleDay={onToggleDay}
            disabled={disabled}
            error={errors.cron_expression}
            tooltipMessage={tooltipMessage}
          />
        </Box>
      );

    case "once":
      return renderWithTooltip(
        <TextField
          fullWidth
          label="Время выполнения"
          name="run_at"
          type="datetime-local"
          value={runAt || ""}
          onChange={onFieldChange}
          error={!!errors.run_at}
          helperText={errors.run_at}
          required
          InputLabelProps={{ shrink: true }}
          inputProps={{
            min: new Date().toISOString().slice(0, 16),
          }}
          disabled={disabled}
        />
      );

    case "daily_time":
      return renderWithTooltip(
        <TextField
          fullWidth
          label="Время выполнения (HH:MM)"
          name="time_of_day"
          type="time"
          value={timeOfDay || ""}
          onChange={onFieldChange}
          error={!!errors.time_of_day}
          helperText={errors.time_of_day}
          required
          InputLabelProps={{ shrink: true }}
          disabled={disabled}
        />
      );

    default:
      return null;
  }
};
