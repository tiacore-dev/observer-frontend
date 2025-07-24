"use client";

import type React from "react";
import { Box, TextField, Alert, Typography } from "@mui/material";
import { Schedule, Today } from "@mui/icons-material";
import { DaySelector } from "./daySelector";

interface ScheduleTypeFieldsProps {
  scheduleType: "interval" | "cron";
  intervalHours?: string;
  intervalMinutes?: string;
  cronTime: string;
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

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (value === "" || /^\d+$/.test(value)) {
      if (name === "interval_minutes") {
        const numValue = Number.parseInt(value);
        if (value !== "" && (numValue < 0 || numValue > 59)) {
          return;
        }
      }
      onFieldChange(e);
    }
  };

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

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData("text");
    if (!/^\d*$/.test(pastedText)) {
      e.preventDefault();
    }
  };

  switch (scheduleType) {
    case "interval":
      return renderWithTooltip(
        <Box>
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              label="Часы"
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
                "Каждые сколько часов"
              }
              inputProps={{
                inputMode: "numeric",
                pattern: "[0-9]*",
              }}
              disabled={disabled}
              placeholder="0"
              // InputProps={{
              //   startAdornment: (
              //     <Schedule sx={{ mr: 1, color: "text.secondary" }} />
              //   ),
              // }}
            />
            <TextField
              fullWidth
              label="Минуты"
              name="interval_minutes"
              type="text"
              value={intervalMinutes || ""}
              onChange={handleNumberChange}
              onKeyDown={handleKeyPress}
              onPaste={handlePaste}
              error={!!errors.interval_minutes}
              helperText={
                errors.interval_minutes || "Дополнительные минуты (0-59)"
              }
              inputProps={{
                inputMode: "numeric",
                pattern: "[0-9]*",
              }}
              disabled={disabled}
              placeholder="0"
            />
          </Box>
        </Box>
      );

    case "cron":
      return renderWithTooltip(
        <Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              label="Время запуска"
              type="time"
              value={cronTime}
              onChange={(e) => onCronTimeChange(e.target.value)}
              InputLabelProps={{ shrink: true }}
              disabled={disabled}
              helperText="Во сколько запускать задачу в выбранные дни"
              InputProps={{
                startAdornment: (
                  <Today sx={{ mr: 1, color: "text.secondary" }} />
                ),
              }}
            />

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Дни недели:
              </Typography>
              <DaySelector
                selectedDays={selectedDays}
                onToggleDay={onToggleDay}
                disabled={disabled}
                error={errors.cron_expression}
                tooltipMessage={tooltipMessage}
              />
            </Box>
          </Box>
        </Box>
      );

    default:
      return null;
  }
};
