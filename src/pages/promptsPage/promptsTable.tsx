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
import { IPrompt } from "../../api/promptsApi";
import { useNavigate } from "react-router-dom";
import { TableSkeleton } from "../../components/skeleton/tableSkeleton";
import { SortableTableHeader } from "../../components/table/sortableTableHeader";

type SortField = "prompt_name" | "company_id" | "created_at";

interface PromptsTableProps {
  prompts: IPrompt[];
  companyMap: Map<string, string>;
  developerMode: boolean;
  isSuperadmin: boolean;
  sortField: SortField;
  sortDirection: "asc" | "desc";
  onSort: (field: SortField) => void;
  isLoading?: boolean;
}

export const PromptsTable: React.FC<PromptsTableProps> = ({
  prompts,
  companyMap,
  developerMode,
  isSuperadmin,
  sortField,
  sortDirection,
  onSort,
  isLoading = false,
}) => {
  const navigate = useNavigate();

  const handleRowClick = (promptId: string) => {
    if (!isLoading) {
      navigate(`/prompts/${promptId}`);
    }
  };

  if (isLoading) {
    const columns = 2; // Основные колонки (Название, Текст)
    const additionalColumns =
      (developerMode ? 1 : 0) + // Колонка ID если developerMode
      (developerMode ? 1 : 0) + // Колонка даты если developerMode
      (isSuperadmin ? 1 : 0); // Колонка компании если isSuperadmin

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
      <Table sx={{ minWidth: 650 }} aria-label="prompts table">
        <TableHead>
          <TableRow>
            {developerMode && <TableCell>ID</TableCell>}
            <SortableTableHeader<SortField>
              field="prompt_name"
              currentSortField={sortField}
              sortDirection={sortDirection}
              onSort={onSort}
              label="Название промпта"
            />
            <TableCell>Текст</TableCell>
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
            {isSuperadmin && (
              <SortableTableHeader<SortField>
                field="company_id"
                currentSortField={sortField}
                sortDirection={sortDirection}
                onSort={onSort}
                label="Компания"
              />
            )}
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
                {prompt.text.length > 100
                  ? `${prompt.text.substring(0, 100)}...`
                  : prompt.text}
              </TableCell>
              {developerMode && (
                <TableCell>
                  {new Date(prompt.created_at).toLocaleString()}
                </TableCell>
              )}
              {isSuperadmin && (
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
