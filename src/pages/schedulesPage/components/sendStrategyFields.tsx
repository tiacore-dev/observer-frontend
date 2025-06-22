import type React from "react";
import { TextField } from "@mui/material";
import { formatTimeFromUTC } from "../helpers/scheduleUtils";

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
  const renderWithTooltip = (element: React.ReactElement) => {
    return disabled && tooltipMessage ? (
      <div title={tooltipMessage}>{element}</div>
    ) : (
      element
    );
  };

  // Обработчик изменений с валидацией числовых значений
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    // Разрешаем пустую строку или только цифры (целые положительные числа)
    if (value === "" || /^\d+$/.test(value)) {
      onFieldChange(e);
    }
  };

  // Обработчик нажатия клавиш для блокировки нецифровых символов
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Разрешаем: цифры (0-9), Backspace, Delete, Tab, Escape, Enter, стрелки
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

    // Разрешаем Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+Z
    if (e.ctrlKey && ["a", "c", "v", "x", "z"].includes(e.key.toLowerCase())) {
      return;
    }

    // Если это не разрешенная клавиша и не цифра, блокируем
    if (!allowedKeys.includes(e.key) && !/^[0-9]$/.test(e.key)) {
      e.preventDefault();
    }
  };

  // Обработчик вставки из буфера обмена
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData("text");

    // Проверяем, содержит ли вставляемый текст только цифры
    if (!/^\d*$/.test(pastedText)) {
      e.preventDefault();
    }
  };

  if (sendStrategy === "fixed") {
    return renderWithTooltip(
      <TextField
        fullWidth
        label="Время отправки (HH:MM)"
        name="time_to_send"
        type="time"
        value={formatTimeFromUTC(timeToSend)}
        onChange={onFieldChange}
        error={!!errors.time_to_send}
        helperText={errors.time_to_send}
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
    return renderWithTooltip(
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
          errors.send_after_minutes || "Только целые положительные числа"
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
