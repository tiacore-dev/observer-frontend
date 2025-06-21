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
import { ICompany } from "../../api/companiesApi";
import { SortableTableHeader } from "../../components/table/sortableTableHeader";

type SortField = "company_name" | "description";

interface CompaniesTableProps {
  companies: ICompany[];
  developerMode: boolean;
  sortField: SortField;
  sortDirection: "asc" | "desc";
  onSort: (field: SortField) => void;
  onRowClick?: (companyId: string) => void;
}

export const CompaniesTable: React.FC<CompaniesTableProps> = ({
  companies,
  developerMode,
  sortField,
  sortDirection,
  onSort,
  onRowClick,
}) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="companies table">
        <TableHead>
          <TableRow>
            {developerMode && <TableCell>ID</TableCell>}
            <SortableTableHeader<SortField>
              field="company_name"
              currentSortField={sortField}
              sortDirection={sortDirection}
              onSort={onSort}
              label="Название"
            />
            <SortableTableHeader<SortField>
              field="description"
              currentSortField={sortField}
              sortDirection={sortDirection}
              onSort={onSort}
              label="Описание"
            />
          </TableRow>
        </TableHead>

        <TableBody>
          {companies.map((company) => (
            <TableRow
              key={company.company_id}
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
                ...(onRowClick && {
                  "&:hover": {
                    backgroundColor: "action.hover",
                    cursor: "pointer",
                  },
                }),
              }}
              onClick={() => onRowClick?.(company.company_id)}
            >
              {developerMode && (
                <TableCell component="th" scope="row">
                  {company.company_id}
                </TableCell>
              )}
              <TableCell>{company.company_name}</TableCell>
              <TableCell>{company.description || "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
