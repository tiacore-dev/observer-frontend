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
} from "@mui/material";
import {
  Schedule as ScheduleIcon,
  SmartToy as BotIcon,
  Notifications as NotificationIcon,
  Analytics as AnalysisIcon,
  AccessTime as TimeIcon,
  CheckCircle as EnabledIcon,
  Cancel as DisabledIcon,
  Business as CompanyIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";
import type { ISchedule } from "../../api/schedulesApi";
import { useCompanyMap } from "../../hooks/maps/useCompanyMap";
import { useBotMap } from "../../hooks/maps/useBotMap";
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

  // Используем хуки для маппингов
  const companyMap = useCompanyMap().companyMap;
  const botMap = useBotMap().botMap;

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
          color: "info" as const,
          description: "Выполняется через определенные промежутки времени",
        };
      case "cron":
        return {
          label: "По расписанию",
          icon: <CalendarIcon sx={{ fontSize: 16 }} />,
          color: "default" as const,
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

  if (isLoading) {
    const columns = 5; // Основные колонки
    const additionalColumns =
      (developerMode ? 1 : 0) + // Колонка ID если developerMode
      (isSuperadmin ? 1 : 0) + // Колонка компании если isSuperadmin
      (developerMode ? 1 : 0); // Колонка даты если developerMode

    return (
      <TableSkeleton
        columns={columns}
        additionalColumns={additionalColumns}
        developerMode={developerMode}
      />
    );
  }

  return (
    <Paper elevation={2} sx={{ overflow: "hidden" }}>
      {/* Заголовок таблицы */}
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="schedules table">
          <TableHead>
            <TableRow sx={{ bgcolor: "grey.50" }}>
              {developerMode && (
                <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
              )}
              <SortableTableHeader<SortField>
                field="bot_id"
                currentSortField={sortField}
                sortDirection={sortDirection}
                onSort={onSort}
                label="Telegram Бот"
              />
              <SortableTableHeader<SortField>
                field="schedule_strategy"
                currentSortField={sortField}
                sortDirection={sortDirection}
                onSort={onSort}
                label="Тип задачи"
              />
              <SortableTableHeader<SortField>
                field="schedule_type"
                currentSortField={sortField}
                sortDirection={sortDirection}
                onSort={onSort}
                label="Когда выполнять"
              />
              <SortableTableHeader<SortField>
                field="enabled"
                currentSortField={sortField}
                sortDirection={sortDirection}
                onSort={onSort}
                label="Статус"
              />
              {isSuperadmin && (
                <SortableTableHeader<SortField>
                  field="company_id"
                  currentSortField={sortField}
                  sortDirection={sortDirection}
                  onSort={onSort}
                  label="Компания"
                />
              )}
              <SortableTableHeader<SortField>
                field="last_run_at"
                currentSortField={sortField}
                sortDirection={sortDirection}
                onSort={onSort}
                label="Последнее выполнение"
                defaultDirection="desc"
              />
              {developerMode && (
                <SortableTableHeader<SortField>
                  field="created_at"
                  currentSortField={sortField}
                  sortDirection={sortDirection}
                  onSort={onSort}
                  label="Дата создания"
                  defaultDirection="desc"
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
                        {schedule.schedule_id}
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
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Chip
                      icon={strategyInfo.icon}
                      label={strategyInfo.label}
                      color={strategyInfo.color}
                      variant="outlined"
                      size="small"
                      title={strategyInfo.description}
                    />
                  </TableCell>

                  <TableCell>
                    <Chip
                      icon={typeInfo.icon}
                      label={typeInfo.label}
                      color={typeInfo.color}
                      variant="outlined"
                      size="small"
                      title={typeInfo.description}
                    />
                  </TableCell>

                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {schedule.enabled ? (
                        <>
                          <EnabledIcon color="success" sx={{ fontSize: 20 }} />
                          <Typography color="success.main" fontWeight={500}>
                            Активно
                          </Typography>
                        </>
                      ) : (
                        <>
                          <DisabledIcon color="error" sx={{ fontSize: 20 }} />
                          <Typography color="error.main" fontWeight={500}>
                            Приостановлено
                          </Typography>
                        </>
                      )}
                    </Box>
                  </TableCell>

                  {isSuperadmin && (
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <CompanyIcon color="action" sx={{ fontSize: 16 }} />
                        <Typography variant="body2">
                          {companyMap.get(schedule.company_id) ||
                            schedule.company_id}
                        </Typography>
                      </Box>
                    </TableCell>
                  )}

                  <TableCell>
                    {schedule.last_run_at ? (
                      <Box>
                        <Typography variant="body2">
                          {new Date(schedule.last_run_at).toLocaleDateString(
                            "ru-RU"
                          )}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(schedule.last_run_at).toLocaleTimeString(
                            "ru-RU",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </Typography>
                      </Box>
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
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {new Date(schedule.created_at).toLocaleDateString(
                            "ru-RU"
                          )}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(schedule.created_at).toLocaleTimeString(
                            "ru-RU",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </Typography>
                      </Box>
                    </TableCell>
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
