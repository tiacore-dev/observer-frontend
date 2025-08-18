"use client";

import type React from "react";
import { useState, useEffect } from "react";
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
  Typography,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Collapse,
  Divider,
  Tooltip,
  CircularProgress,
  useMediaQuery,
  Theme,
} from "@mui/material";
import {
  Psychology,
  ExpandMore,
  Lightbulb,
  Code,
  ExpandLess,
} from "@mui/icons-material";
import { useCreatePrompt } from "../../hooks/prompts/usePromptMutations";
import { useCompaniesQuery } from "../../hooks/companies/useCompaniesQuery";
import { ModalSkeleton } from "../../components/skeleton/modalSkeleton";
import { useAuth } from "../../context/authContext";
import { InfoCard } from "../../components/infoCard";
import BusinessIcon from "@mui/icons-material/Business";
import PsychologyIcon from "@mui/icons-material/Psychology";

interface AddPromptModalProps {
  open: boolean;
  onClose: () => void;
}

export const AddPromptModal: React.FC<AddPromptModalProps> = ({
  open,
  onClose,
}) => {
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );
  const { isSuperadmin } = useAuth();
  const selectedCompanyId = localStorage.getItem("selected_company_id");

  const [promptData, setPromptData] = useState({
    prompt_name: "",
    text: "",
    company_id: isSuperadmin ? "" : selectedCompanyId || "",
  });
  const [showHelp, setShowHelp] = useState(false);
  const createPrompt = useCreatePrompt();

  useEffect(() => {
    if (!isSuperadmin && selectedCompanyId) {
      setPromptData((prev) => ({
        ...prev,
        company_id: selectedCompanyId,
      }));
    }
  }, [isSuperadmin, selectedCompanyId]);

  const { data: companiesData, isLoading, error } = useCompaniesQuery();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPromptData((prev) => ({ ...prev, [name]: value }));
  };

  const [errors, setErrors] = useState({
    prompt_name: "",
    company_id: "",
    text: "",
  });

  const handleSubmit = async () => {
    const trimmedPromptName = promptData.prompt_name.trim();
    const trimmedText = promptData.text.trim();

    const newErrors = {
      prompt_name: !trimmedPromptName
        ? "Название обязательно"
        : trimmedPromptName.length < 3
        ? "Название должно содержать минимум 3 символа"
        : "",
      company_id: !promptData.company_id ? "Выберите компанию" : "",
      text: !trimmedText ? "Инструкция обязательна" : "",
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((e) => e)) return;

    try {
      await createPrompt.mutateAsync({
        ...promptData,
        prompt_name: trimmedPromptName,
        text: trimmedText,
      });
      onClose();
      setPromptData({
        prompt_name: "",
        text: "",
        company_id: isSuperadmin ? "" : selectedCompanyId || "",
      });
    } catch (error) {
      // console.error("Error creating prompt:", error);
    }
  };

  const promptExamples = [
    {
      title: "Анализ настроения",
      example:
        "Проанализируй настроение в этих сообщениях. Определи общий эмоциональный фон: позитивный, негативный или нейтральный. Укажи основные темы обсуждения и выдели ключевые проблемы, если они есть.",
    },
    {
      title: "Поиск проблем",
      example:
        "Найди в сообщениях все жалобы, проблемы и негативные отзывы. Классифицируй их по типам (технические проблемы, проблемы с сервисом, ценовые вопросы и т.д.). Предложи возможные решения.",
    },
    {
      title: "Анализ активности",
      example:
        "Проанализируй активность участников чата. Определи самых активных пользователей, время пиковой активности, основные темы обсуждения. Дай рекомендации по улучшению вовлеченности.",
    },
  ];

  if (isLoading) {
    return <ModalSkeleton fieldCount={3} hasActions={false} />;
  }

  if (error) {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Psychology color="primary" />
            Создать промпт
          </Box>
        </DialogTitle>
        <DialogContent>
          <Alert severity="error">
            <Typography>
              Ошибка при загрузке компаний: {(error as Error).message}
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Закрыть</Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
    >
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Psychology color="primary" />
          <Typography variant={isMobile ? "h6" : "inherit"}>
            Создать новый промпт
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Button
            variant="text"
            onClick={() => setShowHelp(!showHelp)}
            endIcon={showHelp ? <ExpandLess /> : <ExpandMore />}
            size="small"
          >
            {isMobile ? "Помощь" : "Что такое промпт?"}
          </Button>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Collapse in={showHelp}>
          <InfoCard
            type="info"
            title="Что такое промпт?"
            description="Промпт — это инструкция для ИИ, которая объясняет, как
              анализировать сообщения, какие данные искать. Чем точнее
              инструкция, тем лучше результат анализа."
          />
        </Collapse>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 1 }}>
          {/* Выбор компании */}
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
          )}

          {/* Название промпта */}
          <TextField
            fullWidth
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PsychologyIcon fontSize="small" />
                Название промпта
              </Box>
            }
            name="prompt_name"
            value={promptData.prompt_name}
            onChange={handleChange}
            error={!!errors.prompt_name}
            helperText={
              errors.prompt_name ||
              "Краткое описание того, что делает этот промпт (минимум 3 символа)"
            }
            placeholder="Например: Анализ настроения клиентов"
          />

          {/* Примеры промптов */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Code />
                <Typography>Примеры готовых промптов</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {promptExamples.map((example, index) => (
                  <Box
                    key={index}
                    sx={{
                      p: 2,
                      border: 1,
                      borderColor: "divider",
                      borderRadius: 1,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                      }}
                    >
                      <Typography variant="subtitle2">
                        {example.title}
                      </Typography>
                      <Button
                        size="small"
                        onClick={() =>
                          setPromptData((prev) => ({
                            ...prev,
                            text: example.example,
                          }))
                        }
                      >
                        Использовать
                      </Button>
                    </Box>

                    <Typography
                      variant="body2"
                      sx={{ fontFamily: "monospace", fontSize: "0.8rem" }}
                    >
                      {example.example}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Текст промпта */}
          <Box>
            <TextField
              fullWidth
              label="Инструкция для анализа"
              name="text"
              value={promptData.text}
              onChange={handleChange}
              multiline
              minRows={isMobile ? 4 : 8}
              maxRows={isMobile ? 8 : 20}
              required
              error={!!errors.text}
              helperText={
                errors.text ||
                "Опишите подробно, что должен делать ИИ при анализе сообщений"
              }
              placeholder="Например: Проанализируй сообщения в чате и найди все упоминания проблем с продуктом. Классифицируй проблемы по категориям и предложи решения..."
            />

            <Alert severity="info" variant="outlined" sx={{ mt: 2 }}>
              <Typography variant="body2">
                💡 <strong>Советы для хорошего промпта:</strong>
                <br />• Будьте конкретны в инструкциях
                <br />• Укажите желаемый формат ответа
                <br />• Приведите примеры, если нужно
                <br />• Используйте простой и понятный язык
              </Typography>
            </Alert>
          </Box>
        </Box>
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
          disabled={
            promptData.prompt_name.trim().length < 3 ||
            (isSuperadmin && !promptData.company_id) ||
            !promptData.text.trim() ||
            createPrompt.isPending
          }
          startIcon={
            createPrompt.isPending ? (
              <CircularProgress size={16} />
            ) : (
              <Psychology />
            )
          }
          fullWidth={isMobile}
          sx={isMobile ? { ml: 1 } : {}}
        >
          {createPrompt.isPending ? "Создаем..." : "Создать промпт"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
