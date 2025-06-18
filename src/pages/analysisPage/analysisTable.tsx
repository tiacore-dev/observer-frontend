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
import { IAnalys } from "../../api/analysisApi";
import { useNavigate } from "react-router-dom";

interface AnalysisTableProps {
  analysis: IAnalys[];
  companyMap: Map<string, string>;
  chatMap: Map<number, string>;
  promptMap: Map<string, string>;
  developerMode: boolean;
  sortField: keyof IAnalys;
  sortDirection: "asc" | "desc";
  onSort: (field: keyof IAnalys) => void;
  onRowClick?: (analysisId: string) => void;
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
}) => {
  const navigate = useNavigate();

  const handleRowClick = (analysisId: string) => {
    if (onRowClick) {
      onRowClick(analysisId);
    } else {
      navigate(`/analysis/${analysisId}`);
    }
  };

  const formatResultText = (text?: string) => {
    if (!text) return "-";
    return text.length > 50 ? `${text.substring(0, 50)}...` : text;
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="analysis table">
        <TableHead>
          <TableRow>
            {developerMode && <TableCell>ID</TableCell>}
            <TableCell>Чат</TableCell>
            <TableCell>Промпт</TableCell>
            {developerMode && <TableCell>Компания</TableCell>}
            <TableCell>Токены (in/out)</TableCell>
            {developerMode && (
              <TableCell
                sortDirection={
                  sortField === "created_at" ? sortDirection : false
                }
              >
                <TableSortLabel
                  active={sortField === "created_at"}
                  direction={sortDirection}
                  onClick={() => onSort("created_at")}
                >
                  Дата создания
                </TableSortLabel>
              </TableCell>
            )}
            <TableCell>Результат</TableCell>
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
                <TableCell component="th" scope="row">
                  {item.analysis_id}
                </TableCell>
              )}
              <TableCell>{chatMap.get(item.chat_id) || item.chat_id}</TableCell>
              <TableCell>
                {promptMap.get(item.prompt_id) || item.prompt_id}
              </TableCell>
              {developerMode && (
                <TableCell>
                  {companyMap.get(item.company_id) || item.company_id}
                </TableCell>
              )}
              <TableCell>
                {item.tokens_input}/{item.tokens_output}
              </TableCell>
              {developerMode && (
                <TableCell>
                  {new Date(item.created_at).toLocaleString()}
                </TableCell>
              )}
              <TableCell>{formatResultText(item.result_text)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
