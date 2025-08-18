"use client";

import { useState, useEffect } from "react";
import { useCreateSchedule } from "../../../hooks/schedules/useScheduleMutations";
import { useCompanyMap } from "../../../hooks/maps/useCompanyMap";
import { useBotMap } from "../../../hooks/maps/useBotMap";
import { usePromptMap } from "../../../hooks/maps/usePromptMap";
import { useChatsQuery } from "../../../hooks/chats/useChatsQuery";
import { useAuth } from "../../../context/authContext";
import { useScheduleValidation } from "./useScheduleValidation";
import {
  convertToServerTime,
  generateCronExpressionWithTimeConversion,
} from "./scheduleUtils";

export const useScheduleModalLogic = () => {
  const { isSuperadmin, selectedCompanyId } = useAuth();
  const [scheduleData, setScheduleData] = useState({
    schedule_name: "",
    description: "",
    schedule_strategy: "analysis" as ScheduleStrategy,
    notification_text: "",
    chat_id: "",
    prompt_id: "",
    company_id: isSuperadmin ? "" : selectedCompanyId || "",
    schedule_type: "interval" as ScheduleType,
    interval_hours: "",
    interval_minutes: "",
    cron_expression: "",
    message_intro: "",
    enabled: true,
    bot_id: "",
    target_chats: [] as number[],
    send_strategy: "fixed" as SendStrategy,
    time_to_send: "",
    send_after_minutes: "",
    run_on_empty_chat: false,
  });

  const [cronTime, setCronTime] = useState<string>("09:00");
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [showHelp, setShowHelp] = useState(false);

  const createSchedule = useCreateSchedule();
  const { errors, validateFields, clearError, setError } =
    useScheduleValidation();

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

  const { data: chatsData, isLoading: isLoadingChatsMap } = useChatsQuery(
    scheduleData.bot_id ? Number(scheduleData.bot_id) : undefined,
    scheduleData.company_id
  );

  const chatMap = new Map(
    chatsData?.chats?.map((chat) => [
      chat.chat_id,
      chat.chat_name || `Chat ${chat.chat_id}`,
    ]) || []
  );

  const isCompanySelected = !!scheduleData.company_id;
  const isBotSelected = !!scheduleData.bot_id;
  const tooltipMessageCompany = "Сначала выберите компанию";
  const tooltipMessageBot = "Сначала выберите бота";

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

  const handleToggleChange = (field: string, value: string) => {
    setScheduleData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBooleanChange = (field: string, value: boolean) => {
    setScheduleData((prev) => ({ ...prev, [field]: value }));
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
      schedule_name: scheduleData.schedule_name,
      description: scheduleData.description,
      schedule_strategy: scheduleData.schedule_strategy,
      notification_text: scheduleData.notification_text,
      chat_id: scheduleData.chat_id,
      prompt_id: scheduleData.prompt_id,
      company_id: scheduleData.company_id,
      message_intro: scheduleData.message_intro || undefined,
      schedule_type: scheduleData.schedule_type,
      target_chats: scheduleData.target_chats,
      bot_id: scheduleData.bot_id,
      run_on_empty_chat: scheduleData.run_on_empty_chat,
      ...(scheduleData.schedule_strategy === "analysis" && {
        send_strategy: scheduleData.send_strategy,
        time_to_send: scheduleData.time_to_send,
        send_after_minutes: scheduleData.send_after_minutes,
      }),
      interval_hours: scheduleData.interval_hours
        ? Number(scheduleData.interval_hours)
        : undefined,
      interval_minutes: scheduleData.interval_minutes
        ? Number(scheduleData.interval_minutes)
        : undefined,
    };

    if (!validateFields(dataForValidation, selectedDays, cronTime)) return;

    try {
      const serverTimeToSend = scheduleData.time_to_send
        ? convertToServerTime(scheduleData.time_to_send) + ":00"
        : undefined;

      await createSchedule.mutateAsync({
        schedule_name: scheduleData.schedule_name,
        description: scheduleData.description || undefined,
        schedule_strategy: scheduleData.schedule_strategy,
        notification_text:
          scheduleData.schedule_strategy === "notification"
            ? scheduleData.notification_text
            : undefined,
        chat_id:
          scheduleData.schedule_strategy === "analysis"
            ? Number.parseInt(scheduleData.chat_id)
            : undefined,
        prompt_id:
          scheduleData.schedule_strategy === "analysis"
            ? scheduleData.prompt_id
            : undefined,
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
        cron_expression:
          scheduleData.schedule_type === "cron"
            ? generateCronExpressionWithTimeConversion(cronTime, selectedDays)
            : undefined,
        enabled: scheduleData.enabled,
        bot_id: Number.parseInt(scheduleData.bot_id),
        target_chats: scheduleData.target_chats,
        run_on_empty_chat: scheduleData.run_on_empty_chat,
        ...(scheduleData.schedule_strategy === "analysis" && {
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
        }),
        message_intro: scheduleData.message_intro || undefined,
      });

      // Reset form
      setScheduleData({
        schedule_name: "",
        description: "",
        schedule_strategy: "analysis",
        notification_text: "",
        chat_id: "",
        prompt_id: "",
        company_id: isSuperadmin ? "" : selectedCompanyId || "",
        schedule_type: "interval",
        interval_hours: "",
        interval_minutes: "",
        cron_expression: "",
        message_intro: "",
        enabled: true,
        bot_id: "",
        target_chats: [],
        send_strategy: "fixed",
        time_to_send: "",
        send_after_minutes: "",
        run_on_empty_chat: false,
      });
      setCronTime("09:00");
      setSelectedDays([1, 2, 3, 4, 5]);
    } catch (error) {
      console.error("Error creating schedule:", error);
    }
  };

  return {
    scheduleData,
    setScheduleData,
    cronTime,
    setCronTime,
    selectedDays,
    setSelectedDays,
    showHelp,
    setShowHelp,
    errors,
    clearError,
    setError,
    companyMap,
    isLoadingCompanyMap,
    botMap,
    isLoadingBotMap,
    promptMap,
    isLoadingPromptMap,
    chatMap,
    isLoadingChatsMap,
    isCompanySelected,
    isBotSelected,
    tooltipMessageCompany,
    tooltipMessageBot,
    handleChange,
    handleSelectChange,
    handleToggleChange,
    handleBooleanChange,
    handleChatToggle,
    toggleDaySelection,
    handleSubmit,
    createSchedule,
  };
};

type ScheduleType = "interval" | "cron";
type SendStrategy = "fixed" | "relative";
type ScheduleStrategy = "analysis" | "notification";
