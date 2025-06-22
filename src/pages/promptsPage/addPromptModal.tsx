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
import { useCreatePrompt } from "../../hooks/prompts/usePromptMutations";
import { useCompaniesQuery } from "../../hooks/companies/useCompaniesQuery";
import { ModalSkeleton } from "../../components/skeleton/modalSkeleton";
interface AddPromptModalProps {
  open: boolean;
  onClose: () => void;
}

export const AddPromptModal: React.FC<AddPromptModalProps> = ({
  open,
  onClose,
}) => {
  const [promptData, setPromptData] = useState({
    prompt_name: "",
    text: "",
    company_id: "",
  });
  const createPrompt = useCreatePrompt();

  const { data: companiesData, isLoading, error } = useCompaniesQuery();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPromptData((prev) => ({ ...prev, [name]: value }));
  };

  const [errors, setErrors] = useState({
    prompt_name: "",
    company_id: "",
  });

  if (isLoading) {
    return <ModalSkeleton fieldCount={3} hasActions={false} />;
  }

  if (error) {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Добавить новый промпт</DialogTitle>
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

  const handleSubmit = async () => {
    const newErrors = {
      prompt_name: !promptData.prompt_name ? "Название обязательно" : "",
      company_id: !promptData.company_id ? "Выберите компанию" : "",
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((e) => e)) return;

    try {
      await createPrompt.mutateAsync(promptData);
      onClose();
      setPromptData({ prompt_name: "", text: "", company_id: "" });
    } catch (error) {
      console.error("Error creating prompt:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Добавить новый промпт</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <FormControl fullWidth required error={!!errors.company_id}>
            <InputLabel>Компания</InputLabel>
            <Select
              name="company_id"
              value={promptData.company_id}
              label="Компания"
              onChange={(e) =>
                setPromptData((prev) => ({
                  ...prev,
                  company_id: e.target.value,
                }))
              }
            >
              {companiesData?.companies.map((company) => (
                <MenuItem key={company.company_id} value={company.company_id}>
                  {company.company_name}
                </MenuItem>
              ))}
            </Select>
            {errors.company_id && (
              <Typography variant="caption" color="error">
                {errors.company_id}
              </Typography>
            )}
          </FormControl>
          <TextField
            fullWidth
            label="Название промпта"
            name="prompt_name"
            value={promptData.prompt_name}
            onChange={handleChange}
            error={!!errors.prompt_name}
            helperText={errors.prompt_name}
            required
          />

          <TextField
            fullWidth
            label="Текст промпта"
            name="text"
            value={promptData.text}
            onChange={handleChange}
            multiline
            rows={6}
            required
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={
            !promptData.prompt_name ||
            !promptData.text ||
            !promptData.company_id
          }
        >
          Создать
        </Button>
      </DialogActions>
    </Dialog>
  );
};
