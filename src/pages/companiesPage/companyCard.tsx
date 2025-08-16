// src/components/companyCard.tsx
import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Divider,
  CircularProgress,
  Stack,
  Card,
  CardHeader,
  Avatar,
  IconButton,
} from "@mui/material";
import { ICompany } from "../../api/companiesApi";
import { useNavigate } from "react-router-dom";
import { useDeleteCompany } from "../../hooks/companies/useCompaniesMutations";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { DeleteDialog } from "../../components/deleteDialog";
import { useCompanyDetailsQuery } from "../../hooks/companies/useCompaniesQuery";
import { EditCompanyModal } from "./editCompanyModal";
import { DetailsPageSkeleton } from "../../components/skeleton/detailsPageSkeleton";
import PeopleIcon from "@mui/icons-material/People";
import AddIcon from "@mui/icons-material/Add";
import { useCompanyUsers } from "../../hooks/users/useUsersQuery";
import { UsersTable } from "./usersTable";
import { InviteUserModal } from "./inviteUserModal";

interface CompanyCardProps {
  company: ICompany;
  developerMode: boolean;
}

export const CompanyCard: React.FC<CompanyCardProps> = ({
  company,
  developerMode,
}) => {
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const { data: companyDetails, isLoading } = useCompanyDetailsQuery(
    company.company_id
  );
  const { mutate: deleteCompany, isPending: isDeleting } = useDeleteCompany();
  const { data: usersData, isLoading: isLoadingUsers } = useCompanyUsers(
    company.company_id
  );

  const handleDelete = () => {
    deleteCompany(company.company_id, {
      onSuccess: () => {
        navigate("/companies");
      },
    });
  };

  if (isLoading) {
    return <DetailsPageSkeleton developerMode={developerMode} />;
  }

  const currentCompany = companyDetails || company;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "start", mb: 2, gap: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          variant="outlined"
        >
          Назад
        </Button>

        <Button
          startIcon={<EditIcon />}
          onClick={() => setEditModalOpen(true)}
          variant="contained"
          color="primary"
        >
          Редактировать
        </Button>

        <Button
          startIcon={<DeleteIcon />}
          onClick={() => setDeleteDialogOpen(true)}
          variant="contained"
          color="error"
          disabled={isDeleting}
        >
          {isDeleting ? (
            <>
              <CircularProgress size={24} sx={{ mr: 1 }} />
              Удаление...
            </>
          ) : (
            "Удалить"
          )}
        </Button>
      </Box>

      <Paper sx={{ p: 3 }} elevation={3}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h5" component="h1">
            {currentCompany.company_name}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />
        <Box sx={{ mb: 2 }}>
          {developerMode && (
            <Typography>
              <strong>ID:</strong> {currentCompany.company_id}
            </Typography>
          )}
          <Typography>
            <strong>Описание:</strong> {currentCompany.description || "-"}
          </Typography>
        </Box>
      </Paper>

      {/* Users Section */}
      <Paper sx={{ mt: 2, p: 0 }} elevation={0}>
        <Card>
          <CardHeader
            avatar={
              <Avatar sx={{ bgcolor: "primary.main" }}>
                <PeopleIcon />
              </Avatar>
            }
            title="Пользователи компании"
            action={
              <IconButton
                color="primary"
                onClick={() => setInviteModalOpen(true)}
              >
                <AddIcon />
              </IconButton>
            }
          />
          <Box sx={{ p: 2 }}>
            <UsersTable
              users={usersData?.users || []}
              loading={isLoadingUsers}
            />
          </Box>
        </Card>
      </Paper>

      <DeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />

      {editModalOpen && (
        <EditCompanyModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          company={currentCompany}
        />
      )}

      {inviteModalOpen && (
        <InviteUserModal
          open={inviteModalOpen}
          onClose={() => setInviteModalOpen(false)}
          companyId={currentCompany.company_id}
        />
      )}
    </Box>
  );
};
