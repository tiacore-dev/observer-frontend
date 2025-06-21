import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Typography,
  TextField,
} from "@mui/material";
import { useCreateAnalys } from "../../hooks/analysis/useAnalysMutations";
import { useCompanyMap } from "../../hooks/maps/useCompanyMap";
import { useChatMap } from "../../hooks/maps/useChatMap";
import { usePromptMap } from "../../hooks/maps/usePromptMap";
import { ModalSkeleton } from "../../components/skeleton/modalSkeleton";

interface AddAnalysisModalProps {
  open: boolean;
  onClose: () => void;
}

export const AddAnalysisModal: React.FC<AddAnalysisModalProps> = ({
  open,
  onClose,
}) => {
  const [analysisData, setAnalysisData] = useState({
    prompt_id: "",
    chat_id: "", // Изменено с 0 на пустую строку
    date_from: "",
    date_to: "",
    company_id: "",
  });

  const createAnalysis = useCreateAnalys();

  // Получение map
  const { companyMap, isLoading: isLoadingCompanyMap } = useCompanyMap();
  const chatMap = useChatMap();
  const promptMap = usePromptMap();

  const [errors, setErrors] = useState({
    prompt_id: "",
    chat_id: "",
    company_id: "",
  });

  const isLoading =
    isLoadingCompanyMap || !chatMap.size || !promptMap.size || !companyMap.size;

  const handleSubmit = async () => {
    const newErrors = {
      prompt_id: !analysisData.prompt_id ? "Prompt обязателен" : "",
      chat_id: !analysisData.chat_id ? "Chat обязателен" : "",
      company_id: !analysisData.company_id ? "Выберите компанию" : "",
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((e) => e)) return;

    try {
      await createAnalysis.mutateAsync({
        ...analysisData,
        chat_id: Number(analysisData.chat_id), // Приводим к числу только при отправке
        date_from: analysisData.date_from
          ? Math.floor(new Date(analysisData.date_from).getTime() / 1000)
          : 0,
        date_to: analysisData.date_to
          ? Math.floor(new Date(analysisData.date_to).getTime() / 1000)
          : 0,
        company_id: analysisData.company_id,
      });
      onClose();
      setAnalysisData({
        prompt_id: "",
        chat_id: "",
        date_from: "",
        date_to: "",
        company_id: "",
      });
    } catch (error) {
      console.error("Error creating analysis:", error);
    }
  };

  if (!open) return null;

  if (isLoading) {
    return <ModalSkeleton fieldCount={5} hasActions />;
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Добавить новый анализ</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <FormControl fullWidth required error={!!errors.prompt_id}>
            <InputLabel>Промпт</InputLabel>
            <Select
              name="prompt_id"
              value={analysisData.prompt_id}
              label="Промпт"
              onChange={(e) =>
                setAnalysisData((prev) => ({
                  ...prev,
                  prompt_id: e.target.value,
                }))
              }
            >
              {Array.from(promptMap.entries()).map(([id, name]) => (
                <MenuItem key={id} value={id}>
                  {name}
                </MenuItem>
              ))}
            </Select>
            {errors.prompt_id && (
              <Typography variant="caption" color="error">
                {errors.prompt_id}
              </Typography>
            )}
          </FormControl>

          <FormControl fullWidth required error={!!errors.chat_id}>
            <InputLabel>Чат</InputLabel>
            <Select
              name="chat_id"
              value={analysisData.chat_id}
              label="Чат"
              onChange={(e) =>
                setAnalysisData((prev) => ({
                  ...prev,
                  chat_id: e.target.value, // Сохраняем как строку
                }))
              }
            >
              {Array.from(chatMap.entries()).map(([id, name]) => (
                <MenuItem key={id} value={id.toString()}>
                  {name}
                </MenuItem>
              ))}
            </Select>
            {errors.chat_id && (
              <Typography variant="caption" color="error">
                {errors.chat_id}
              </Typography>
            )}
          </FormControl>

          <TextField
            label="Дата от"
            type="datetime-local"
            fullWidth
            value={analysisData.date_from}
            onChange={(e) =>
              setAnalysisData({
                ...analysisData,
                date_from: e.target.value,
              })
            }
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            label="Дата до"
            type="datetime-local"
            fullWidth
            value={analysisData.date_to}
            onChange={(e) =>
              setAnalysisData({ ...analysisData, date_to: e.target.value })
            }
            InputLabelProps={{
              shrink: true,
            }}
          />

          <FormControl fullWidth required error={!!errors.company_id}>
            <InputLabel>Компания</InputLabel>
            <Select
              name="company_id"
              value={analysisData.company_id}
              label="Компания"
              onChange={(e) =>
                setAnalysisData((prev) => ({
                  ...prev,
                  company_id: e.target.value,
                }))
              }
            >
              {Array.from(companyMap.entries()).map(([id, name]) => (
                <MenuItem key={id} value={id}>
                  {name}
                </MenuItem>
              ))}
            </Select>
            {errors.company_id && (
              <Typography variant="caption" color="error">
                {errors.company_id}
              </Typography>
            )}
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={
            !analysisData.prompt_id ||
            !analysisData.chat_id ||
            !analysisData.company_id
          }
        >
          {createAnalysis.isPending ? (
            <CircularProgress size={24} />
          ) : (
            "Создать"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
