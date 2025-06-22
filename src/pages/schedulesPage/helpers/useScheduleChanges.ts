"use client";

import { useState, useMemo } from "react";
import type { ISchedule, IScheduleEdit } from "../../../api/schedulesApi";

export const useScheduleChanges = (originalSchedule: ISchedule) => {
  const [currentData, setCurrentData] = useState<Partial<IScheduleEdit>>({});
  const [originalTargetChats] = useState<number[]>([
    ...originalSchedule.target_chats,
  ]);
  const [currentTargetChats, setCurrentTargetChats] = useState<number[]>([
    ...originalSchedule.target_chats,
  ]);

  // Вычисляем изменения в чатах
  const chatChanges = useMemo(() => {
    const addedChats = currentTargetChats.filter(
      (chatId) => !originalTargetChats.includes(chatId)
    );
    const removedChats = originalTargetChats.filter(
      (chatId) => !currentTargetChats.includes(chatId)
    );

    return {
      target_chats: addedChats,
      removed_chats: removedChats,
      hasChanges: addedChats.length > 0 || removedChats.length > 0,
    };
  }, [currentTargetChats, originalTargetChats]);

  // Функция для обновления данных
  const updateField = (fieldName: string, value: any) => {
    setCurrentData((prev) => {
      const newData = { ...prev };

      // Проверяем, изменилось ли значение
      const originalValue = originalSchedule[fieldName as keyof ISchedule];

      // Специальная обработка для числовых полей, которые могут приходить как строки
      let normalizedValue = value;
      if (
        fieldName === "interval_hours" ||
        fieldName === "interval_minutes" ||
        fieldName === "send_after_minutes"
      ) {
        normalizedValue = value === "" ? undefined : Number(value);
      }

      if (normalizedValue === originalValue) {
        // Если значение вернулось к оригинальному, удаляем из изменений
        delete newData[fieldName as keyof IScheduleEdit];
      } else {
        // Если значение изменилось, добавляем в изменения
        newData[fieldName as keyof IScheduleEdit] = normalizedValue;
      }

      return newData;
    });
  };

  // Функция для обновления чатов
  const updateTargetChats = (newChats: number[]) => {
    setCurrentTargetChats(newChats);
  };

  // Типобезопасные функции получения значений
  const getCurrentValue = <K extends keyof ISchedule>(
    fieldName: K
  ): ISchedule[K] => {
    return (
      (currentData[fieldName as keyof IScheduleEdit] as ISchedule[K]) ??
      originalSchedule[fieldName]
    );
  };

  const getCurrentStringValue = (fieldName: keyof ISchedule): string => {
    const value = getCurrentValue(fieldName);
    return value !== undefined && value !== null ? String(value) : "";
  };

  const getCurrentNumberValue = (
    fieldName: keyof ISchedule
  ): number | undefined => {
    const value = getCurrentValue(fieldName);
    return typeof value === "number" ? value : undefined;
  };

  // Функция для получения числовых значений как строк (для TextField)
  const getCurrentNumberAsString = (fieldName: keyof ISchedule): string => {
    const value = getCurrentValue(fieldName);
    return value !== undefined && value !== null ? String(value) : "";
  };

  const getCurrentBooleanValue = (fieldName: keyof ISchedule): boolean => {
    const value = getCurrentValue(fieldName);
    return typeof value === "boolean" ? value : false;
  };

  // Получаем только измененные данные для отправки
  const getChangedData = (): Partial<IScheduleEdit> => {
    const changedData: Partial<IScheduleEdit> = { ...currentData };

    // Добавляем изменения чатов только если они есть
    if (chatChanges.hasChanges) {
      changedData.target_chats = chatChanges.target_chats;
      changedData.removed_chats = chatChanges.removed_chats;
    }

    return changedData;
  };

  // Проверяем, есть ли вообще изменения
  const hasAnyChanges = useMemo(() => {
    return Object.keys(currentData).length > 0 || chatChanges.hasChanges;
  }, [currentData, chatChanges.hasChanges]);

  return {
    currentData,
    currentTargetChats,
    chatChanges,
    updateField,
    updateTargetChats,
    getCurrentValue,
    getCurrentStringValue,
    getCurrentNumberValue,
    getCurrentNumberAsString,
    getCurrentBooleanValue,
    getChangedData,
    hasAnyChanges,
  };
};
