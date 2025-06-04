// companyCard.tsx
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
import { DeletePromptDialog } from "../../components/deleteDialog";
import { useCompanyDetailsQuery } from "../../hooks/companies/useCompaniesQuery";
import { EditCompanyModal } from "./companyEditModal";

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
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  const currentCompany = companyDetails || company;

  return (
    <Box sx={{ width: "100%", mt: 2, position: "relative" }}>
      <Box sx={{ p: 2, position: "absolute", left: 0 }}>
        <Button
          variant="outlined"
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
          startIcon={<ArrowBackIcon />}
        >
          Назад
        </Button>
      </Box>

      {/* {developerMode && ( */}
      <Box sx={{ p: 2, position: "absolute", right: 0 }}>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setEditModalOpen(true)}
            startIcon={<EditIcon />}
          >
            Редактировать
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => setDeleteDialogOpen(true)}
            disabled={isDeleting}
            startIcon={<DeleteIcon />}
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
        </Stack>
      </Box>
      {/* )} */}

      <Box
        sx={{
          p: 2,
          maxWidth: 800,
          margin: "0 auto",
        }}
      >
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
      </Box>

      <DeletePromptDialog
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
