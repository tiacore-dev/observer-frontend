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
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
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
    prompt: "",
    chat: 0,
    date_from: null as Date | null,
    date_to: null as Date | null,
    company: "",
  });

  const createAnalysis = useCreateAnalys();

  // Получаем списки данных
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

  const handleDateChange =
    (name: "date_from" | "date_to") => (date: Date | null) => {
      setAnalysisData((prev) => ({ ...prev, [name]: date }));
    };

  const [errors, setErrors] = useState({
    prompt: "",
    chat: "",
    company: "",
  });

  const handleSubmit = async () => {
    const newErrors = {
      prompt: !analysisData.prompt ? "Prompt обязателен" : "",
      chat: !analysisData.chat ? "Chat обязателен" : "",
      company: !analysisData.company ? "Выберите компанию" : "",
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((e) => e)) return;

    try {
      await createAnalysis.mutateAsync({
        ...analysisData,
        chat: Number(analysisData.chat),
        date_from: analysisData.date_from
          ? Math.floor(analysisData.date_from.getTime() / 1000)
          : 0,
        date_to: analysisData.date_to
          ? Math.floor(analysisData.date_to.getTime() / 1000)
          : 0,
        company: analysisData.company,
      });
      onClose();
      setAnalysisData({
        prompt: "",
        chat: 0,
        date_from: null,
        date_to: null,
        company: "",
      });
    } catch (error) {
      console.error("Error creating analysis:", error);
    }
  };

  // Обработка состояний загрузки
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
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Добавить новый анализ</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            <FormControl fullWidth required error={!!errors.prompt}>
              <InputLabel>Промпт</InputLabel>
              <Select
                name="prompt"
                value={analysisData.prompt}
                label="Промпт"
                onChange={(e) =>
                  setAnalysisData((prev) => ({
                    ...prev,
                    prompt: e.target.value,
                  }))
                }
              >
                {promptsData?.prompts.map((prompt) => (
                  <MenuItem key={prompt.prompt_id} value={prompt.prompt_id}>
                    {prompt.prompt_name}
                  </MenuItem>
                ))}
              </Select>
              {errors.prompt && (
                <Typography variant="caption" color="error">
                  {errors.prompt}
                </Typography>
              )}
            </FormControl>

            <FormControl fullWidth required error={!!errors.chat}>
              <InputLabel>Чат</InputLabel>
              <Select
                name="chat"
                value={analysisData.chat}
                label="Чат"
                onChange={(e) =>
                  setAnalysisData((prev) => ({
                    ...prev,
                    chat: Number(e.target.value),
                  }))
                }
              >
                {chatsData?.chats.map((chat) => (
                  <MenuItem key={chat.chat_id} value={chat.chat_id}>
                    {chat.chat_name}
                  </MenuItem>
                ))}
              </Select>
              {errors.chat && (
                <Typography variant="caption" color="error">
                  {errors.chat}
                </Typography>
              )}
            </FormControl>

            <DateTimePicker
              label="Дата от"
              value={analysisData.date_from}
              onChange={handleDateChange("date_from")}
              slotProps={{
                textField: {
                  fullWidth: true,
                },
              }}
            />

            <DateTimePicker
              label="Дата до"
              value={analysisData.date_to}
              onChange={handleDateChange("date_to")}
              slotProps={{
                textField: {
                  fullWidth: true,
                },
              }}
            />

            <FormControl fullWidth required error={!!errors.company}>
              <InputLabel>Компания</InputLabel>
              <Select
                name="company"
                value={analysisData.company}
                label="Компания"
                onChange={(e) =>
                  setAnalysisData((prev) => ({
                    ...prev,
                    company: e.target.value,
                  }))
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
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Отмена</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={
              !analysisData.prompt ||
              !analysisData.chat ||
              !analysisData.company
            }
          >
            Создать
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};
