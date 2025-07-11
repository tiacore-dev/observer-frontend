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
import { IAnalys } from "../../api/analysisApi";
import { useNavigate } from "react-router-dom";
import { TableSkeleton } from "../../components/skeleton/tableSkeleton";
import { useAuth } from "../../context/authContext";
import { SortableTableHeader } from "../../components/table/sortableTableHeader";

type SortField = keyof IAnalys;

interface AnalysisTableProps {
  analysis: IAnalys[];
  companyMap: Map<string, string>;
  chatMap: Map<number, string>;
  promptMap: Map<string, string>;
  developerMode: boolean;
  sortField: SortField;
  sortDirection: "asc" | "desc";
  onSort: (field: SortField) => void;
  onRowClick?: (analysisId: string) => void;
  isLoading?: boolean;
}

export const AnalysisTable: React.FC<AnalysisTableProps> = ({
  analysis,
  companyMap,
  chatMap,
  promptMap,
  developerMode,
  sortField,
  sortDirection,
  onSort,
  onRowClick,
  isLoading = false,
}) => {
  const navigate = useNavigate();
  const { isSuperadmin } = useAuth();

  const handleRowClick = (analysisId: string) => {
    if (onRowClick) {
      onRowClick(analysisId);
    } else {
      navigate(`/analysis/${analysisId}`);
    }
  };

  const formatResultText = (text?: string) => {
    if (!text) return "-";
    return text.length > 100 ? `${text.substring(0, 100)}...` : text;
  };

  if (isLoading) {
    return (
      <TableSkeleton
        columns={3}
        developerMode={developerMode}
        additionalColumns={developerMode ? 2 : 0}
      />
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table
        sx={{
          minWidth: 650,
          tableLayout: "fixed", // Фиксированное распределение ширины
        }}
        aria-label="analysis table"
      >
        <TableHead>
          <TableRow>
            {developerMode && <TableCell sx={{ width: "10%" }}>ID</TableCell>}
            <SortableTableHeader<SortField>
              field="chat_id"
              currentSortField={sortField}
              sortDirection={sortDirection}
              onSort={onSort}
              label="Чат"
            />
            <SortableTableHeader<SortField>
              field="prompt_id"
              currentSortField={sortField}
              sortDirection={sortDirection}
              onSort={onSort}
              label="Промпт"
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
            {/* <TableCell sx={{ width: "15%" }}>Токены (in/out)</TableCell> */}
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
          {analysis.map((item) => (
            <TableRow
              key={item.analysis_id}
              hover
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
                cursor: "pointer",
              }}
              onClick={() => handleRowClick(item.analysis_id)}
            >
              {developerMode && (
                <TableCell component="th" scope="row" sx={{ width: "10%" }}>
                  {item.analysis_id}
                </TableCell>
              )}
              <TableCell sx={{ width: "20%" }}>
                {chatMap.get(item.chat_id) || item.chat_id}
              </TableCell>
              <TableCell sx={{ width: "20%" }}>
                {promptMap.get(item.prompt_id) || item.prompt_id}
              </TableCell>
              {isSuperadmin && (
                <TableCell sx={{ width: "15%" }}>
                  {companyMap.get(item.company_id) || item.company_id}
                </TableCell>
              )}
              <TableCell sx={{ width: "15%" }}>
                {item.tokens_input}/{item.tokens_output}
              </TableCell>
              {developerMode && (
                <TableCell sx={{ width: "20%" }}>
                  {new Date(item.created_at).toLocaleString()}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
