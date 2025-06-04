import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
} from "@mui/material";
import { IChat } from "../../api/chatsApi";

interface ChatsTableProps {
  chats: IChat[];
  developerMode: boolean;
  sortField: "chat_name" | "created_at";
  sortDirection: "asc" | "desc";
  onSort: (field: "chat_name" | "created_at") => void;
}

export const ChatsTable: React.FC<ChatsTableProps> = ({
  chats,
  developerMode,
  sortField,
  sortDirection,
  onSort,
}) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="chats table">
        <TableHead>
          <TableRow>
            {developerMode && <TableCell>ID</TableCell>}
            <TableCell
              sortDirection={sortField === "chat_name" ? sortDirection : false}
            >
              <TableSortLabel
                active={sortField === "chat_name"}
                direction={sortField === "chat_name" ? sortDirection : "asc"}
                onClick={() => onSort("chat_name")}
              >
                Название чата
              </TableSortLabel>
            </TableCell>
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
          </TableRow>
        </TableHead>

        <TableBody>
          {chats.map((chat) => (
            <TableRow
              key={chat.chat_id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              {developerMode && (
                <TableCell component="th" scope="row">
                  {chat.chat_id}
                </TableCell>
              )}
              <TableCell>{chat.chat_name}</TableCell>
              {developerMode && (
                <TableCell>
                  {new Date(chat.created_at).toLocaleString()}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
