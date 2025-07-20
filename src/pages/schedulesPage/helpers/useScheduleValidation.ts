"use client";

import { useState } from "react";

interface ValidationData {
  schedule_strategy: "analysis" | "notification";
  bot_id?: string | number;
  chat_id?: string | number;
  prompt_id?: string;
  company_id?: string;
  message_intro?: string;
  notification_text?: string;
  target_chats: number[];
  schedule_type: "interval" | "cron";
  interval_hours?: string | number;
  interval_minutes?: string | number;
  send_strategy: "fixed" | "relative";
  time_to_send?: string;
  send_after_minutes?: string | number;
}

export const useScheduleValidation = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateFields = (
    data: ValidationData,
    selectedDays: number[],
    cronTime: string
  ) => {
    const newErrors: Record<string, string> = {};

    // Базовые обязательные поля
    if (!data.bot_id) newErrors.bot_id = "Бот обязателен";
    if (!data.company_id) newErrors.company_id = "Компания обязательна";
    if (data.target_chats.length === 0) {
      newErrors.target_chats = "Необходимо выбрать хотя бы один чат";
    }

    // Валидация по стратегии расписания
    if (data.schedule_strategy === "analysis") {
      if (!data.chat_id) newErrors.chat_id = "Анализируемый чат обязателен";
      if (!data.prompt_id) newErrors.prompt_id = "Промпт обязателен";
    } else if (data.schedule_strategy === "notification") {
      if (!data.notification_text) {
        newErrors.notification_text = "Текст уведомления обязателен";
      }
    }

    // Валидация длины шапки сообщения
    if (data.message_intro && data.message_intro.length > 255) {
      newErrors.message_intro = "Максимальная длина - 255 символов";
    }

    // Валидация типа расписания
    if (data.schedule_type === "interval") {
      const hours = Number(data.interval_hours) || 0;
      const minutes = Number(data.interval_minutes) || 0;

      if (hours <= 0 && minutes <= 0) {
        newErrors.interval = "Укажите интервал (часы или минуты больше 0)";
      } else {
        if (hours < 0 || !Number.isInteger(hours)) {
          newErrors.interval_hours =
            "Часы должны быть целым положительным числом";
        }
        if (minutes < 0 || minutes > 59 || !Number.isInteger(minutes)) {
          newErrors.interval_minutes = "Минуты должны быть от 0 до 59";
        }
      }
    } else if (data.schedule_type === "cron") {
      if (selectedDays.length === 0 || !cronTime) {
        newErrors.cron_expression = "Выберите дни и время";
      }
    }

    // Валидация стратегии отправки
    if (data.send_strategy === "fixed") {
      if (!data.time_to_send) {
        newErrors.time_to_send = "Время отправки обязательно";
      }
    } else if (data.send_strategy === "relative") {
      const minutes = Number(data.send_after_minutes) || 0;
      if (minutes <= 0) {
        newErrors.send_after_minutes = "Укажите положительное число минут";
      } else if (!Number.isInteger(minutes)) {
        newErrors.send_after_minutes = "Должно быть целым числом";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearError = (fieldName: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  };

  const setError = (fieldName: string, message: string) => {
    setErrors((prev) => ({
      ...prev,
      [fieldName]: message,
    }));
  };

  return {
    errors,
    validateFields,
    clearError,
    setError,
    setErrors,
  };
};
