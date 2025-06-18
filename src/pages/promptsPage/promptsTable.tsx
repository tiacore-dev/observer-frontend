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
import { IPrompt } from "../../api/promptsApi";
import { useNavigate } from "react-router-dom";

interface PromptsTableProps {
  prompts: IPrompt[];
  companyMap: Map<string, string>;
  developerMode: boolean;
  sortField: "prompt_name" | "created_at";
  sortDirection: "asc" | "desc";
  onSort: (field: "prompt_name" | "created_at") => void;
}

export const PromptsTable: React.FC<PromptsTableProps> = ({
  prompts,
  companyMap,
  developerMode,
  sortField,
  sortDirection,
  onSort,
}) => {
  const navigate = useNavigate();

  const handleRowClick = (promptId: string) => {
    navigate(`/prompts/${promptId}`);
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="prompts table">
        <TableHead>
          <TableRow>
            {developerMode && <TableCell>ID</TableCell>}
            <TableCell
              sortDirection={
                sortField === "prompt_name" ? sortDirection : false
              }
            >
              <TableSortLabel
                active={sortField === "prompt_name"}
                direction={sortField === "prompt_name" ? sortDirection : "asc"}
                onClick={() => onSort("prompt_name")}
              >
                Название промпта
              </TableSortLabel>
            </TableCell>
            <TableCell>Текст</TableCell>
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
            {developerMode && <TableCell>Компания</TableCell>}
          </TableRow>
        </TableHead>

        <TableBody>
          {prompts.map((prompt) => (
            <TableRow
              key={prompt.prompt_id}
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
                "&:hover": {
                  backgroundColor: "action.hover",
                  cursor: "pointer",
                },
              }}
              onClick={() => handleRowClick(prompt.prompt_id)}
            >
              {developerMode && (
                <TableCell component="th" scope="row">
                  {prompt.prompt_id}
                </TableCell>
              )}
              <TableCell>{prompt.prompt_name}</TableCell>
              <TableCell>
                {prompt.text.length > 50
                  ? `${prompt.text.substring(0, 50)}...`
                  : prompt.text}
              </TableCell>
              {developerMode && (
                <TableCell>
                  {new Date(prompt.created_at).toLocaleString()}
                </TableCell>
              )}
              {developerMode && (
                <TableCell>
                  {companyMap.get(prompt.company_id) || prompt.company_id}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
