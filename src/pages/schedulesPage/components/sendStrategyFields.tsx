import React from "react";
import { TextField, Typography } from "@mui/material";
import {
  convertToServerTime,
  convertToLocalTime,
} from "../helpers/scheduleUtils";

interface SendStrategyFieldsProps {
  sendStrategy: "fixed" | "relative";
  timeToSend?: string; // В формате HH:MM (локальное время пользователя)
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
  // Обработчик изменений для числовых полей
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    // Разрешаем только цифры или пустую строку
    if (value === "" || /^\d+$/.test(value)) {
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

  // Проверка вставляемого текста
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData("text");
    if (!/^\d*$/.test(pastedText)) {
      e.preventDefault();
    }
  };

  if (sendStrategy === "fixed") {
    return (
      <TextField
        fullWidth
        label="Время отправки (HH:MM)"
        name="time_to_send"
        type="time"
        value={timeToSend || ""} // Отображаем как есть (локальное время)
        onChange={onFieldChange}
        error={!!errors.time_to_send}
        helperText={
          errors.time_to_send
          // || "Локальное время пользователя"
        }
        required
        InputLabelProps={{ shrink: true }}
        disabled={disabled}
        inputProps={{
          step: 300, // 5 минут
        }}
      />
    );
  }

  if (sendStrategy === "relative") {
    return (
      <TextField
        fullWidth
        label="Отправить через (минуты)"
        name="send_after_minutes"
        type="text"
        value={sendAfterMinutes || ""}
        onChange={handleNumberChange}
        onKeyDown={handleKeyPress}
        onPaste={handlePaste}
        error={!!errors.send_after_minutes}
        helperText={
          errors.send_after_minutes
          //  || "Только целые положительные числа"
        }
        required
        inputProps={{
          inputMode: "numeric",
          pattern: "[0-9]*",
        }}
        disabled={disabled}
      />
    );
  }

  return null;
};
