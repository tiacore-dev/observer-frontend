import type React from "react";
import { useState, useEffect } from "react";
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
  Tooltip,
} from "@mui/material";
import { useCreateSchedule } from "../../hooks/schedules/useScheduleMutations";
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
import { useAuth } from "../../context/authContext";
import {
  convertToServerTime,
  localToServerDatetime,
  generateCronExpression,
} from "./helpers/scheduleUtils";

interface AddScheduleModalProps {
  open: boolean;
  onClose: () => void;
}

type ScheduleType = "interval" | "cron" | "once" | "daily_time";
type SendStrategy = "fixed" | "relative";

export const AddScheduleModal: React.FC<AddScheduleModalProps> = ({
  open,
  onClose,
}) => {
  const { isSuperadmin, selectedCompanyId } = useAuth();
  const [scheduleData, setScheduleData] = useState({
    chat_id: "",
    prompt_id: "",
    company_id: "",
    schedule_type: "interval" as ScheduleType,
    interval_hours: "",
    interval_minutes: "",
    time_of_day: "",
    cron_expression: "",
    message_intro: "",
    run_at: "",
    enabled: true,
    bot_id: "",
    target_chats: [] as number[],
    send_strategy: "fixed" as SendStrategy,
    time_to_send: "",
    send_after_minutes: "",
  });

  const [cronTime, setCronTime] = useState<string>("09:00");
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]);

  const createSchedule = useCreateSchedule();
  const { errors, validateFields, clearError, setError } =
    useScheduleValidation();

  // Автоматически устанавливаем company_id для обычных пользователей
  useEffect(() => {
    if (!isSuperadmin && selectedCompanyId) {
      setScheduleData((prev) => ({
        ...prev,
        company_id: selectedCompanyId,
      }));
    }
  }, [isSuperadmin, selectedCompanyId]);

  const { companyMap, isLoadingCompanyMap } = useCompanyMap();
  const { botMap, isLoadingBotMap } = useBotMap(scheduleData.company_id);
  const { promptMap, isLoadingPromptMap } = usePromptMap(
    scheduleData.company_id
  );
  const { chatMap, isLoadingChatsMap } = useChatMap(scheduleData.company_id);

  const isCompanySelected = !!scheduleData.company_id;
  const isBotSelected = !!scheduleData.bot_id;
  const tooltipMessageCompany = "Сначала выберите компанию";
  const tooltipMessageBot = "Сначала выберите бота";

  const renderWithTooltip = (
    element: React.ReactElement,
    condition: boolean,
    message: string
  ) => {
    return condition ? <Tooltip title={message}>{element}</Tooltip> : element;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (
      name === "interval_hours" ||
      name === "interval_minutes" ||
      name === "send_after_minutes"
    ) {
      if (value !== "" && !/^\d+$/.test(value)) {
        setError(name, "Только целые положительные числа");
        return;
      }

      if (name === "interval_minutes" && value !== "") {
        const numValue = Number.parseInt(value);
        if (numValue < 0 || numValue > 59) {
          setError(name, "Минуты должны быть от 0 до 59");
          return;
        }
      }

      if (
        (name === "interval_hours" || name === "send_after_minutes") &&
        value !== ""
      ) {
        const numValue = Number.parseInt(value);
        if (numValue < 0) {
          setError(name, "Значение не может быть отрицательным");
          return;
        }
      }

      clearError(name);
    }

    setScheduleData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: { target: { name: string; value: any } }) => {
    const { name, value } = e.target;

    if (name === "bot_id") {
      setScheduleData((prev) => ({
        ...prev,
        [name]: value,
        chat_id: "",
        target_chats: [],
      }));
    } else if (name === "company_id" && isSuperadmin) {
      setScheduleData((prev) => ({
        ...prev,
        [name]: value,
        bot_id: "",
        chat_id: "",
        prompt_id: "",
        target_chats: [],
      }));
    } else {
      setScheduleData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleChatToggle = (chatId: number) => () => {
    setScheduleData((prev) => {
      const newTargetChats = [...prev.target_chats];
      const chatIndex = newTargetChats.indexOf(chatId);

      if (chatIndex === -1) {
        newTargetChats.push(chatId);
      } else {
        newTargetChats.splice(chatIndex, 1);
      }

      return {
        ...prev,
        target_chats: newTargetChats,
      };
    });
  };

  const toggleDaySelection = (dayId: number) => {
    setSelectedDays((prev) =>
      prev.includes(dayId)
        ? prev.filter((id) => id !== dayId)
        : [...prev, dayId]
    );
  };

  const handleSubmit = async () => {
    const dataForValidation = {
      chat_id: scheduleData.chat_id,
      prompt_id: scheduleData.prompt_id,
      company_id: scheduleData.company_id,
      schedule_type: scheduleData.schedule_type,
      target_chats: scheduleData.target_chats,
      bot_id: scheduleData.bot_id,
      send_strategy: scheduleData.send_strategy,
      interval_hours: scheduleData.interval_hours
        ? Number(scheduleData.interval_hours)
        : undefined,
      interval_minutes: scheduleData.interval_minutes
        ? Number(scheduleData.interval_minutes)
        : undefined,
      time_of_day: scheduleData.time_of_day,
      run_at: scheduleData.run_at,
      time_to_send: scheduleData.time_to_send,
      send_after_minutes: scheduleData.send_after_minutes
        ? Number(scheduleData.send_after_minutes)
        : undefined,
    };

    if (!validateFields(dataForValidation, selectedDays, cronTime)) return;

    try {
      // Конвертация времени перед отправкой на сервер
      const serverTimeOfDay = scheduleData.time_of_day
        ? convertToServerTime(scheduleData.time_of_day) + ":00"
        : undefined;

      const serverTimeToSend = scheduleData.time_to_send
        ? convertToServerTime(scheduleData.time_to_send) + ":00"
        : undefined;

      const serverRunAt = scheduleData.run_at
        ? localToServerDatetime(scheduleData.run_at)
        : undefined;

      await createSchedule.mutateAsync({
        chat_id: Number.parseInt(scheduleData.chat_id),
        prompt_id: scheduleData.prompt_id,
        company_id: scheduleData.company_id,
        schedule_type: scheduleData.schedule_type,
        interval_hours:
          scheduleData.schedule_type === "interval" &&
          scheduleData.interval_hours
            ? Number(scheduleData.interval_hours)
            : undefined,
        interval_minutes:
          scheduleData.schedule_type === "interval" &&
          scheduleData.interval_minutes
            ? Number(scheduleData.interval_minutes)
            : undefined,
        time_of_day:
          scheduleData.schedule_type === "daily_time" && serverTimeOfDay
            ? serverTimeOfDay
            : undefined,
        cron_expression:
          scheduleData.schedule_type === "cron"
            ? generateCronExpression(cronTime, selectedDays)
            : undefined,
        run_at:
          scheduleData.schedule_type === "once" && serverRunAt
            ? serverRunAt
            : undefined,
        enabled: scheduleData.enabled,
        bot_id: Number.parseInt(scheduleData.bot_id),
        target_chats: scheduleData.target_chats,
        send_strategy: scheduleData.send_strategy,
        time_to_send:
          scheduleData.send_strategy === "fixed" && serverTimeToSend
            ? serverTimeToSend
            : undefined,
        send_after_minutes:
          scheduleData.send_strategy === "relative" &&
          scheduleData.send_after_minutes
            ? Number(scheduleData.send_after_minutes)
            : undefined,
      });

      onClose();
      setScheduleData({
        chat_id: "",
        prompt_id: "",
        company_id: "",
        schedule_type: "interval",
        interval_hours: "",
        interval_minutes: "",
        time_of_day: "",
        message_intro: "",
        cron_expression: "",
        run_at: "",
        enabled: true,
        bot_id: "",
        target_chats: [],
        send_strategy: "fixed",
        time_to_send: "",
        send_after_minutes: "",
      });
      setCronTime("09:00");
      setSelectedDays([1, 2, 3, 4, 5]);
    } catch (error) {
      console.error("Error creating schedule:", error);
    }
  };

  if (!open) return null;

  if (isLoadingCompanyMap) {
    return <ModalSkeleton fieldCount={8} hasActions />;
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Добавить новое расписание</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          {isSuperadmin ? (
            <FormControl fullWidth required error={!!errors.company_id}>
              <InputLabel>Компания</InputLabel>
              <Select
                name="company_id"
                value={scheduleData.company_id}
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
            </FormControl>
          ) : null}

          {isLoadingBotMap ? (
            <SelectSkeleton />
          ) : (
            renderWithTooltip(
              <FormControl fullWidth required error={!!errors.bot_id}>
                <InputLabel>Бот</InputLabel>
                <Select
                  name="bot_id"
                  value={scheduleData.bot_id}
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
            )
          )}

          {isLoadingChatsMap ? (
            <SelectSkeleton />
          ) : (
            renderWithTooltip(
              <FormControl fullWidth required error={!!errors.chat_id}>
                <InputLabel>Анализируемый чат</InputLabel>
                <Select
                  name="chat_id"
                  value={scheduleData.chat_id}
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
            )
          )}

          {isLoadingPromptMap ? (
            <SelectSkeleton />
          ) : (
            renderWithTooltip(
              <FormControl fullWidth required error={!!errors.prompt_id}>
                <InputLabel>Промпт</InputLabel>
                <Select
                  name="prompt_id"
                  value={scheduleData.prompt_id}
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
            )
          )}

          {isLoadingChatsMap ? (
            <SelectSkeleton />
          ) : (
            <TargetChatSelector
              chatMap={chatMap}
              selectedChats={scheduleData.target_chats}
              onChatToggle={handleChatToggle}
              disabled={!isCompanySelected || !isBotSelected}
              error={errors.target_chats}
              tooltipMessage={
                !isCompanySelected ? tooltipMessageCompany : tooltipMessageBot
              }
            />
          )}

          {renderWithTooltip(
            <FormControl fullWidth required>
              <InputLabel>Тип расписания</InputLabel>
              <Select
                name="schedule_type"
                value={scheduleData.schedule_type}
                label="Тип расписания"
                onChange={handleSelectChange}
                disabled={!isCompanySelected}
              >
                <MenuItem value="interval">Интервал</MenuItem>
                <MenuItem value="cron">Повторяющееся (Cron)</MenuItem>
                <MenuItem value="once">Одноразово</MenuItem>
                <MenuItem value="daily_time">Ежедневно</MenuItem>
              </Select>
            </FormControl>,
            !isCompanySelected,
            tooltipMessageCompany
          )}

          <ScheduleTypeFields
            scheduleType={scheduleData.schedule_type}
            intervalHours={scheduleData.interval_hours}
            intervalMinutes={scheduleData.interval_minutes}
            timeOfDay={scheduleData.time_of_day}
            runAt={scheduleData.run_at}
            cronTime={cronTime}
            selectedDays={selectedDays}
            errors={errors}
            disabled={!isCompanySelected}
            tooltipMessage={tooltipMessageCompany}
            onFieldChange={handleChange}
            onCronTimeChange={setCronTime}
            onToggleDay={toggleDaySelection}
          />

          {renderWithTooltip(
            <FormControl fullWidth required>
              <InputLabel>Стратегия отправки</InputLabel>
              <Select
                name="send_strategy"
                value={scheduleData.send_strategy}
                label="Стратегия отправки"
                onChange={handleSelectChange}
                disabled={!isCompanySelected}
              >
                <MenuItem value="fixed">Фиксированное время</MenuItem>
                <MenuItem value="relative">
                  Относительно времени выполнения
                </MenuItem>
              </Select>
            </FormControl>,
            !isCompanySelected,
            tooltipMessageCompany
          )}

          <SendStrategyFields
            sendStrategy={scheduleData.send_strategy}
            timeToSend={scheduleData.time_to_send}
            sendAfterMinutes={scheduleData.send_after_minutes}
            errors={errors}
            disabled={!isCompanySelected}
            tooltipMessage={tooltipMessageCompany}
            onFieldChange={handleChange}
          />

          {renderWithTooltip(
            <FormControl fullWidth>
              <InputLabel>Статус</InputLabel>
              <Select
                name="enabled"
                value={scheduleData.enabled ? "true" : "false"}
                label="Статус"
                onChange={(e) =>
                  setScheduleData((prev) => ({
                    ...prev,
                    enabled: e.target.value === "true",
                  }))
                }
                disabled={!isCompanySelected}
              >
                <MenuItem value="true">Включено</MenuItem>
                <MenuItem value="false">Выключено</MenuItem>
              </Select>
            </FormControl>,
            !isCompanySelected,
            tooltipMessageCompany
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Tooltip title={!isCompanySelected ? tooltipMessageCompany : ""}>
          <span>
            <Button
              onClick={handleSubmit}
              variant="contained"
              color="primary"
              disabled={!isCompanySelected}
            >
              Создать
            </Button>
          </span>
        </Tooltip>
      </DialogActions>
    </Dialog>
  );
};
