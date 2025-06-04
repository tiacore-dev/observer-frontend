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
import { IAnalys } from "../../api/analysisApi";

interface AnalysisTableProps {
  analysis: IAnalys[];
  companyMap: Map<string, string>;
  developerMode: boolean;
  sortField: keyof IAnalys;
  sortDirection: "asc" | "desc";
  onSort: (field: keyof IAnalys) => void;
  onRowClick?: (analysisId: string) => void;
}

export const AnalysisTable: React.FC<AnalysisTableProps> = ({
  analysis,
  companyMap,
  developerMode,
  sortField,
  sortDirection,
  onSort,
  onRowClick,
}) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="analysis table">
        <TableHead>
          <TableRow>
            {developerMode && <TableCell>ID</TableCell>}
            <TableCell>ID</TableCell>
            <TableCell>Промпт</TableCell>
            {developerMode && <TableCell>Компания</TableCell>}
            <TableCell>Расписание</TableCell>
            <TableCell>Токены (in/out)</TableCell>
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
            <TableCell>Результат</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {analysis.map((item) => (
            <TableRow
              key={item.analysis_id}
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
                "&:hover": {
                  backgroundColor: "action.hover",
                  cursor: onRowClick ? "pointer" : "default",
                },
              }}
              onClick={() => onRowClick && onRowClick(item.analysis_id)}
            >
              {developerMode && (
                <TableCell component="th" scope="row">
                  {item.analysis_id}
                </TableCell>
              )}
              <TableCell>{item.chat}</TableCell>
              <TableCell
                sx={{
                  maxWidth: 300,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {item.prompt}
              </TableCell>
              {developerMode && (
                <TableCell>
                  {companyMap.get(item.company) || item.company}
                </TableCell>
              )}
              <TableCell>{item.schedule || "-"}</TableCell>
              <TableCell>
                {item.tokens_input}/{item.tokens_output}
              </TableCell>
              {developerMode && (
                <TableCell>
                  {new Date(item.created_at).toLocaleString()}
                </TableCell>
              )}
              <TableCell
                sx={{
                  maxWidth: 300,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {item.result_text || "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
