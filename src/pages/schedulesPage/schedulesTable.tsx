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
  TableSortLabel,
} from "@mui/material";
import { ISchedule } from "../../api/schedulesApi";
import { useBotsQuery } from "../../hooks/bots/useBotsQuery";
import { useChatsSelectQuery } from "../../hooks/chats/useChatsQuery";
import { usePromptsQuery } from "../../hooks/prompts/usePromptsQuery";
import { useCompaniesQuery } from "../../hooks/companies/useCompaniesQuery";

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
  const navigate = useNavigate();

  // Получаем данные для маппинга ID к названиям
  const { data: botsData } = useBotsQuery();
  const { data: chatsData } = useChatsSelectQuery();
  const { data: promptsData } = usePromptsQuery();
  const { data: companiesData } = useCompaniesQuery();

  // Создаем мапы для быстрого поиска названий по ID
  const botsMap = new Map(
    botsData?.bots.map((bot) => [bot.bot_id.toString(), bot.bot_first_name])
  );
  const chatsMap = new Map(
    chatsData?.chats.map((chat) => [chat.chat_id.toString(), chat.chat_name])
  );
  const promptsMap = new Map(
    promptsData?.prompts.map((prompt) => [prompt.prompt_id, prompt.prompt_name])
  );
  const companiesMap = new Map(
    companiesData?.companies.map((company) => [
      company.company_id,
      company.company_name,
    ])
  );

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

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="schedules table">
        <TableHead>
          <TableRow>
            {developerMode && <TableCell>ID</TableCell>}
            <TableCell>Промпт</TableCell>
            <TableCell>Чат</TableCell>
            {developerMode && <TableCell>Компания</TableCell>}
            <TableCell>
              <TableSortLabel
                active={sortField === "schedule_type"}
                direction={sortDirection}
                onClick={() => onSort("schedule_type")}
              >
                Тип расписания
              </TableSortLabel>
            </TableCell>
            <TableCell>Статус</TableCell>
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
                {promptsMap.get(schedule.prompt_id) || schedule.prompt_id}
              </TableCell>
              <TableCell>
                {chatsMap.get(schedule.chat_id.toString()) || schedule.chat_id}
              </TableCell>
              {developerMode && (
                <TableCell>
                  {companiesMap.get(schedule.company_id) || schedule.company_id}
                </TableCell>
              )}
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
              {developerMode && (
                <TableCell>
                  {new Date(schedule.created_at).toLocaleString()}
                </TableCell>
              )}
              <TableCell>
                {botsMap.get(schedule.bot_id.toString()) || schedule.bot_id}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
