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
import { ModalSkeleton } from "../../../components/skeleton/modalSkeleton";
import { SelectSkeleton } from "../../../components/skeleton/selectSkeleton";
import { ScheduleTypeFields } from "../components/scheduleTypeFields";
import { SendStrategyFields } from "../components/sendStrategyFields";
import { TargetChatSelector } from "../components/targetChatSelector";
import { InfoCard } from "../../../components/infoCard";
import { useScheduleModalLogic } from "../helpers/useScheduleModalLogic";
import { useAuth } from "../../../context/authContext";

interface AddScheduleModalProps {
  open: boolean;
  onClose: () => void;
}

export const AddScheduleModalDesktop: React.FC<AddScheduleModalProps> = ({
  open,
  onClose,
}) => {
  const { isSuperadmin } = useAuth();

  const {
    scheduleData,
    setScheduleData,
    cronTime,
    setCronTime,
    selectedDays,
    setSelectedDays,
    showHelp,
    setShowHelp,
    errors,
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
  } = useScheduleModalLogic();

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
            </Box>
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
                </Box>
              )}

              {/* Выбор промпта */}
              {isLoadingPromptMap ? (
                <SelectSkeleton />
              ) : (
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
                </Box>
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

              {/* Обработка пустых чатов */}
              <Box>
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  Если сообщений нет:
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Button
                    variant={
                      !scheduleData.run_on_empty_chat ? "contained" : "outlined"
                    }
                    onClick={() =>
                      handleBooleanChange("run_on_empty_chat", false)
                    }
                    sx={{ flex: 1 }}
                  >
                    Пропускать анализ
                  </Button>
                  <Button
                    variant={
                      !!scheduleData.run_on_empty_chat
                        ? "contained"
                        : "outlined"
                    }
                    onClick={() =>
                      handleBooleanChange("run_on_empty_chat", true)
                    }
                    sx={{ flex: 1 }}
                  >
                    Выполнять анализ
                  </Button>
                </Stack>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 1, display: "block" }}
                >
                  {scheduleData.run_on_empty_chat
                    ? "Выполнять анализ даже при отсутствии сообщений - бот напишет в чат"
                    : "Не выполнять анализ, если нет сообщений - в чат ничего не прийдет"}
                </Typography>
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
      </DialogActions>
    </Dialog>
  );
};
