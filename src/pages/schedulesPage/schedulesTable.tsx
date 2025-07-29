"use client";

import type React from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  Box,
  Avatar,
  Tooltip,
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
} from "@mui/icons-material";
import type { ISchedule } from "../../api/schedulesApi";
import { useCompanyMap } from "../../hooks/maps/useCompanyMap";
import { useBotMap } from "../../hooks/maps/useBotMap";
import { useChatMap } from "../../hooks/maps/useChatMap";
import { TableSkeleton } from "../../components/skeleton/tableSkeleton";
import { SortableTableHeader } from "../../components/table/sortableTableHeader";

type SortField =
  | "bot_id"
  | "enabled"
  | "company_id"
  | "created_at"
  | "last_run_at"
  | "schedule_strategy"
  | "schedule_type";

interface SchedulesTableProps {
  schedules: ISchedule[];
  developerMode: boolean;
  isSuperadmin: boolean;
  sortField: SortField;
  sortDirection: "asc" | "desc";
  onSort: (field: SortField) => void;
  isLoading?: boolean;
}

export const SchedulesTable: React.FC<SchedulesTableProps> = ({
  schedules,
  developerMode,
  isSuperadmin,
  sortField,
  sortDirection,
  onSort,
  isLoading = false,
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

  const getBotAvatar = (botName: string) => {
    const initials = botName
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    return (
      <Avatar
        sx={{
          width: 32,
          height: 32,
          bgcolor: "primary.main",
          fontSize: "0.875rem",
        }}
      >
        {initials}
      </Avatar>
    );
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        <Typography variant="body2" fontWeight={500}>
          {date.toLocaleDateString("ru-RU", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {date.toLocaleTimeString("ru-RU", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Typography>
      </Box>
    );
  };

  if (isLoading) {
    const columns = 5;
    const additionalColumns =
      (developerMode ? 1 : 0) +
      (isSuperadmin ? 1 : 0) +
      (developerMode ? 1 : 0);

    return (
      <TableSkeleton
        columns={columns}
        additionalColumns={additionalColumns}
        developerMode={developerMode}
      />
    );
  }

  return (
    <Paper elevation={2} sx={{ overflow: "hidden", borderRadius: 2 }}>
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="schedules table">
          <TableHead>
            <TableRow>
              {developerMode && (
                <TableCell sx={{ fontWeight: 600, width: "80px" }}>
                  ID
                </TableCell>
              )}
              <SortableTableHeader<SortField>
                field="bot_id"
                currentSortField={sortField}
                sortDirection={sortDirection}
                onSort={onSort}
                label="Telegram Бот"
                // sx={{ minWidth: "180px" }}
              />
              <SortableTableHeader<SortField>
                field="schedule_strategy"
                currentSortField={sortField}
                sortDirection={sortDirection}
                onSort={onSort}
                label="Тип задачи"
                // sx={{ minWidth: "180px" }}
              />
              <SortableTableHeader<SortField>
                field="schedule_type"
                currentSortField={sortField}
                sortDirection={sortDirection}
                onSort={onSort}
                label="Когда выполнять"
                // sx={{ minWidth: "180px" }}
              />
              <SortableTableHeader<SortField>
                field="enabled"
                currentSortField={sortField}
                sortDirection={sortDirection}
                onSort={onSort}
                label="Статус"
                // sx={{ width: "140px" }}
              />
              {isSuperadmin && (
                <SortableTableHeader<SortField>
                  field="company_id"
                  currentSortField={sortField}
                  sortDirection={sortDirection}
                  onSort={onSort}
                  label="Компания"
                  // sx={{ minWidth: "150px" }}
                />
              )}
              <SortableTableHeader<SortField>
                field="last_run_at"
                currentSortField={sortField}
                sortDirection={sortDirection}
                onSort={onSort}
                label="Последнее выполнение"
                defaultDirection="desc"
                // sx={{ minWidth: "160px" }}
              />
              {developerMode && (
                <SortableTableHeader<SortField>
                  field="created_at"
                  currentSortField={sortField}
                  sortDirection={sortDirection}
                  onSort={onSort}
                  label="Дата создания"
                  defaultDirection="desc"
                  // sx={{ minWidth: "160px" }}
                />
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {schedules.map((schedule) => {
              const strategyInfo = getScheduleStrategyInfo(
                schedule.schedule_strategy
              );
              const typeInfo = getScheduleTypeInfo(schedule.schedule_type);
              const sendStrategyInfo =
                schedule.schedule_strategy === "analysis"
                  ? getSendStrategyInfo(schedule.send_strategy!)
                  : null;
              const botName =
                botMap.get(schedule.bot_id.toString()) ||
                `Бот ${schedule.bot_id}`;

              return (
                <TableRow
                  key={schedule.schedule_id}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    "&:hover": {
                      backgroundColor: "action.hover",
                      cursor: "pointer",
                    },
                    transition: "background-color 0.2s ease",
                  }}
                  onClick={() => navigate(`/schedules/${schedule.schedule_id}`)}
                >
                  {developerMode && (
                    <TableCell component="th" scope="row">
                      <Typography
                        variant="body2"
                        fontFamily="monospace"
                        color="text.secondary"
                      >
                        #{schedule.schedule_id}
                      </Typography>
                    </TableCell>
                  )}

                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      {getBotAvatar(botName)}
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          {botName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: {schedule.bot_id}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Box sx={{ display: "grid", gap: 1 }}>
                      <Tooltip title={strategyInfo.description}>
                        <Chip
                          icon={strategyInfo.icon}
                          label={strategyInfo.label}
                          color={strategyInfo.color}
                          variant="outlined"
                          size="small"
                          sx={{ width: "fit-content" }}
                        />
                      </Tooltip>
                      {schedule.schedule_strategy === "analysis" && (
                        <Tooltip title="Чат для анализа">
                          <Chip
                            label={
                              chatMap.get(schedule.chat_id!) ||
                              `Чат ${schedule.chat_id}`
                            }
                            variant="outlined"
                            color="default"
                            size="small"
                            sx={{ width: "fit-content" }}
                          />
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Box sx={{ display: "grid", gap: 1 }}>
                      <Tooltip title={typeInfo.description}>
                        <Chip
                          icon={typeInfo.icon}
                          label={typeInfo.label}
                          color={typeInfo.color}
                          variant="outlined"
                          size="small"
                          sx={{ width: "fit-content" }}
                        />
                      </Tooltip>
                      {sendStrategyInfo && (
                        <Tooltip title="Стратегия отправки">
                          <Chip
                            icon={sendStrategyInfo.icon}
                            label={sendStrategyInfo.label}
                            color={sendStrategyInfo.color}
                            variant="outlined"
                            size="small"
                            sx={{ width: "fit-content" }}
                          />
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                      }}
                    >
                      {schedule.enabled ? (
                        <Chip
                          icon={<CheckCircle fontSize="small" />}
                          label="Активно"
                          color="success"
                          variant="outlined"
                          size="small"
                        />
                      ) : (
                        <Chip
                          icon={<PauseCircleFilled fontSize="small" />}
                          label="Приостановлено"
                          color="error"
                          variant="outlined"
                          size="small"
                        />
                      )}
                    </Box>
                  </TableCell>

                  {isSuperadmin && (
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <CompanyIcon color="action" fontSize="small" />
                        <Typography variant="body2">
                          {companyMap.get(schedule.company_id) ||
                            `Компания ${schedule.company_id}`}
                        </Typography>
                      </Box>
                    </TableCell>
                  )}

                  <TableCell>
                    {schedule.last_run_at ? (
                      formatDateTime(schedule.last_run_at)
                    ) : (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontStyle="italic"
                      >
                        Еще не выполнялось
                      </Typography>
                    )}
                  </TableCell>

                  {developerMode && (
                    <TableCell>{formatDateTime(schedule.created_at)}</TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};
