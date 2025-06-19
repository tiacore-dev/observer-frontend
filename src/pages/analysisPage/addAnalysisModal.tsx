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
import { useCompaniesQuery } from "../../hooks/companies/useCompaniesQuery";
import { usePromptsQuery } from "../../hooks/prompts/usePromptsQuery";
import { useChatsQuery } from "../../hooks/chats/useChatsQuery";

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
    chat_id: 0,
    date_from: "",
    date_to: "",
    company_id: "",
  });

  const createAnalysis = useCreateAnalys();

  const {
    data: companiesData,
    isLoading: companiesLoading,
    error: companiesError,
  } = useCompaniesQuery();
  const {
    data: promptsData,
    isLoading: promptsLoading,
    error: promptsError,
  } = usePromptsQuery();
  const {
    data: chatsData,
    isLoading: chatsLoading,
    error: chatsError,
  } = useChatsQuery();

  const [errors, setErrors] = useState({
    prompt_id: "",
    chat_id: "",
    company_id: "",
  });

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
        chat_id: Number(analysisData.chat_id),
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
        chat_id: 0,
        date_from: "",
        date_to: "",
        company_id: "",
      });
    } catch (error) {
      console.error("Error creating analysis:", error);
    }
  };

  const isLoading = companiesLoading || promptsLoading || chatsLoading;
  const error = companiesError || promptsError || chatsError;

  if (isLoading) {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Добавить новый анализ</DialogTitle>
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
        <DialogTitle>Добавить новый анализ</DialogTitle>
        <DialogContent>
          <Typography color="error">
            Ошибка при загрузке данных: {(error as Error).message}
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
              {promptsData?.prompts.map((prompt) => (
                <MenuItem key={prompt.prompt_id} value={prompt.prompt_id}>
                  {prompt.prompt_name}
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
                  chat_id: Number(e.target.value),
                }))
              }
            >
              {chatsData?.chats.map((chat) => (
                <MenuItem key={chat.chat_id} value={chat.chat_id}>
                  {chat.chat_name}
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
              setAnalysisData({ ...analysisData, date_from: e.target.value })
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
          Создать
        </Button>
      </DialogActions>
    </Dialog>
  );
};
