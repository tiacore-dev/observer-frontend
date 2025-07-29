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
} from "@mui/material";
import { Description as DescriptionIcon } from "@mui/icons-material";
import type { ICompany } from "../../api/companiesApi";
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
}

export const CompaniesTable: React.FC<CompaniesTableProps> = ({
  companies,
  developerMode,
  sortField,
  sortDirection,
  onSort,
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
          width: 40,
          height: 40,
          bgcolor: "secondary.main",
          fontSize: "1rem",
          fontWeight: 600,
        }}
      >
        {initials}
      </Avatar>
    );
  };

  return (
    <Paper elevation={2} sx={{ overflow: "hidden" }}>
      {/* Заголовок таблицы */}
      {/* <Box sx={{ p: 3, pb: 0 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <BusinessIcon color="primary" />
          <Typography variant="h6" component="h2" fontWeight={600}>
            Организации и компании
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Управление организациями для группировки ботов, чатов и расписаний
        </Typography>
      </Box> */}

      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="companies table">
          <TableHead>
            <TableRow>
              {developerMode && (
                <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
              )}
              <SortableTableHeader<SortField>
                field="company_name"
                currentSortField={sortField}
                sortDirection={sortDirection}
                onSort={onSort}
                label="Название компании"
                // sx={{ fontWeight: 600 }}
              />
              <SortableTableHeader<SortField>
                field="description"
                currentSortField={sortField}
                sortDirection={sortDirection}
                onSort={onSort}
                label="Описание и назначение"
                // sx={{ fontWeight: 600 }}
              />
              <TableCell width={50} sx={{ fontWeight: 600 }}>
                Действия
              </TableCell>
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
                  },
                  transition: "background-color 0.2s ease",
                }}
              >
                {developerMode && (
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
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    {getCompanyAvatar(company.company_name)}
                    <Box>
                      <Typography
                        variant="body1"
                        fontWeight={500}
                        sx={{ mb: 0.5 }}
                      >
                        {company.company_name}
                      </Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        {/* <Chip
                          icon={<BusinessIcon sx={{ fontSize: 14 }} />}
                          label="Активная организация"
                          color="success"
                          variant="outlined"
                          size="small"
                        /> */}
                      </Box>
                    </Box>
                  </Box>
                </TableCell>

                <TableCell>
                  {company.description ? (
                    <Box>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        {company.description}
                      </Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        {/* <DescriptionIcon
                          sx={{ fontSize: 14, color: "text.secondary" }}
                        /> */}
                        {/* <Typography variant="caption" color="text.secondary">
                          Описание настроено
                        </Typography> */}
                      </Box>
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
    </Paper>
  );
};
