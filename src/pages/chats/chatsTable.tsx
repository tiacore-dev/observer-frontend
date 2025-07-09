import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { IChat } from "../../api/chatsApi";
import { TableSkeleton } from "../../components/skeleton/tableSkeleton";
import { SortableTableHeader } from "../../components/table/sortableTableHeader";

type SortField = "chat_id" | "chat_name" | "created_at";

interface ChatsTableProps {
  chats: IChat[];
  developerMode: boolean;
  sortField: SortField;
  sortDirection: "asc" | "desc";
  onSort: (field: SortField) => void;
  isLoading?: boolean;
}

export const ChatsTable: React.FC<ChatsTableProps> = ({
  chats,
  developerMode,
  sortField,
  sortDirection,
  onSort,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <TableSkeleton
        columns={2}
        developerMode={developerMode}
        additionalColumns={1}
        rows={5}
      />
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="chats table">
        <TableHead>
          <TableRow>
            <SortableTableHeader<SortField>
              field="chat_name"
              currentSortField={sortField}
              sortDirection={sortDirection}
              onSort={onSort}
              label="Название чата"
            />
            <SortableTableHeader<SortField>
              field="chat_id"
              currentSortField={sortField}
              sortDirection={sortDirection}
              onSort={onSort}
              label="ID чата"
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
          {chats.map((chat) => (
            <TableRow
              key={chat.chat_id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell>{chat.chat_name}</TableCell>
              <TableCell>{chat.chat_id}</TableCell>
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
