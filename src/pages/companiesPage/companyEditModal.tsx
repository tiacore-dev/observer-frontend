// companyEditModal.tsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import { useUpdateCompany } from "../../hooks/companies/useCompaniesMutations";
import { ICompany } from "../../api/companiesApi";

interface EditCompanyModalProps {
  open: boolean;
  onClose: () => void;
  company: ICompany;
}

export const EditCompanyModal: React.FC<EditCompanyModalProps> = ({
  open,
  onClose,
  company,
}) => {
  const [companyData, setCompanyData] = React.useState({
    company_name: company.company_name,
    description: company.description || "",
  });

  const [errors, setErrors] = React.useState({
    company_name: "",
  });

  const updateCompany = useUpdateCompany();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCompanyData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    // Validation
    const newErrors = {
      company_name: !companyData.company_name ? "Название обязательно" : "",
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((e) => e)) return;

    try {
      await updateCompany.mutateAsync({
        company_id: company.company_id,
        updatedData: companyData,
      });
      onClose();
    } catch (error) {
      console.error("Error updating company:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Редактировать компанию</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <TextField
            fullWidth
            label="Название компании"
            name="company_name"
            value={companyData.company_name}
            onChange={handleChange}
            error={!!errors.company_name}
            helperText={errors.company_name}
            required
          />

          <TextField
            fullWidth
            label="Описание (необязательно)"
            name="description"
            value={companyData.description}
            onChange={handleChange}
            multiline
            rows={4}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={updateCompany.isPending || !companyData.company_name}
        >
          {updateCompany.isPending ? (
            <CircularProgress size={24} />
          ) : (
            "Сохранить"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
