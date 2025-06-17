import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TableSortLabel,
} from "@mui/material";
import { ISchedule } from "../../api/schedulesApi";

interface SchedulesTableProps {
  schedules: ISchedule[];
  developerMode: boolean;
  sortField: "created_at" | "schedule_type";
  sortDirection: "asc" | "desc";
  onSort: (field: "created_at" | "schedule_type") => void;
}

export const SchedulesTable: React.FC<SchedulesTableProps> = ({
  schedules,
  developerMode,
  sortField,
  sortDirection,
  onSort,
}) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="schedules table">
        <TableHead>
          <TableRow>
            {developerMode && <TableCell>ID</TableCell>}
            <TableCell>Промпт</TableCell>
            <TableCell>Чат</TableCell>
            {developerMode && <TableCell>Компания</TableCell>}
            <TableCell>Тип</TableCell>
            <TableCell>
              <TableSortLabel
                active={sortField === "schedule_type"}
                direction={sortDirection}
                onClick={() => onSort("schedule_type")}
              >
                Тип расписания
              </TableSortLabel>
            </TableCell>
            <TableCell>Доступность</TableCell>
            {developerMode && (
              <TableCell>
                <TableSortLabel
                  active={sortField === "created_at"}
                  direction={sortDirection}
                  onClick={() => onSort("created_at")}
                >
                  Дата создания
                </TableSortLabel>
              </TableCell>
            )}
            <TableCell>Бот</TableCell>
            <TableCell>Целевые чаты</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {schedules.map((schedule) => (
            <TableRow
              key={schedule.schedule_id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              {developerMode && (
                <TableCell component="th" scope="row">
                  {schedule.schedule_id}
                </TableCell>
              )}
              <TableCell>{schedule.prompt_id}</TableCell>
              <TableCell>{schedule.chat_id}</TableCell>
              {developerMode && <TableCell>{schedule.company_id}</TableCell>}
              <TableCell>{schedule.schedule_type}</TableCell>
              <TableCell>
                {schedule.enabled ? (
                  <Typography color="success.main">Включен</Typography>
                ) : (
                  <Typography color="error">Выключен</Typography>
                )}
              </TableCell>
              {developerMode && (
                <TableCell>
                  {new Date(schedule.created_at).toLocaleString()}
                </TableCell>
              )}
              <TableCell>{schedule.bot_id}</TableCell>
              <TableCell>{schedule.target_chats?.join(", ") || "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
