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
} from "@mui/material";
import { IBot } from "../../api/botsApi";
import { useAuth } from "../../context/authContext";
import { SortableTableHeader } from "../../components/table/sortableTableHeader";

type SortField =
  | "bot_username"
  | "bot_first_name"
  | "company_id"
  | "is_active"
  | "comment"
  | "created_at";

interface BotsTableProps {
  bots: IBot[];
  companyMap: Map<string, string>;
  developerMode: boolean;
  sortField: SortField;
  sortDirection: "asc" | "desc";
  onSort: (field: SortField) => void;
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
  const { isSuperadmin } = useAuth();

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="bots table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <SortableTableHeader<SortField>
              field="bot_username"
              currentSortField={sortField}
              sortDirection={sortDirection}
              onSort={onSort}
              label="Имя бота"
            />
            <SortableTableHeader<SortField>
              field="bot_first_name"
              currentSortField={sortField}
              sortDirection={sortDirection}
              onSort={onSort}
              label="Название"
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
              field="is_active"
              currentSortField={sortField}
              sortDirection={sortDirection}
              onSort={onSort}
              label="Статус"
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
            <SortableTableHeader<SortField>
              field="comment"
              currentSortField={sortField}
              sortDirection={sortDirection}
              onSort={onSort}
              label="Комментарий"
            />
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
              {isSuperadmin && (
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
