import React from "react";
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
} from "@mui/material";
import { ISchedule } from "../../api/schedulesApi";
import { useCompanyMap } from "../../hooks/maps/useCompanyMap";
import { useChatMap } from "../../hooks/maps/useChatMap";
import { usePromptMap } from "../../hooks/maps/usePromptMap";
import { useBotMap } from "../../hooks/maps/useBotMap";
import { TableSkeleton } from "../../components/skeleton/tableSkeleton";
import { SortableTableHeader } from "../../components/table/sortableTableHeader";

type SortField =
  | "prompt_id"
  | "chat_id"
  | "bot_id"
  | "schedule_type"
  | "enabled"
  | "company_id"
  | "created_at";

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
  const chatMap = useChatMap();
  const promptMap = usePromptMap();
  const botMap = useBotMap();

  // Функция для преобразования типа расписания в читаемый формат
  const getScheduleTypeLabel = (type: string) => {
    switch (type) {
      case "interval":
        return "Интервал";
      case "cron":
        return "Повторяющееся";
      case "once":
        return "Одноразово";
      case "daily_time":
        return "Ежедневно";
      default:
        return type;
    }
  };

  if (isLoading) {
    const columns = 5; // Основные колонки (Промпт, Чат, Бот, Тип, Статус)
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
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="schedules table">
        <TableHead>
          <TableRow>
            {developerMode && <TableCell>ID</TableCell>}
            <SortableTableHeader<SortField>
              field="prompt_id"
              currentSortField={sortField}
              sortDirection={sortDirection}
              onSort={onSort}
              label="Промпт"
            />
            <SortableTableHeader<SortField>
              field="chat_id"
              currentSortField={sortField}
              sortDirection={sortDirection}
              onSort={onSort}
              label="Чат"
            />
            <SortableTableHeader<SortField>
              field="bot_id"
              currentSortField={sortField}
              sortDirection={sortDirection}
              onSort={onSort}
              label="Бот"
            />
            <SortableTableHeader<SortField>
              field="schedule_type"
              currentSortField={sortField}
              sortDirection={sortDirection}
              onSort={onSort}
              label="Тип расписания"
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
          {schedules.map((schedule) => (
            <TableRow
              key={schedule.schedule_id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              hover
              onClick={() => navigate(`/schedules/${schedule.schedule_id}`)}
              style={{ cursor: "pointer" }}
            >
              {developerMode && (
                <TableCell component="th" scope="row">
                  {schedule.schedule_id}
                </TableCell>
              )}
              <TableCell>
                {promptMap.get(schedule.prompt_id) || schedule.prompt_id}
              </TableCell>
              <TableCell>
                {chatMap.get(schedule.chat_id) || schedule.chat_id}
              </TableCell>
              <TableCell>
                {botMap.get(schedule.bot_id.toString()) || schedule.bot_id}
              </TableCell>
              <TableCell>
                {getScheduleTypeLabel(schedule.schedule_type)}
              </TableCell>
              <TableCell>
                {schedule.enabled ? (
                  <Typography color="success.main">Включен</Typography>
                ) : (
                  <Typography color="error">Выключен</Typography>
                )}
              </TableCell>
              {isSuperadmin && (
                <TableCell>
                  {companyMap.get(schedule.company_id) || schedule.company_id}
                </TableCell>
              )}
              {developerMode && (
                <TableCell>
                  {new Date(schedule.created_at).toLocaleString()}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
