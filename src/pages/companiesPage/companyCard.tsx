import React from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Divider,
  CircularProgress,
  Stack,
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

interface CompanyCardProps {
  company: ICompany;
  developerMode: boolean;
}

export const CompanyCard: React.FC<CompanyCardProps> = ({
  company,
  developerMode,
}) => {
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const { data: companyDetails, isLoading } = useCompanyDetailsQuery(
    company.company_id
  );
  const { mutate: deleteCompany, isPending: isDeleting } = useDeleteCompany();

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
    </Box>
  );
};
