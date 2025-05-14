import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useCreateBot } from "../../hooks/bots/useBotsMutations";
import { useCompaniesQuery } from "../../hooks/companies/useCompaniesQuery";

interface AddBotModalProps {
  open: boolean;
  onClose: () => void;
}

export const AddBotModal: React.FC<AddBotModalProps> = ({ open, onClose }) => {
  const [botData, setBotData] = useState({
    token: "",
    company: "",
    comment: "",
  });
  const createBot = useCreateBot();

  // Получаем список компаний
  const { data: companiesData, isLoading, error } = useCompaniesQuery();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBotData((prev) => ({ ...prev, [name]: value }));
  };

  const [errors, setErrors] = useState({
    token: "",
    company: "",
  });

  const validateToken = (token: string) => {
    const tokenRegex = /^\d+:[a-zA-Z0-9_-]+$/;
    return tokenRegex.test(token);
  };

  const handleSubmit = async () => {
    const newErrors = {
      token: !botData.token
        ? "Токен обязателен"
        : !validateToken(botData.token)
        ? "Неверный формат токена"
        : "",
      company: !botData.company ? "Выберите компанию" : "",
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((e) => e)) return;

    try {
      await createBot.mutateAsync(botData);
      onClose();
      setBotData({ token: "", company: "", comment: "" });
    } catch (error) {
      console.error("Error creating bot:", error);
    }
  };

  // Обработка состояний загрузки и ошибок
  if (isLoading) {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Добавить нового бота</DialogTitle>
        <DialogContent>
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  if (error) {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Добавить нового бота</DialogTitle>
        <DialogContent>
          <Typography color="error">
            Ошибка при загрузке компаний: {(error as Error).message}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Закрыть</Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Добавить нового бота</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <TextField
            fullWidth
            label="Токен бота"
            name="token"
            value={botData.token}
            onChange={handleChange}
            error={!!errors.token}
            helperText={errors.token}
            required
          />

          <FormControl fullWidth required error={!!errors.company}>
            <InputLabel>Компания</InputLabel>
            <Select
              name="company"
              value={botData.company}
              label="Компания"
              onChange={(e) =>
                setBotData((prev) => ({ ...prev, company: e.target.value }))
              }
            >
              {companiesData?.companies.map((company) => (
                <MenuItem key={company.company_id} value={company.company_id}>
                  {company.company_name}
                </MenuItem>
              ))}
            </Select>
            {errors.company && (
              <Typography variant="caption" color="error">
                {errors.company}
              </Typography>
            )}
          </FormControl>

          <TextField
            fullWidth
            label="Комментарий (необязательно)"
            name="comment"
            value={botData.comment}
            onChange={handleChange}
            multiline
            rows={3}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!botData.token || !botData.company}
        >
          Создать
        </Button>
      </DialogActions>
    </Dialog>
  );
};
