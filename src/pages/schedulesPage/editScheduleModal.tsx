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
  TextField,
  Stack,
  Alert,
  AlertTitle,
  Chip,
  Collapse,
} from "@mui/material";
import {
  Info as InfoIcon,
  Schedule as ScheduleIcon,
  Send as SendIcon,
  Analytics as AnalyticsIcon,
  Notifications as NotificationsIcon,
  Business as BusinessIcon,
  Chat as ChatIcon,
  Psychology as PsychologyIcon,
} from "@mui/icons-material";
import type { ISchedule, IScheduleEdit } from "../../api/schedulesApi";
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
import { useScheduleChanges } from "./helpers/useScheduleChanges";
import {
  convertToServerTime,
  generateCronExpressionWithTimeConversion,
  parseCronExpression,
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

  const { data: chatsData, isLoading: isLoadingChatsMap } = useChatsQuery(
    getCurrentValue("bot_id") ? Number(getCurrentValue("bot_id")) : undefined,
    getCurrentStringValue("company_id")
  );

  const chatMap = new Map(
    chatsData?.chats?.map((chat) => [
      chat.chat_id,
      chat.chat_name || `Chat ${chat.chat_id}`,
    ]) || []
  );

  const isCompanySelected = !!getCurrentStringValue("company_id");
  const isBotSelected = !!getCurrentValue("bot_id");
  const tooltipMessageCompany = "Сначала выберите компанию";
  const tooltipMessageBot = "Сначала выберите бота";

  React.useEffect(() => {
    if (schedule.schedule_type === "cron" && schedule.cron_expression) {
      const { localTime, days } = parseCronExpression(schedule.cron_expression);
      setCronTime(localTime);
      setSelectedDays(days);
    }

    if (schedule.time_to_send) {
      updateField("time_to_send", convertToServerTime(schedule.time_to_send));
    }
  }, [schedule]);

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
    updateField(name, value);
  };

  const handleSelectChange = (e: { target: { name: string; value: any } }) => {
    const { name, value } = e.target;

    if (name === "bot_id") {
      updateField(name, value);
      updateField("chat_id", 0);
      updateTargetChats([]);
    } else if (name === "company_id") {
      return;
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

  const handleToggleChange = (field: string, value: string) => {
    updateField(field, value);
  };

  const handleSubmit = async () => {
    const dataForValidation = {
      schedule_strategy: getCurrentValue("schedule_strategy"),
      notification_text:
        getCurrentStringValue("notification_text") || undefined,
      chat_id: getCurrentValue("chat_id"),
      prompt_id: getCurrentStringValue("prompt_id"),
      schedule_type: getCurrentValue("schedule_type"),
      target_chats: currentTargetChats,
      bot_id: getCurrentValue("bot_id"),
      send_strategy: getCurrentValue("send_strategy") || "fixed",
      interval_hours: getCurrentNumberValue("interval_hours"),
      interval_minutes: getCurrentNumberValue("interval_minutes"),
      time_to_send: getCurrentStringValue("time_to_send"),
      send_after_minutes: getCurrentNumberValue("send_after_minutes"),
      company_id: getCurrentStringValue("company_id"),
      message_intro: getCurrentStringValue("message_intro") || undefined,
    };

    if (!validateFields(dataForValidation, selectedDays, cronTime)) return;

    if (!hasAnyChanges) {
      onClose();
      return;
    }

    try {
      const changedData = getChangedData();
      const dataToUpdate: Partial<IScheduleEdit> = { ...changedData };

      const currentScheduleType = getCurrentValue("schedule_type");
      if (
        currentScheduleType === "cron" &&
        (changedData.schedule_type || selectedDays.length > 0)
      ) {
        dataToUpdate.cron_expression = generateCronExpressionWithTimeConversion(
          cronTime,
          selectedDays
        );
      }

      if (changedData.time_to_send) {
        dataToUpdate.time_to_send = `${convertToServerTime(
          changedData.time_to_send
        )}:00`;
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
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <ScheduleIcon color="primary" />
          Редактировать расписание
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 1 }}>
          {/* Выбор компании */}
          {isLoadingCompanyMap ? (
            <SelectSkeleton />
          ) : (
            <FormControl fullWidth error={!!errors.company_id}>
              <InputLabel>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <BusinessIcon fontSize="small" />
                  Компания
                </Box>
              </InputLabel>
              <Select
                name="company_id"
                value={getCurrentStringValue("company_id") || ""}
                label="Компания"
                onChange={handleSelectChange}
                disabled
              >
                {Array.from(companyMap.entries()).map(([id, name]) => (
                  <MenuItem key={id} value={id}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {name}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

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
                    value={getCurrentValue("bot_id") || ""}
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
                  getCurrentValue("schedule_strategy") === "analysis"
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
                  getCurrentValue("schedule_strategy") === "notification"
                    ? "contained"
                    : "outlined"
                }
                onClick={() =>
                  handleToggleChange("schedule_strategy", "notification")
                }
                disabled={!isCompanySelected}
                startIcon={<NotificationsIcon />}
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
              {getCurrentValue("schedule_strategy") === "analysis"
                ? "Система будет анализировать сообщения в выбранном чате и отправлять результаты"
                : "Система будет отправлять заранее написанные уведомления"}
            </Typography>
          </Box>

          {/* Настройки для уведомлений */}
          {getCurrentValue("schedule_strategy") === "notification" && (
            <Box>
              <TextField
                name="notification_text"
                label="Текст уведомления"
                value={getCurrentStringValue("notification_text") || ""}
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
          {getCurrentValue("schedule_strategy") === "analysis" && (
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
                        value={getCurrentValue("chat_id") || ""}
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
                        value={getCurrentStringValue("prompt_id") || ""}
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
                  value={getCurrentStringValue("message_intro") || ""}
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
                selectedChats={currentTargetChats}
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
                  getCurrentValue("schedule_type") === "interval"
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
                  getCurrentValue("schedule_type") === "cron"
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
              scheduleType={getCurrentValue("schedule_type")}
              intervalHours={getCurrentNumberAsString("interval_hours")}
              intervalMinutes={getCurrentNumberAsString("interval_minutes")}
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
          {getCurrentValue("schedule_strategy") === "analysis" && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Когда отправлять результаты?
              </Typography>
              <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <Button
                  variant={
                    getCurrentValue("send_strategy") === "fixed"
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
                    getCurrentValue("send_strategy") === "relative"
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
                sendStrategy={getCurrentValue("send_strategy") || "fixed"}
                timeToSend={getCurrentStringValue("time_to_send")}
                sendAfterMinutes={getCurrentNumberAsString(
                  "send_after_minutes"
                )}
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
                value={getCurrentBooleanValue("enabled") ? "true" : "false"}
                label="Статус расписания"
                onChange={(e) =>
                  updateField("enabled", e.target.value === "true")
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
          {/* Информационное уведомление */}
          <Collapse in={hasAnyChanges}>
            <Alert severity="warning" sx={{ mb: 2 }}>
              <AlertTitle>Есть несохраненные изменения</AlertTitle>
            </Alert>
          </Collapse>
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
              disabled={!isCompanySelected || !hasAnyChanges}
              size="large"
              startIcon={
                isSubmitting ? <CircularProgress size={16} /> : <ScheduleIcon />
              }
            >
              {isSubmitting ? "Сохранение..." : "Сохранить изменения"}
            </Button>
          </span>
        </Tooltip>
      </DialogActions>
    </Dialog>
  );
};
