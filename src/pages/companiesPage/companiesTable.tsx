import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
} from "@mui/material";
import { ICompany } from "../../api/companiesApi";
import { SortableTableHeader } from "../../components/table/sortableTableHeader";
import { ContextMenu } from "./contextMenu";
import { useDeleteCompany } from "../../hooks/companies/useCompaniesMutations";
import { DeleteDialog } from "../../components/deleteDialog";
import { EditCompanyModal } from "./editCompanyModal";

type SortField = "company_name" | "description";

interface CompaniesTableProps {
  companies: ICompany[];
  developerMode: boolean;
  sortField: SortField;
  sortDirection: "asc" | "desc";
  onSort: (field: SortField) => void;
  // onRowClick?: (companyId: string) => void;
}

export const CompaniesTable: React.FC<CompaniesTableProps> = ({
  companies,
  developerMode,
  sortField,
  sortDirection,
  onSort,
  // onRowClick,
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [selectedCompany, setSelectedCompany] = React.useState<ICompany | null>(
    null
  );
  const deleteCompany = useDeleteCompany();

  const handleDelete = () => {
    if (selectedCompany) {
      deleteCompany.mutate(selectedCompany.company_id);
      setDeleteDialogOpen(false);
    }
  };

  const handleEditClick = (company: ICompany, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedCompany(company);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (company: ICompany, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedCompany(company);
    setDeleteDialogOpen(true);
  };

  return (
    <>
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
              <TableCell width={50}>Действия</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {companies.map((company) => (
              <TableRow
                key={company.company_id}
                // sx={{
                //   "&:last-child td, &:last-child th": { border: 0 },
                //   ...(onRowClick && {
                //     "&:hover": {
                //       backgroundColor: "action.hover",
                //       cursor: "pointer",
                //     },
                //   }),
                // }}
                // onClick={() => onRowClick?.(company.company_id)}
              >
                {developerMode && (
                  <TableCell component="th" scope="row">
                    {company.company_id}
                  </TableCell>
                )}
                <TableCell>{company.company_name}</TableCell>
                <TableCell>{company.description || "-"}</TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Box display="flex" justifyContent="center">
                    <ContextMenu
                      onEdit={(e: React.MouseEvent) =>
                        handleEditClick(company, e)
                      }
                      onDelete={(e: React.MouseEvent) =>
                        handleDeleteClick(company, e)
                      }
                    />
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <DeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        isDeleting={deleteCompany.isPending}
      />

      {selectedCompany && (
        <EditCompanyModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          company={selectedCompany}
        />
      )}
    </>
  );
};
