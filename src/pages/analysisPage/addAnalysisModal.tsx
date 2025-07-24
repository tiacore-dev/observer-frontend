"use client";

import type React from "react";
import { useState, useEffect } from "react";
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
  Tooltip,
  Alert,
  Divider,
  Collapse,
} from "@mui/material";
import {
  Analytics as AnalyticsIcon,
  Info as InfoIcon,
  Business as BusinessIcon,
  Chat as ChatIcon,
  Psychology as PsychologyIcon,
  Schedule as ScheduleIcon,
  PlayArrow as PlayIcon,
  ExpandMore,
  ExpandLess,
} from "@mui/icons-material";
import { useCreateAnalys } from "../../hooks/analysis/useAnalysMutations";
import { useCompanyMap } from "../../hooks/maps/useCompanyMap";
import { useChatMap } from "../../hooks/maps/useChatMap";
import { usePromptMap } from "../../hooks/maps/usePromptMap";
import { ModalSkeleton } from "../../components/skeleton/modalSkeleton";
import { SelectSkeleton } from "../../components/skeleton/selectSkeleton";
import { useAuth } from "../../context/authContext";
import { InfoCard } from "../../components/infoCard";

interface AddAnalysisModalProps {
  open: boolean;
  onClose: () => void;
}

export const AddAnalysisModal: React.FC<AddAnalysisModalProps> = ({
  open,
  onClose,
}) => {
  const { isSuperadmin, selectedCompanyId } = useAuth();
  const [analysisData, setAnalysisData] = useState({
    prompt_id: "",
    chat_id: "",
    date_from: "",
    date_to: "",
    company_id: "",
  });
  const [showHelp, setShowHelp] = useState(false);

  // Автоматически устанавливаем company_id для обычных пользователей
  useEffect(() => {
    if (!isSuperadmin && selectedCompanyId) {
      setAnalysisData((prev) => ({
        ...prev,
        company_id: selectedCompanyId,
      }));
    }
  }, [isSuperadmin, selectedCompanyId]);

  const createAnalysis = useCreateAnalys();

  const { companyMap, isLoadingCompanyMap } = useCompanyMap();
  const { chatMap, isLoadingChatsMap } = useChatMap(analysisData.company_id);
  const { promptMap, isLoadingPromptMap } = usePromptMap(
    analysisData.company_id
  );

  const [errors, setErrors] = useState({
    prompt_id: "",
    chat_id: "",
    company_id: "",
    date_from: "",
    date_to: "",
  });

  const isCompanySelected = !!analysisData.company_id;
  const tooltipMessage = "Сначала выберите компанию";

  const handleSubmit = async () => {
    const newErrors = {
      prompt_id: !analysisData.prompt_id ? "Выберите промпт" : "",
      chat_id: !analysisData.chat_id ? "Выберите чат для анализа" : "",
      company_id: !analysisData.company_id ? "Выберите компанию" : "",
      date_from: !analysisData.date_from ? "Укажите начало периода" : "",
      date_to: !analysisData.date_to ? "Укажите конец периода" : "",
    };

    // Проверка, что дата окончания не раньше даты начала
    if (analysisData.date_from && analysisData.date_to) {
      const fromDate = new Date(analysisData.date_from);
      const toDate = new Date(analysisData.date_to);
      if (fromDate > toDate) {
        newErrors.date_to = "Дата окончания не может быть раньше даты начала";
      }
    }

    setErrors(newErrors);

    if (Object.values(newErrors).some((e) => e)) return;

    try {
      await createAnalysis.mutateAsync({
        ...analysisData,
        chat_id: Number(analysisData.chat_id),
        date_from: Math.floor(
          new Date(analysisData.date_from).getTime() / 1000
        ),
        date_to: Math.floor(new Date(analysisData.date_to).getTime() / 1000),
        company_id: analysisData.company_id,
      });
      onClose();
      setAnalysisData({
        prompt_id: "",
        chat_id: "",
        date_from: "",
        date_to: "",
        company_id: isSuperadmin ? "" : selectedCompanyId || "",
      });
    } catch (error) {
      console.error("Error creating analysis:", error);
    }
  };

  const renderWithTooltip = (element: React.ReactElement) => {
    return !isCompanySelected ? (
      <Tooltip title={tooltipMessage}>{element}</Tooltip>
    ) : (
      element
    );
  };

  if (!open) return null;

  if (isLoadingCompanyMap) {
    return <ModalSkeleton fieldCount={5} hasActions />;
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <AnalyticsIcon color="primary" />
          Запустить новый анализ чата
          <Box sx={{ flexGrow: 1 }} />
          <Button
            variant="text"
            onClick={() => setShowHelp(!showHelp)}
            endIcon={showHelp ? <ExpandLess /> : <ExpandMore />}
            size="small"
          >
            Что такое анализ чата?
          </Button>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Collapse in={showHelp}>
          <InfoCard
            type="info"
            title="Что такое анализ чата?"
            description="Анализ чата - это процесс изучения сообщений в Telegram чате с помощью искусственного интеллекта. Вы можете получить статистику, выявить тренды, проанализировать настроения участников и многое другое."
          />
        </Collapse>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 1 }}>
          {isSuperadmin && (
            <FormControl fullWidth error={!!errors.company_id}>
              <InputLabel>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <BusinessIcon fontSize="small" />
                  Компания
                </Box>
              </InputLabel>
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
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <BusinessIcon fontSize="small" />
                      {name}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
              {errors.company_id && (
                <Typography variant="caption" color="error">
                  {errors.company_id}
                </Typography>
              )}
            </FormControl>
          )}

          {isLoadingPromptMap ? (
            <SelectSkeleton />
          ) : (
            renderWithTooltip(
              <FormControl fullWidth error={!!errors.prompt_id}>
                <InputLabel>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <PsychologyIcon fontSize="small" />
                    Промпт
                  </Box>
                </InputLabel>
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
                  disabled={!isCompanySelected}
                >
                  {Array.from(promptMap.entries()).map(([id, name]) => (
                    <MenuItem key={id} value={id}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        {name}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
                {errors.prompt_id && (
                  <Typography variant="caption" color="error">
                    {errors.prompt_id}
                  </Typography>
                )}
                <Typography
                  variant="caption"
                  color="textSecondary"
                  sx={{ mt: 1 }}
                >
                  Промт задаёт, какие данные искать и как анализировать
                  сообщения в чатах.
                </Typography>
              </FormControl>
            )
          )}

          {isLoadingChatsMap ? (
            <SelectSkeleton />
          ) : (
            renderWithTooltip(
              <FormControl fullWidth error={!!errors.chat_id}>
                <InputLabel>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <ChatIcon fontSize="small" />
                    Telegram чат
                  </Box>
                </InputLabel>
                <Select
                  name="chat_id"
                  value={analysisData.chat_id}
                  label="Telegram чат"
                  onChange={(e) =>
                    setAnalysisData((prev) => ({
                      ...prev,
                      chat_id: e.target.value,
                    }))
                  }
                  disabled={!isCompanySelected}
                >
                  {Array.from(chatMap.entries()).map(([id, name]) => (
                    <MenuItem key={id} value={id.toString()}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        {name}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
                {errors.chat_id && (
                  <Typography variant="caption" color="error">
                    {errors.chat_id}
                  </Typography>
                )}
                <Typography
                  variant="caption"
                  color="textSecondary"
                  sx={{ mt: 1 }}
                >
                  Выберите чат, сообщения которого нужно проанализировать
                </Typography>
              </FormControl>
            )
          )}

          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexDirection: "row",
              alignItems: "flex-start",
            }}
          >
            {renderWithTooltip(
              <FormControl
                sx={{ flex: 1, minWidth: "250px" }}
                error={!!errors.date_from}
              >
                <TextField
                  fullWidth
                  label="Начало периода"
                  type="date"
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
                  disabled={!isCompanySelected}
                  error={!!errors.date_from}
                  helperText={
                    errors.date_from || "С какой даты анализировать сообщения"
                  }
                />
              </FormControl>
            )}

            {renderWithTooltip(
              <FormControl
                sx={{ flex: 1, minWidth: "250px" }}
                error={!!errors.date_to}
              >
                <TextField
                  fullWidth
                  label="Конец периода"
                  type="date"
                  value={analysisData.date_to}
                  onChange={(e) =>
                    setAnalysisData({
                      ...analysisData,
                      date_to: e.target.value,
                    })
                  }
                  InputLabelProps={{
                    shrink: true,
                  }}
                  disabled={!isCompanySelected}
                  error={!!errors.date_to}
                  helperText={
                    errors.date_to || "До какой даты анализировать сообщения"
                  }
                />
              </FormControl>
            )}
          </Box>

          <Alert severity="info" variant="outlined">
            <Typography variant="body2">
              После создания анализ начнётся автоматически. Вы сможете
              посмотреть результаты в разделе "Анализы".
            </Typography>
          </Alert>
        </Box>
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
        <Tooltip title={!isCompanySelected ? tooltipMessage : ""}>
          <span>
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={
                !analysisData.prompt_id ||
                !analysisData.chat_id ||
                !analysisData.company_id ||
                !analysisData.date_from ||
                !analysisData.date_to
              }
              startIcon={
                createAnalysis.isPending ? (
                  <CircularProgress size={16} />
                ) : (
                  <PlayIcon />
                )
              }
            >
              {createAnalysis.isPending
                ? "Запуск анализа..."
                : "Запустить анализ"}
            </Button>
          </span>
        </Tooltip>
      </DialogActions>
    </Dialog>
  );
};
