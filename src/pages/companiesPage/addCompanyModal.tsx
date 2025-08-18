"use client";

import type React from "react";
import { useState } from "react";
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
  Collapse,
  Tooltip,
  useMediaQuery,
  Theme,
} from "@mui/material";
import {
  Business as BusinessIcon,
  Info as InfoIcon,
  Description as DescriptionIcon,
  ExpandMore,
  ExpandLess,
} from "@mui/icons-material";
import { useCreateCompany } from "../../hooks/companies/useCompaniesMutations";
import { ModalSkeleton } from "../../components/skeleton/modalSkeleton";
import { useAuth } from "../../context/authContext";
import { InfoCard } from "../../components/infoCard";

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
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );
  const [companyData, setCompanyData] = useState({
    company_name: "",
    description: "",
  });
  const createCompany = useCreateCompany();
  const { addAvailableCompany } = useAuth();
  const [showHelp, setShowHelp] = useState(false);

  const [errors, setErrors] = useState({
    company_name: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCompanyData((prev) => ({ ...prev, [name]: value }));

    if (name === "company_name" && value.trim()) {
      setErrors((prev) => ({ ...prev, company_name: "" }));
    }
  };

  const handleSubmit = async () => {
    const newErrors = {
      company_name: !companyData.company_name.trim()
        ? "Название компании обязательно"
        : "",
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((e) => e)) return;

    try {
      await createCompany.mutateAsync(companyData, {
        onSuccess: (data) => {
          addAvailableCompany(data.company_id);
          onClose();
          setCompanyData({ company_name: "", description: "" });
          if (onSuccess) onSuccess();
        },
      });
    } catch (error) {
      console.error("Error creating company:", error);
    }
  };

  if (createCompany.isPending) {
    return <ModalSkeleton fieldCount={2} hasActions />;
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
    >
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <BusinessIcon color="primary" />
          <Typography variant={isMobile ? "h6" : "inherit"}>
            Создать новую компанию
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Button
            variant="text"
            onClick={() => setShowHelp(!showHelp)}
            endIcon={showHelp ? <ExpandLess /> : <ExpandMore />}
            size="small"
          >
            {isMobile ? "Помощь" : "Что такое компания?"}
          </Button>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Collapse in={showHelp}>
          <InfoCard
            type="info"
            title="Что такое компания?"
            description="Компания - это ваше рабочее пространство, которое позволяет группировать промпты, ботов и расписания для удобного использования"
          />
        </Collapse>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            fullWidth
            label="Название компании"
            name="company_name"
            value={companyData.company_name}
            onChange={handleChange}
            error={!!errors.company_name}
            helperText={errors.company_name}
            required
            placeholder="Введите название компании"
          />

          <TextField
            fullWidth
            label="Описание компании (необязательно)"
            name="description"
            value={companyData.description}
            onChange={handleChange}
            multiline
            rows={isMobile ? 3 : 4}
            helperText="Краткое описание"
            placeholder="Например: Розничная торговля электроникой..."
          />
        </Box>

        <Alert severity="info" variant="outlined" sx={{ mt: 2 }}>
          <Typography variant="body2">
            После создания компании вы сможете добавить для неё ботов, настроить
            анализ чатов и создать расписания отчётов.
          </Typography>
        </Alert>
      </DialogContent>
      <DialogActions
        sx={{
          p: isMobile ? 2 : 3,
          justifyContent: "space-between",
        }}
      >
        <Button onClick={onClose} fullWidth={isMobile}>
          Отмена
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!companyData.company_name.trim()}
          startIcon={
            createCompany.isPending ? (
              <CircularProgress size={16} />
            ) : (
              <BusinessIcon />
            )
          }
          fullWidth={isMobile}
          sx={isMobile ? { ml: 1 } : {}}
        >
          {createCompany.isPending ? "Создание..." : "Создать"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
