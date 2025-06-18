import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { useCreateCompany } from "../../hooks/companies/useCompaniesMutations";

interface AddCompanyModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AddCompanyModal: React.FC<AddCompanyModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [companyData, setCompanyData] = useState({
    company_name: "",
    description: "",
  });
  const createCompany = useCreateCompany();

  const [errors, setErrors] = useState({
    company_name: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCompanyData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    // Валидация
    const newErrors = {
      company_name: !companyData.company_name ? "Название обязательно" : "",
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((e) => e)) return;

    try {
      await createCompany.mutateAsync(companyData, {
        onSuccess: () => {
          onClose();
          setCompanyData({ company_name: "", description: "" });
          if (onSuccess) onSuccess();
        },
      });
    } catch (error) {
      console.error("Error creating company:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Добавить новую компанию</DialogTitle>
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
          disabled={!companyData.company_name}
        >
          Создать
        </Button>
      </DialogActions>
    </Dialog>
  );
};
