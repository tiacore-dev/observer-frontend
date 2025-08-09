"use client";

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
  TextField,
  Stack,
  Alert,
  Chip,
  CircularProgress,
  Collapse,
} from "@mui/material";
import {
  Info as InfoIcon,
  Schedule as ScheduleIcon,
  Send as SendIcon,
  Analytics as AnalyticsIcon,
  ExpandMore,
  ExpandLess,
  Business as BusinessIcon,
  Chat as ChatIcon,
  Psychology as PsychologyIcon,
} from "@mui/icons-material";
import { useCreateSchedule } from "../../hooks/schedules/useScheduleMutations";
import { useCompanyMap } from "../../hooks/maps/useCompanyMap";
import { useBotMap } from "../../hooks/maps/useBotMap";
import { usePromptMap } from "../../hooks/maps/usePromptMap";
import { useChatsQuery } from "../../hooks/chats/useChatsQuery";
import { ModalSkeleton } from "../../components/skeleton/modalSkeleton";
import { SelectSkeleton } from "../../components/skeleton/selectSkeleton";
import { ScheduleTypeFields } from "./components/scheduleTypeFields";
import { SendStrategyFields } from "./components/sendStrategyFields";
import { TargetChatSelector } from "./components/targetChatSelector";
import { useScheduleValidation } from "./helpers/useScheduleValidation";
import { useAuth } from "../../context/authContext";
import {
  convertToServerTime,
  generateCronExpressionWithTimeConversion,
} from "./helpers/scheduleUtils";
import { InfoCard } from "../../components/infoCard";

interface AddScheduleModalProps {
  open: boolean;
  onClose: () => void;
}

type ScheduleType = "interval" | "cron";
type SendStrategy = "fixed" | "relative";
type ScheduleStrategy = "analysis" | "notification";

export const AddScheduleModal: React.FC<AddScheduleModalProps> = ({
  open,
  onClose,
}) => {
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

  const handleToggleChange = (field: string, value: string) => {
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

      onClose();
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
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <ScheduleIcon color="primary" />
          Создать автоматическое расписание
          <Box sx={{ flexGrow: 1 }} />
          <Button
            variant="text"
            onClick={() => setShowHelp(!showHelp)}
            endIcon={showHelp ? <ExpandLess /> : <ExpandMore />}
            size="small"
          >
            Что такое расписание?
          </Button>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Collapse in={showHelp}>
          <InfoCard
            type="info"
            title="Что такое расписание?"
            description="Расписание позволяет автоматически выполнять анализ чатов или отправлять уведомления по заданному графику. Вы можете настроить регулярные отчеты, напоминания или другие автоматизированные задачи."
          />
        </Collapse>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 1 }}>
          {/* Выбор компании для суперадмина */}
          {isSuperadmin && (
            <FormControl fullWidth error={!!errors.company_id}>
              <InputLabel>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <BusinessIcon fontSize="small" />
                  Компания
                </Box>
              </InputLabel>
              <Select
                name="company_id"
                value={scheduleData.company_id}
                label="Компания"
                onChange={handleSelectChange}
              >
                {Array.from(companyMap.entries()).map(([id, name]) => (
                  <MenuItem key={id} value={id}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {name}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
              {errors.company_id && (
                <Typography variant="caption" color="error">
                  {errors.company_id}
                </Typography>
              )}
            </FormControl>
          )}
          <TextField
            name="schedule_name"
            label="Название расписания"
            value={scheduleData.schedule_name}
            onChange={handleChange}
            fullWidth
            error={!!errors.schedule_name}
            helperText={
              errors.schedule_name || "Укажите название для расписания"
            }
          />

          <TextField
            name="description"
            label="Описание (необязательно)"
            value={scheduleData.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={2}
            helperText="Краткое описание назначения расписания"
          />

          {/* Выбор бота */}
          {isLoadingBotMap ? (
            <SelectSkeleton />
          ) : (
            renderWithTooltip(
              <Box>
                <FormControl fullWidth error={!!errors.bot_id}>
                  <InputLabel>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <ChatIcon fontSize="small" />
                      Telegram-бот
                    </Box>
                  </InputLabel>
                  <Select
                    name="bot_id"
                    value={scheduleData.bot_id}
                    label="Telegram-бот"
                    onChange={handleSelectChange}
                    disabled={!isCompanySelected}
                  >
                    {Array.from(botMap.entries()).map(([id, name]) => (
                      <MenuItem key={id} value={id}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          {name}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.bot_id && (
                    <Typography variant="caption" color="error">
                      {errors.bot_id}
                    </Typography>
                  )}
                </FormControl>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 0.5, display: "block" }}
                >
                  Выберите бота, который будет отправлять сообщения
                </Typography>
              </Box>,
              !isCompanySelected,
              tooltipMessageCompany
            )
          )}

          {/* Тип задачи */}
          <Box>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <AnalyticsIcon fontSize="small" />
              Что будем делать?
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button
                variant={
                  scheduleData.schedule_strategy === "analysis"
                    ? "contained"
                    : "outlined"
                }
                onClick={() =>
                  handleToggleChange("schedule_strategy", "analysis")
                }
                disabled={!isCompanySelected}
                startIcon={<AnalyticsIcon />}
                sx={{ flex: 1 }}
              >
                Анализировать чаты
              </Button>
              <Button
                variant={
                  scheduleData.schedule_strategy === "notification"
                    ? "contained"
                    : "outlined"
                }
                onClick={() =>
                  handleToggleChange("schedule_strategy", "notification")
                }
                disabled={!isCompanySelected}
                startIcon={<SendIcon />}
                sx={{ flex: 1 }}
              >
                Отправлять уведомления
              </Button>
            </Stack>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 1, display: "block" }}
            >
              {scheduleData.schedule_strategy === "analysis"
                ? "Система будет анализировать сообщения в выбранном чате и отправлять результаты"
                : "Система будет отправлять заранее написанные уведомления"}
            </Typography>
          </Box>

          {/* Настройки для уведомлений */}
          {scheduleData.schedule_strategy === "notification" && (
            <Box>
              <TextField
                name="notification_text"
                label="Текст уведомления"
                value={scheduleData.notification_text}
                onChange={handleChange}
                fullWidth
                multiline
                rows={4}
                error={!!errors.notification_text}
                helperText={
                  errors.notification_text ||
                  "Напишите текст, который будет отправляться по расписанию"
                }
                placeholder="Например: Напоминаем о еженедельном совещании в понедельник в 10:00"
              />
            </Box>
          )}

          {/* Настройки для анализа */}
          {scheduleData.schedule_strategy === "analysis" && (
            <>
              {/* Выбор чата для анализа */}
              {isLoadingChatsMap ? (
                <SelectSkeleton />
              ) : (
                renderWithTooltip(
                  <Box>
                    <FormControl fullWidth error={!!errors.chat_id}>
                      <InputLabel>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <ChatIcon fontSize="small" />
                          Какой чат анализировать?
                        </Box>
                      </InputLabel>
                      <Select
                        name="chat_id"
                        value={scheduleData.chat_id}
                        label="Какой чат анализировать?"
                        onChange={handleSelectChange}
                        disabled={!isBotSelected}
                      >
                        {Array.from(chatMap.entries()).map(([id, name]) => (
                          <MenuItem key={id} value={id.toString()}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              {name}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.chat_id && (
                        <Typography variant="caption" color="error">
                          {errors.chat_id}
                        </Typography>
                      )}
                    </FormControl>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mt: 0.5, display: "block" }}
                    >
                      Выберите чат, сообщения которого будут анализироваться
                    </Typography>
                  </Box>,
                  !isCompanySelected || !isBotSelected,
                  !isCompanySelected ? tooltipMessageCompany : tooltipMessageBot
                )
              )}

              {/* Выбор промпта */}
              {isLoadingPromptMap ? (
                <SelectSkeleton />
              ) : (
                renderWithTooltip(
                  <Box>
                    <FormControl fullWidth error={!!errors.prompt_id}>
                      <InputLabel>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <PsychologyIcon fontSize="small" />
                          Как анализировать?
                        </Box>
                      </InputLabel>
                      <Select
                        name="prompt_id"
                        value={scheduleData.prompt_id}
                        label="Как анализировать?"
                        onChange={handleSelectChange}
                        disabled={!isCompanySelected}
                      >
                        {Array.from(promptMap.entries()).map(([id, name]) => (
                          <MenuItem key={id} value={id}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              {name}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.prompt_id && (
                        <Typography variant="caption" color="error">
                          {errors.prompt_id}
                        </Typography>
                      )}
                    </FormControl>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mt: 0.5, display: "block" }}
                    >
                      Выберите промпт, который определяет, что именно искать в
                      сообщениях
                    </Typography>
                  </Box>,
                  !isCompanySelected,
                  tooltipMessageCompany
                )
              )}

              {/* Заголовок сообщения */}
              <Box>
                <TextField
                  name="message_intro"
                  label="Заголовок отчета (необязательно)"
                  value={scheduleData.message_intro}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  rows={2}
                  inputProps={{ maxLength: 255 }}
                  helperText={`Этот текст будет добавлен в начало каждого отчета`}
                  placeholder="Например: Еженедельный отчет по активности чата"
                />
              </Box>
            </>
          )}

          {/* Куда отправлять результаты */}
          {isBotSelected && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Куда отправлять результаты?
              </Typography>
              <TargetChatSelector
                chatMap={chatMap}
                selectedChats={scheduleData.target_chats}
                onChatToggle={handleChatToggle}
                disabled={!isCompanySelected || !isBotSelected}
                error={errors.target_chats}
                tooltipMessage={
                  !isCompanySelected ? tooltipMessageCompany : tooltipMessageBot
                }
                showTitle={false}
              />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 1, display: "block" }}
              >
                Выберите чаты, в которые будут отправляться результаты анализа
                или уведомления
              </Typography>
            </Box>
          )}

          {/* Когда запускать */}
          <Box>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <ScheduleIcon fontSize="small" />
              Когда запускать?
            </Typography>
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              <Button
                variant={
                  scheduleData.schedule_type === "interval"
                    ? "contained"
                    : "outlined"
                }
                onClick={() => handleToggleChange("schedule_type", "interval")}
                disabled={!isCompanySelected}
                sx={{ flex: 1 }}
              >
                Повторять каждые...
              </Button>
              <Button
                variant={
                  scheduleData.schedule_type === "cron"
                    ? "contained"
                    : "outlined"
                }
                onClick={() => handleToggleChange("schedule_type", "cron")}
                disabled={!isCompanySelected}
                sx={{ flex: 1 }}
              >
                По дням недели
              </Button>
            </Stack>

            <ScheduleTypeFields
              scheduleType={scheduleData.schedule_type}
              intervalHours={scheduleData.interval_hours}
              intervalMinutes={scheduleData.interval_minutes}
              cronTime={cronTime}
              selectedDays={selectedDays}
              errors={errors}
              disabled={!isCompanySelected}
              tooltipMessage={tooltipMessageCompany}
              onFieldChange={handleChange}
              onCronTimeChange={setCronTime}
              onToggleDay={toggleDaySelection}
            />
          </Box>

          {/* Когда отправлять результаты (только для анализа) */}
          {scheduleData.schedule_strategy === "analysis" && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Когда отправлять результаты?
              </Typography>
              <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <Button
                  variant={
                    scheduleData.send_strategy === "fixed"
                      ? "contained"
                      : "outlined"
                  }
                  onClick={() => handleToggleChange("send_strategy", "fixed")}
                  disabled={!isCompanySelected}
                  sx={{ flex: 1 }}
                >
                  В определенное время
                </Button>
                <Button
                  variant={
                    scheduleData.send_strategy === "relative"
                      ? "contained"
                      : "outlined"
                  }
                  onClick={() =>
                    handleToggleChange("send_strategy", "relative")
                  }
                  disabled={!isCompanySelected}
                  sx={{ flex: 1 }}
                >
                  После анализа
                </Button>
              </Stack>

              <SendStrategyFields
                sendStrategy={scheduleData.send_strategy}
                timeToSend={scheduleData.time_to_send}
                sendAfterMinutes={scheduleData.send_after_minutes}
                errors={errors}
                disabled={!isCompanySelected}
                tooltipMessage={tooltipMessageCompany}
                onFieldChange={handleChange}
              />
            </Box>
          )}

          {/* Статус */}
          <Box>
            <FormControl fullWidth>
              <InputLabel>Статус расписания</InputLabel>
              <Select
                name="enabled"
                value={scheduleData.enabled ? "true" : "false"}
                label="Статус расписания"
                onChange={(e) =>
                  setScheduleData((prev) => ({
                    ...prev,
                    enabled: e.target.value === "true",
                  }))
                }
                disabled={!isCompanySelected}
              >
                <MenuItem value="true">
                  <Typography color="text.secondary">
                    <Chip
                      label="Включено"
                      color="success"
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    Расписание будет работать
                  </Typography>
                </MenuItem>
                <MenuItem value="false">
                  <Typography color="text.secondary">
                    <Chip
                      label="Выключено"
                      color="default"
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    Расписание приостановлено
                  </Typography>
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} size="large">
          Отмена
        </Button>
        <Tooltip title={!isCompanySelected ? tooltipMessageCompany : ""}>
          <span>
            <Button
              onClick={handleSubmit}
              variant="contained"
              color="primary"
              disabled={!isCompanySelected}
              size="large"
              startIcon={
                createSchedule.isPending ? (
                  <CircularProgress size={16} />
                ) : (
                  <ScheduleIcon />
                )
              }
            >
              {createSchedule.isPending ? "Создаем..." : "Создать расписание"}
            </Button>
          </span>
        </Tooltip>
      </DialogActions>
    </Dialog>
  );
};
