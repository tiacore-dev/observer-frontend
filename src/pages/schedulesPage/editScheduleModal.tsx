"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import type { ISchedule, IScheduleEdit } from "../../api/schedulesApi";
import { useCompanyMap } from "../../hooks/maps/useCompanyMap";
import { useBotMap } from "../../hooks/maps/useBotMap";
import { usePromptMap } from "../../hooks/maps/usePromptMap";
import { useChatMap } from "../../hooks/maps/useChatMap";
import { ModalSkeleton } from "../../components/skeleton/modalSkeleton";
import { SelectSkeleton } from "../../components/skeleton/selectSkeleton";
import { ScheduleTypeFields } from "./components/scheduleTypeFields";
import { SendStrategyFields } from "./components/sendStrategyFields";
import { TargetChatSelector } from "./components/targetChatSelector";
import { useScheduleValidation } from "./helpers/useScheduleValidation";
import { useScheduleChanges } from "./helpers/useScheduleChanges";
import {
  generateCronExpression,
  formatTimeFromUTC,
} from "./helpers/scheduleUtils";

interface EditScheduleModalProps {
  open: boolean;
  onClose: () => void;
  schedule: ISchedule;
  onUpdate: (data: {
    schedule_id: string;
    updatedData: Partial<IScheduleEdit>;
  }) => Promise<void>;
  isSubmitting: boolean;
}

export const EditScheduleModal: React.FC<EditScheduleModalProps> = ({
  open,
  onClose,
  schedule,
  onUpdate,
  isSubmitting,
}) => {
  const [selectedDays, setSelectedDays] = React.useState<number[]>([]);
  const [cronTime, setCronTime] = React.useState<string>("09:00");

  const { errors, validateFields } = useScheduleValidation();
  const {
    currentTargetChats,
    updateField,
    updateTargetChats,
    getCurrentValue,
    getCurrentStringValue,
    getCurrentNumberValue,
    getCurrentNumberAsString,
    getCurrentBooleanValue,
    getChangedData,
    hasAnyChanges,
  } = useScheduleChanges(schedule);

  const { companyMap, isLoadingCompanyMap } = useCompanyMap();
  const { botMap, isLoadingBotMap } = useBotMap(
    getCurrentStringValue("company_id")
  );
  const { promptMap, isLoadingPromptMap } = usePromptMap(
    getCurrentStringValue("company_id")
  );
  const { chatMap, isLoadingChatsMap } = useChatMap(
    getCurrentStringValue("company_id")
  );

  const isCompanySelected = !!getCurrentStringValue("company_id");
  const isBotSelected = !!getCurrentValue("bot_id");
  const tooltipMessageCompany = "Сначала выберите компанию";
  const tooltipMessageBot = "Сначала выберите бота";

  React.useEffect(() => {
    if (schedule.schedule_type === "cron" && schedule.cron_expression) {
      const parts = schedule.cron_expression.split(" ");
      if (parts.length >= 5) {
        setCronTime(
          `${parts[1].padStart(2, "0")}:${parts[0].padStart(2, "0")}`
        );
        setSelectedDays(parts[4].split(",").map(Number));
      }
    }
  }, [schedule]);

  const renderWithTooltip = (
    element: React.ReactElement,
    condition: boolean,
    message: string
  ) => {
    return condition ? <Tooltip title={message}>{element}</Tooltip> : element;
  };

  const renderWithSkeleton = (element: React.ReactNode, isLoading: boolean) => {
    return isLoading ? <SelectSkeleton /> : element;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Для числовых полей дополнительная проверка уже выполнена в компонентах
    // Здесь просто передаем значение дальше
    updateField(name, value);
  };

  const handleSelectChange = (e: { target: { name: string; value: any } }) => {
    const { name, value } = e.target;

    if (name === "bot_id") {
      updateField(name, value);
      updateField("chat_id", 0);
      updateTargetChats([]); // Сбрасываем выбранные чаты при смене бота
    } else if (name === "company_id") {
      updateField(name, value);
      updateField("bot_id", 0);
      updateField("chat_id", 0);
      updateField("prompt_id", "");
      updateTargetChats([]); // Сбрасываем выбранные чаты при смене компании
    } else {
      updateField(name, value);
    }
  };

  const handleChatToggle = (chatId: number) => () => {
    const newTargetChats = [...currentTargetChats];
    const chatIndex = newTargetChats.indexOf(chatId);

    if (chatIndex === -1) {
      newTargetChats.push(chatId);
    } else {
      newTargetChats.splice(chatIndex, 1);
    }

    updateTargetChats(newTargetChats);
  };

  const toggleDaySelection = (dayId: number) => {
    setSelectedDays((prev) =>
      prev.includes(dayId)
        ? prev.filter((id) => id !== dayId)
        : [...prev, dayId]
    );
  };

  const handleSubmit = async () => {
    // Создаем объект для валидации с текущими значениями
    const dataForValidation = {
      chat_id: getCurrentValue("chat_id"),
      prompt_id: getCurrentStringValue("prompt_id"),
      schedule_type: getCurrentValue("schedule_type"),
      target_chats: currentTargetChats,
      bot_id: getCurrentValue("bot_id"),
      send_strategy: getCurrentValue("send_strategy"),
      interval_hours: getCurrentNumberValue("interval_hours"),
      interval_minutes: getCurrentNumberValue("interval_minutes"),
      time_of_day: getCurrentStringValue("time_of_day"),
      run_at: getCurrentStringValue("run_at"),
      time_to_send: getCurrentStringValue("time_to_send"),
      send_after_minutes: getCurrentNumberValue("send_after_minutes"),
      company_id: getCurrentStringValue("company_id"),
    };

    if (!validateFields(dataForValidation, selectedDays, cronTime)) return;

    // Проверяем, есть ли изменения
    if (!hasAnyChanges) {
      onClose();
      return;
    }

    try {
      const changedData = getChangedData();

      // Добавляем специальные поля только если они изменились
      const dataToUpdate: Partial<IScheduleEdit> = { ...changedData };

      // Обрабатываем cron_expression только если изменился schedule_type на cron или изменились дни/время
      const currentScheduleType = getCurrentValue("schedule_type");
      if (
        currentScheduleType === "cron" &&
        (changedData.schedule_type || selectedDays.length > 0)
      ) {
        dataToUpdate.cron_expression = generateCronExpression(
          cronTime,
          selectedDays
        );
      }

      // Обрабатываем time_to_send только если изменилась стратегия или время
      const currentSendStrategy = getCurrentValue("send_strategy");
      if (
        currentSendStrategy === "fixed" &&
        (changedData.send_strategy || changedData.time_to_send)
      ) {
        const timeToSend = getCurrentStringValue("time_to_send");
        dataToUpdate.time_to_send = timeToSend
          ? `${formatTimeFromUTC(timeToSend)}:00`
          : undefined;
      }

      // Обрабатываем time_of_day только если изменился тип расписания или время
      if (
        currentScheduleType === "daily_time" &&
        (changedData.schedule_type || changedData.time_of_day)
      ) {
        const timeOfDay = getCurrentStringValue("time_of_day");
        dataToUpdate.time_of_day = timeOfDay
          ? `${formatTimeFromUTC(timeOfDay)}:00`
          : undefined;
      }

      await onUpdate({
        schedule_id: schedule.schedule_id,
        updatedData: dataToUpdate,
      });
      onClose();
    } catch (error) {
      console.error("Ошибка при обновлении расписания:", error);
    }
  };

  if (isLoadingCompanyMap) {
    return <ModalSkeleton fieldCount={8} hasActions />;
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Редактировать расписание</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          {renderWithSkeleton(
            <FormControl fullWidth required error={!!errors.company_id}>
              <InputLabel>Компания</InputLabel>
              <Select
                name="company_id"
                value={getCurrentStringValue("company_id") || ""}
                label="Компания"
                onChange={handleSelectChange}
              >
                {Array.from(companyMap.entries()).map(([id, name]) => (
                  <MenuItem key={id} value={id}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
              {errors.company_id && (
                <Typography variant="caption" color="error">
                  {errors.company_id}
                </Typography>
              )}
            </FormControl>,
            isLoadingCompanyMap
          )}

          {renderWithSkeleton(
            renderWithTooltip(
              <FormControl fullWidth required error={!!errors.bot_id}>
                <InputLabel>Бот</InputLabel>
                <Select
                  name="bot_id"
                  value={getCurrentValue("bot_id") || ""}
                  label="Бот"
                  onChange={handleSelectChange}
                  disabled={!isCompanySelected}
                >
                  {Array.from(botMap.entries()).map(([id, name]) => (
                    <MenuItem key={id} value={id}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.bot_id && (
                  <Typography variant="caption" color="error">
                    {errors.bot_id}
                  </Typography>
                )}
              </FormControl>,
              !isCompanySelected,
              tooltipMessageCompany
            ),
            isLoadingBotMap
          )}

          {renderWithSkeleton(
            renderWithTooltip(
              <FormControl fullWidth required error={!!errors.chat_id}>
                <InputLabel>Анализируемый чат</InputLabel>
                <Select
                  name="chat_id"
                  value={getCurrentValue("chat_id") || ""}
                  label="Анализируемый чат"
                  onChange={handleSelectChange}
                  disabled={!isBotSelected}
                >
                  {Array.from(chatMap.entries()).map(([id, name]) => (
                    <MenuItem key={id} value={id.toString()}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.chat_id && (
                  <Typography variant="caption" color="error">
                    {errors.chat_id}
                  </Typography>
                )}
              </FormControl>,
              !isCompanySelected || !isBotSelected,
              !isCompanySelected ? tooltipMessageCompany : tooltipMessageBot
            ),
            isLoadingChatsMap
          )}

          {renderWithSkeleton(
            renderWithTooltip(
              <FormControl fullWidth required error={!!errors.prompt_id}>
                <InputLabel>Промпт</InputLabel>
                <Select
                  name="prompt_id"
                  value={getCurrentStringValue("prompt_id") || ""}
                  label="Промпт"
                  onChange={handleSelectChange}
                  disabled={!isCompanySelected}
                >
                  {Array.from(promptMap.entries()).map(([id, name]) => (
                    <MenuItem key={id} value={id}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.prompt_id && (
                  <Typography variant="caption" color="error">
                    {errors.prompt_id}
                  </Typography>
                )}
              </FormControl>,
              !isCompanySelected,
              tooltipMessageCompany
            ),
            isLoadingPromptMap
          )}

          {renderWithSkeleton(
            <TargetChatSelector
              chatMap={chatMap}
              selectedChats={currentTargetChats}
              onChatToggle={handleChatToggle}
              disabled={!isCompanySelected || !isBotSelected}
              error={errors.target_chats}
              tooltipMessage={
                !isCompanySelected ? tooltipMessageCompany : tooltipMessageBot
              }
            />,
            isLoadingChatsMap
          )}

          <FormControl fullWidth>
            <InputLabel>Тип расписания</InputLabel>
            <Select
              name="schedule_type"
              value={getCurrentValue("schedule_type") || "interval"}
              label="Тип расписания"
              onChange={handleSelectChange}
            >
              <MenuItem value="interval">Интервал</MenuItem>
              <MenuItem value="cron">Повторяющееся (Cron)</MenuItem>
              <MenuItem value="once">Одноразово</MenuItem>
              <MenuItem value="daily_time">Ежедневно</MenuItem>
            </Select>
          </FormControl>

          <ScheduleTypeFields
            scheduleType={getCurrentValue("schedule_type")}
            intervalHours={getCurrentNumberAsString("interval_hours")}
            intervalMinutes={getCurrentNumberAsString("interval_minutes")}
            timeOfDay={getCurrentStringValue("time_of_day")}
            runAt={getCurrentStringValue("run_at")}
            cronTime={cronTime}
            selectedDays={selectedDays}
            errors={errors}
            onFieldChange={handleChange}
            onCronTimeChange={setCronTime}
            onToggleDay={toggleDaySelection}
          />

          <FormControl fullWidth>
            <InputLabel>Стратегия отправки</InputLabel>
            <Select
              name="send_strategy"
              value={getCurrentValue("send_strategy") || "fixed"}
              label="Стратегия отправки"
              onChange={handleSelectChange}
            >
              <MenuItem value="fixed">Фиксированное время</MenuItem>
              <MenuItem value="relative">
                Относительно времени выполнения
              </MenuItem>
            </Select>
          </FormControl>

          <SendStrategyFields
            sendStrategy={getCurrentValue("send_strategy")}
            timeToSend={getCurrentStringValue("time_to_send")}
            sendAfterMinutes={getCurrentNumberAsString("send_after_minutes")}
            errors={errors}
            onFieldChange={handleChange}
          />

          <FormControl fullWidth>
            <InputLabel>Статус</InputLabel>
            <Select
              name="enabled"
              value={getCurrentBooleanValue("enabled") ? "true" : "false"}
              label="Статус"
              onChange={(e) =>
                updateField("enabled", e.target.value === "true")
              }
            >
              <MenuItem value="true">Включено</MenuItem>
              <MenuItem value="false">Выключено</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={isSubmitting || !hasAnyChanges}
        >
          {isSubmitting ? <CircularProgress size={24} /> : "Сохранить"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
