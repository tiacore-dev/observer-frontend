"use client";

import type React from "react";
import { TextField, Typography, Box, Alert } from "@mui/material";
import { AccessTime, Speed } from "@mui/icons-material";

interface SendStrategyFieldsProps {
  sendStrategy: "fixed" | "relative";
  timeToSend?: string;
  sendAfterMinutes?: string;
  errors: Record<string, string>;
  disabled?: boolean;
  tooltipMessage?: string;
  onFieldChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SendStrategyFields: React.FC<SendStrategyFieldsProps> = ({
  sendStrategy,
  timeToSend,
  sendAfterMinutes,
  errors,
  disabled = false,
  tooltipMessage,
  onFieldChange,
}) => {
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (value === "" || /^\d+$/.test(value)) {
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

  if (sendStrategy === "fixed") {
    return (
      <Box>
        <TextField
          fullWidth
          label="Время отправки"
          name="time_to_send"
          type="time"
          value={timeToSend || ""}
          onChange={onFieldChange}
          error={!!errors.time_to_send}
          helperText={
            errors.time_to_send ||
            "Укажите время, когда отправлять результаты каждый день"
          }
          required
          InputLabelProps={{ shrink: true }}
          disabled={disabled}
          inputProps={{
            step: 300, // 5 минут
          }}
          InputProps={{
            startAdornment: (
              <AccessTime sx={{ mr: 1, color: "text.secondary" }} />
            ),
          }}
        />
      </Box>
    );
  }

  if (sendStrategy === "relative") {
    return (
      <Box>
        <TextField
          fullWidth
          label="Задержка перед отправкой (минуты)"
          name="send_after_minutes"
          type="text"
          value={sendAfterMinutes || ""}
          onChange={handleNumberChange}
          onKeyDown={handleKeyPress}
          onPaste={handlePaste}
          error={!!errors.send_after_minutes}
          helperText={
            errors.send_after_minutes ||
            "Через сколько минут после начала анализа отправить результаты (минимум 10 минут, это позволит системе завершить обработку данных)"
          }
          required
          inputProps={{
            inputMode: "numeric",
            pattern: "[0-9]*",
            min: "10",
          }}
          disabled={disabled}
          placeholder="10"
          // InputProps={{
          //   startAdornment: <Speed sx={{ mr: 1, color: "text.secondary" }} />,
          // }}
        />
        {/* <Alert severity="info" sx={{ mt: 1 }}>
          <Typography variant="caption">
            💡 
          </Typography>
        </Alert> */}
      </Box>
    );
  }

  return null;
};
