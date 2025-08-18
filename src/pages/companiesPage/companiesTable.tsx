"use client";

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
  Typography,
  Avatar,
  useMediaQuery,
  Theme,
} from "@mui/material";
import { Description as DescriptionIcon } from "@mui/icons-material";
import type { ICompany } from "../../api/companiesApi";
import { SortableTableHeader } from "../../components/table/sortableTableHeader";
import { ContextMenu } from "./contextMenu";
import { useDeleteCompany } from "../../hooks/companies/useCompaniesMutations";
import { DeleteDialog } from "../../components/deleteDialog";
import { EditCompanyModal } from "./editCompanyModal";
import { useNavigate } from "react-router-dom";

type SortField = "company_name" | "description";

interface CompaniesTableProps {
  companies: ICompany[];
  developerMode: boolean;
  sortField: SortField;
  sortDirection: "asc" | "desc";
  onSort: (field: SortField) => void;
}

export const CompaniesTable: React.FC<CompaniesTableProps> = ({
  companies,
  developerMode,
  sortField,
  sortDirection,
  onSort,
}) => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );
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

  const handleCompanyClick = (companyId: string) => {
    navigate(`/companies/${companyId}`);
  };

  const getCompanyAvatar = (companyName: string) => {
    const initials = companyName
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    return (
      <Avatar
        sx={{
          width: isMobile ? 32 : 40,
          height: isMobile ? 32 : 40,
          bgcolor: "primary.main",
          color: "white",
          fontSize: "0.875rem",
          fontWeight: 600,
        }}
      >
        {initials}
      </Avatar>
    );
  };

  return (
    <Paper elevation={2} sx={{ overflow: "hidden" }}>
      <TableContainer>
        <Table
          sx={{ minWidth: isMobile ? 300 : 650 }}
          aria-label="companies table"
        >
          <TableHead>
            <TableRow>
              {developerMode && !isMobile && (
                <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
              )}
              <SortableTableHeader<SortField>
                field="company_name"
                currentSortField={sortField}
                sortDirection={sortDirection}
                onSort={onSort}
                label="Название компании"
              />
              {!isMobile && (
                <SortableTableHeader<SortField>
                  field="description"
                  currentSortField={sortField}
                  sortDirection={sortDirection}
                  onSort={onSort}
                  label="Описание"
                />
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {companies.map((company) => (
              <TableRow
                key={company.company_id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": {
                    backgroundColor: "action.hover",
                    cursor: "pointer",
                  },
                  transition: "background-color 0.2s ease",
                }}
                onClick={() => handleCompanyClick(company.company_id)}
              >
                {developerMode && !isMobile && (
                  <TableCell component="th" scope="row">
                    <Typography
                      variant="body2"
                      fontFamily="monospace"
                      color="text.secondary"
                    >
                      {company.company_id}
                    </Typography>
                  </TableCell>
                )}

                <TableCell>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: isMobile ? 1 : 2,
                    }}
                  >
                    {getCompanyAvatar(company.company_name)}
                    <Box>
                      <Typography
                        variant={isMobile ? "body2" : "body1"}
                        fontWeight={500}
                        sx={{ mb: isMobile ? 0 : 0.5 }}
                      >
                        {company.company_name}
                      </Typography>
                      {isMobile && company.description && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            display: "-webkit-box",
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {company.description}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </TableCell>

                {!isMobile && (
                  <TableCell>
                    {company.description ? (
                      <Box>
                        <Typography variant="body2" sx={{ mb: 0.5 }}>
                          {company.description}
                        </Typography>
                      </Box>
                    ) : (
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <DescriptionIcon
                          sx={{ fontSize: 14, color: "text.disabled" }}
                        />
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          fontStyle="italic"
                        >
                          Описание не указано
                        </Typography>
                      </Box>
                    )}
                  </TableCell>
                )}
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
    </Paper>
  );
};
