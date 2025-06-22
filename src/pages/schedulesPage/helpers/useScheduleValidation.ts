"use client";

import { useState } from "react";

interface ValidationData {
  bot_id?: string | number;
  chat_id?: string | number;
  prompt_id?: string;
  company_id?: string;
  target_chats: number[];
  schedule_type: "interval" | "cron" | "once" | "daily_time";
  interval_hours?: string | number;
  interval_minutes?: string | number;
  time_of_day?: string;
  run_at?: string;
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
    const now = new Date();

    // Базовые проверки
    if (!data.bot_id) newErrors.bot_id = "Бот обязателен";
    if (!data.chat_id) newErrors.chat_id = "Чат обязателен";
    if (!data.prompt_id) newErrors.prompt_id = "Промпт обязателен";
    if (!data.company_id) newErrors.company_id = "Компания обязательна";
    if (data.target_chats.length === 0)
      newErrors.target_chats = "Необходимо выбрать хотя бы один чат";

    // Проверки для типа расписания
    if (data.schedule_type === "interval") {
      const hours =
        typeof data.interval_hours === "string"
          ? Number.parseInt(data.interval_hours)
          : data.interval_hours;
      const minutes =
        typeof data.interval_minutes === "string"
          ? Number.parseInt(data.interval_minutes)
          : data.interval_minutes;

      if ((!hours || hours <= 0) && (!minutes || minutes <= 0)) {
        newErrors.interval = "Укажите интервал (часы или минуты больше 0)";
      } else {
        // Проверка на целые положительные числа для часов
        if (hours !== undefined) {
          if (hours < 0 || !Number.isInteger(hours)) {
            newErrors.interval_hours =
              "Часы должны быть целым положительным числом";
          }
        }

        // Проверка на целые числа от 0 до 59 для минут
        if (minutes !== undefined) {
          if (minutes < 0 || minutes > 59 || !Number.isInteger(minutes)) {
            newErrors.interval_minutes = "Минуты должны быть от 0 до 59";
          }
        }
      }
    } else if (data.schedule_type === "cron") {
      if (selectedDays.length === 0 || !cronTime) {
        newErrors.cron_expression = "Выберите дни и время";
      }
    } else if (data.schedule_type === "once") {
      if (!data.run_at) {
        newErrors.run_at = "Время выполнения обязательно";
      } else {
        try {
          const selectedDateTime = new Date(data.run_at);
          if (selectedDateTime < now) {
            newErrors.run_at = "Нельзя выбрать прошедшую дату/время";
          }
        } catch (error) {
          newErrors.run_at = "Неверный формат даты/времени";
        }
      }
    } else if (data.schedule_type === "daily_time") {
      if (!data.time_of_day) {
        newErrors.time_of_day = "Время выполнения обязательно";
      }
    }

    // Проверки стратегии отправки
    if (data.send_strategy === "fixed" && !data.time_to_send) {
      newErrors.time_to_send = "Время отправки обязательно";
    } else if (data.send_strategy === "relative") {
      const minutes =
        typeof data.send_after_minutes === "string"
          ? Number.parseInt(data.send_after_minutes)
          : data.send_after_minutes;

      if (!minutes && minutes !== 0) {
        newErrors.send_after_minutes = "Интервал отправки обязателен";
      } else if (minutes !== undefined) {
        if (minutes < 0 || !Number.isInteger(minutes)) {
          newErrors.send_after_minutes =
            "Должно быть целым положительным числом";
        }
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
