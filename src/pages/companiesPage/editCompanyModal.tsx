"use client";

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
  Alert,
  Typography,
  Divider,
} from "@mui/material";
import {
  Edit as EditIcon,
  Business as BusinessIcon,
  Description as DescriptionIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import { useUpdateCompany } from "../../hooks/companies/useCompaniesMutations";
import type { ICompany } from "../../api/companiesApi";
import { ModalSkeleton } from "../../components/skeleton/modalSkeleton";
import { InfoCard } from "../../components/infoCard";

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

    // Очищаем ошибку при вводе
    if (name === "company_name" && value.trim()) {
      setErrors((prev) => ({ ...prev, company_name: "" }));
    }
  };

  const handleSubmit = async () => {
    // Validation
    const newErrors = {
      company_name: !companyData.company_name.trim()
        ? "Название компании обязательно"
        : "",
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

  if (updateCompany.isPending) {
    return <ModalSkeleton fieldCount={2} hasActions />;
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <EditIcon color="primary" />
          Редактировать компанию
        </Box>
      </DialogTitle>
      <DialogContent>
        {/* <InfoCard
          // icon={<InfoIcon />}
          type="info"
          title="Редактирование компании"
          description="Здесь вы можете изменить название и описание компании. Изменения применятся ко всем связанным ботам и анализам."
        />

        <Alert severity="warning" sx={{ mt: 2, mb: 2 }}>
          <Typography variant="body2">
            <strong>Внимание:</strong> Изменение названия компании может
            повлиять на отчёты и уведомления.
          </Typography>
        </Alert> */}

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <TextField
            fullWidth
            label="Название компании"
            name="company_name"
            value={companyData.company_name}
            onChange={handleChange}
            error={!!errors.company_name}
            helperText={
              errors.company_name ||
              "Используйте понятное название для идентификации"
            }
            required
            InputProps={{
              startAdornment: (
                <BusinessIcon sx={{ mr: 1, color: "action.active" }} />
              ),
            }}
          />

          <TextField
            fullWidth
            label="Описание компании (необязательно)"
            name="description"
            value={companyData.description}
            onChange={handleChange}
            multiline
            rows={4}
            helperText="Обновите описание"
            InputProps={{
              startAdornment: (
                <DescriptionIcon
                  sx={{
                    mr: 1,
                    color: "action.active",
                    alignSelf: "flex-start",
                    mt: 1,
                  }}
                />
              ),
            }}
          />
        </Box>

        {/* <Divider sx={{ my: 2 }} /> */}

        <Alert severity="info" variant="outlined" sx={{ mt: 2 }}>
          <Typography variant="body2">
            Все боты, чаты и анализы останутся привязанными к этой компании
            после изменений.
          </Typography>
        </Alert>
      </DialogContent>
      <DialogActions
        sx={{
          paddingBottom: 3,
          paddingTop: 0,
          paddingRight: 3, // Добавляем отступ справа, сдвигая кнопки левее
          justifyContent: "flex-end", // Сохраняем выравнивание по правому краю, но с отступом
        }}
      >
        <Button onClick={onClose}>Отмена</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={updateCompany.isPending || !companyData.company_name.trim()}
          startIcon={
            updateCompany.isPending ? (
              <CircularProgress size={16} />
            ) : (
              <EditIcon />
            )
          }
        >
          {updateCompany.isPending ? "Сохранение..." : "Сохранить изменения"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
