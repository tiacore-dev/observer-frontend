"use client";

import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Avatar,
  Tooltip,
  IconButton,
  CircularProgress,
  Stack,
} from "@mui/material";
import {
  Schedule as ScheduleIcon,
  Notifications as NotificationIcon,
  Analytics as AnalysisIcon,
  AccessTime as TimeIcon,
  Business as CompanyIcon,
  CalendarToday as CalendarIcon,
  CheckCircle,
  PauseCircleFilled,
  ScheduleSend as FixedStrategyIcon,
  TrendingFlat as RelativeStrategyIcon,
  PowerSettingsNew as ToggleIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import type { ISchedule } from "../../../api/schedulesApi";
import { useToggleSchedule } from "../../../hooks/schedules/useScheduleMutations";
import { useCompanyMap } from "../../../hooks/maps/useCompanyMap";
import { useBotMap } from "../../../hooks/maps/useBotMap";
import { useChatMap } from "../../../hooks/maps/useChatMap";

interface ScheduleCardProps {
  schedule: ISchedule;
  developerMode: boolean;
  isSuperadmin: boolean;
  onToggle: (scheduleId: string) => Promise<void>;
}

export const ScheduleCard: React.FC<ScheduleCardProps> = ({
  schedule,
  developerMode,
  isSuperadmin,
  onToggle,
}) => {
  const navigate = useNavigate();
  const companyMap = useCompanyMap().companyMap;
  const botMap = useBotMap().botMap;
  const chatMap = useChatMap().chatMap;

  const getScheduleStrategyInfo = (strategy: string) => {
    switch (strategy) {
      case "analysis":
        return {
          label: "Анализ чата",
          icon: <AnalysisIcon sx={{ fontSize: 16 }} />,
          color: "primary" as const,
          description: "Автоматический анализ сообщений",
        };
      case "notification":
        return {
          label: "Уведомления",
          icon: <NotificationIcon sx={{ fontSize: 16 }} />,
          color: "default" as const,
          description: "Отправка уведомлений",
        };
      default:
        return {
          label: strategy,
          icon: <ScheduleIcon sx={{ fontSize: 16 }} />,
          color: "default" as const,
          description: strategy,
        };
    }
  };

  const getScheduleTypeInfo = (type: string) => {
    switch (type) {
      case "interval":
        return {
          label: "По интервалу",
          icon: <TimeIcon sx={{ fontSize: 16 }} />,
          color: "warning" as const,
          description: "Выполняется через определенные промежутки времени",
        };
      case "cron":
        return {
          label: "По расписанию",
          icon: <CalendarIcon sx={{ fontSize: 16 }} />,
          color: "info" as const,
          description: "Выполняется в определенные дни и время",
        };
      case "once":
        return {
          label: "Однократно",
          icon: <ScheduleIcon sx={{ fontSize: 16 }} />,
          color: "warning" as const,
          description: "Выполняется один раз",
        };
      case "daily_time":
        return {
          label: "Ежедневно",
          icon: <CalendarIcon sx={{ fontSize: 16 }} />,
          color: "success" as const,
          description: "Выполняется каждый день в определенное время",
        };
      default:
        return {
          label: type,
          icon: <ScheduleIcon sx={{ fontSize: 16 }} />,
          color: "default" as const,
          description: type,
        };
    }
  };

  const getSendStrategyInfo = (strategy: string) => {
    switch (strategy) {
      case "fixed":
        return {
          label: "В определенное время",
          icon: <FixedStrategyIcon sx={{ fontSize: 16 }} />,
          color: "default" as const,
        };
      case "relative":
        return {
          label: "После выполнения",
          icon: <RelativeStrategyIcon sx={{ fontSize: 16 }} />,
          color: "default" as const,
        };
      default:
        return {
          label: strategy,
          icon: <ScheduleIcon sx={{ fontSize: 16 }} />,
          color: "default" as const,
        };
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderTargetChats = (targetChats: number[]) => {
    if (!targetChats || targetChats.length === 0) {
      return (
        <Typography variant="body2" color="text.secondary" fontStyle="italic">
          Не указаны
        </Typography>
      );
    }

    const visibleChats = targetChats.slice(0, 2);
    const remainingCount = targetChats.length - visibleChats.length;

    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          flexWrap: "wrap",
        }}
      >
        {visibleChats.map((chatId) => (
          <Chip
            key={chatId}
            label={chatMap.get(chatId) || `Чат ${chatId}`}
            size="small"
            variant="outlined"
          />
        ))}
        {remainingCount > 0 && (
          <Chip
            label={`[+${remainingCount}]`}
            size="small"
            variant="outlined"
            color="default"
          />
        )}
      </Box>
    );
  };

  const botName =
    botMap.get(schedule.bot_id.toString()) || `Бот ${schedule.bot_id}`;
  const strategyInfo = getScheduleStrategyInfo(schedule.schedule_strategy);
  const typeInfo = getScheduleTypeInfo(schedule.schedule_type);
  const sendStrategyInfo =
    schedule.schedule_strategy === "analysis"
      ? getSendStrategyInfo(schedule.send_strategy!)
      : null;

  return (
    <Card
      sx={{
        borderRadius: 1,
        mb: 1,
        "&:hover": {
          boxShadow: 3,
          cursor: "pointer",
        },
      }}
      onClick={() => navigate(`/schedules/${schedule.schedule_id}`)}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {schedule.enabled ? (
              <CheckCircle color="success" />
            ) : (
              <PauseCircleFilled color="error" />
            )}
            <Typography variant="h6" fontWeight={600}>
              {schedule.schedule_name || "Без названия"}
            </Typography>
          </Box>
          <Tooltip
            title={schedule.enabled ? "Остановить" : "Запустить"}
            onClick={(e) => {
              e.stopPropagation();
              onToggle(schedule.schedule_id);
            }}
          >
            <IconButton
              sx={{
                color: schedule.enabled ? "error.main" : "success.main",
              }}
            >
              <ToggleIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {schedule.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {schedule.description}
          </Typography>
        )}

        <Stack spacing={1.5}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Бот
            </Typography>
            <Typography variant="body2">{botName}</Typography>
            {developerMode && (
              <Typography variant="caption" color="text.secondary">
                ID: {schedule.bot_id}
              </Typography>
            )}
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary">
              Тип задачи
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mt: 0.5, flexWrap: "wrap" }}>
              <Tooltip title={strategyInfo.description}>
                <Chip
                  icon={strategyInfo.icon}
                  label={strategyInfo.label}
                  color={strategyInfo.color}
                  size="small"
                />
              </Tooltip>
              <Tooltip title={typeInfo.description}>
                <Chip
                  icon={typeInfo.icon}
                  label={typeInfo.label}
                  color={typeInfo.color}
                  size="small"
                />
              </Tooltip>
              {sendStrategyInfo && (
                <Chip
                  icon={sendStrategyInfo.icon}
                  label={sendStrategyInfo.label}
                  color={sendStrategyInfo.color}
                  size="small"
                />
              )}
            </Box>
          </Box>

          {schedule.schedule_strategy === "analysis" && schedule.chat_id && (
            <Box>
              <Typography variant="caption" color="text.secondary">
                Анализируемый чат
              </Typography>
              <Typography variant="body2">
                {chatMap.get(schedule.chat_id) || `Чат ${schedule.chat_id}`}
              </Typography>
            </Box>
          )}

          <Box>
            <Typography variant="caption" color="text.secondary">
              Куда отправлять
            </Typography>
            {renderTargetChats(schedule.target_chats || [])}
          </Box>

          {isSuperadmin && (
            <Box>
              <Typography variant="caption" color="text.secondary">
                Компания
              </Typography>
              <Typography variant="body2">
                {companyMap.get(schedule.company_id) ||
                  `Компания ${schedule.company_id}`}
              </Typography>
            </Box>
          )}

          <Box>
            <Typography variant="caption" color="text.secondary">
              Последнее выполнение
            </Typography>
            <Typography variant="body2">
              {schedule.last_run_at
                ? formatDateTime(schedule.last_run_at)
                : "Еще не выполнялось"}
            </Typography>
          </Box>

          {developerMode && (
            <Box>
              <Typography variant="caption" color="text.secondary">
                Дата создания
              </Typography>
              <Typography variant="body2">
                {formatDateTime(schedule.created_at)}
              </Typography>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};
