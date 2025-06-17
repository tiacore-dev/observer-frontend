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
import { IBot } from "../../api/botsApi";

interface BotsTableProps {
  bots: IBot[];
  companyMap: Map<string, string>;
  developerMode: boolean;
  sortField: "bot_username" | "created_at";
  sortDirection: "asc" | "desc";
  onSort: (field: "bot_username" | "created_at") => void;
  onRowClick: (botId: string) => void;
}

export const BotsTable: React.FC<BotsTableProps> = ({
  bots,
  companyMap,
  developerMode,
  sortField,
  sortDirection,
  onSort,
  onRowClick,
}) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="bots table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell
              sortDirection={
                sortField === "bot_username" ? sortDirection : false
              }
            >
              <TableSortLabel
                active={sortField === "bot_username"}
                direction={sortField === "bot_username" ? sortDirection : "asc"}
                onClick={() => onSort("bot_username")}
              >
                Имя бота
              </TableSortLabel>
            </TableCell>
            <TableCell>Имя</TableCell>
            {developerMode && <TableCell>Компания</TableCell>}
            <TableCell>Статус</TableCell>
            {developerMode && (
              <TableCell
                sortDirection={
                  sortField === "created_at" ? sortDirection : false
                }
              >
                <TableSortLabel
                  active={sortField === "created_at"}
                  direction={sortField === "created_at" ? sortDirection : "asc"}
                  onClick={() => onSort("created_at")}
                >
                  Дата создания
                </TableSortLabel>
              </TableCell>
            )}
            <TableCell>Комментарий</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {bots.map((bot) => (
            <TableRow
              key={bot.bot_id}
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
                "&:hover": {
                  backgroundColor: "action.hover",
                  cursor: "pointer",
                },
              }}
              onClick={() => onRowClick(bot.bot_id)}
            >
              <TableCell component="th" scope="row">
                {bot.bot_id}
              </TableCell>
              <TableCell>{bot.bot_username}</TableCell>
              <TableCell>{bot.bot_first_name}</TableCell>
              {developerMode && (
                <TableCell>
                  {companyMap.get(bot.company_id) || bot.company_id}
                </TableCell>
              )}
              <TableCell>
                {bot.is_active ? (
                  <Typography color="success.main">Активен</Typography>
                ) : (
                  <Typography color="error">Неактивен</Typography>
                )}
              </TableCell>
              {developerMode && (
                <TableCell>
                  {new Date(bot.created_at).toLocaleString()}
                </TableCell>
              )}
              <TableCell>{bot.comment || "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
