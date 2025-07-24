"use client";

import type React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  Box,
  Skeleton,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
} from "@mui/material";
import { ModalSkeleton } from "../../components/skeleton/modalSkeleton";
import { Psychology, Code, ExpandMore } from "@mui/icons-material";

interface EditPromptModalProps {
  open: boolean;
  onClose: () => void;
  editData: {
    prompt_name: string;
    text: string;
  };
  onEditDataChange: (field: string, value: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  isLoading?: boolean;
}

export const EditPromptModal: React.FC<EditPromptModalProps> = ({
  open,
  onClose,
  editData,
  onEditDataChange,
  onSubmit,
  isSubmitting,
  isLoading = false,
}) => {
  if (isLoading) {
    return <ModalSkeleton fieldCount={2} hasActions={true} />;
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Psychology color="primary" />
          Редактировать промпт
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 1 }}>
          {isLoading ? (
            <>
              <Skeleton variant="rectangular" height={56} />
              <Skeleton variant="rectangular" height={300} />
            </>
          ) : (
            <>
              <TextField
                fullWidth
                label="Название промпта"
                name="prompt_name"
                value={editData.prompt_name}
                onChange={(e) =>
                  onEditDataChange("prompt_name", e.target.value)
                }
                required
                placeholder="Например: Анализ настроения клиентов"
              />
              <TextField
                fullWidth
                label="Инструкция для анализа"
                name="text"
                value={editData.text}
                onChange={(e) => onEditDataChange("text", e.target.value)}
                multiline
                minRows={8}
                maxRows={20}
                required
                helperText={`${editData.text.length} символов. Опишите подробно, что должен делать ИИ при анализе сообщений`}
                placeholder="Например: Проанализируй сообщения в чате и найди все упоминания проблем с продуктом. Классифицируй проблемы по категориям и предложи решения..."
                sx={{
                  "& .MuiInputBase-root": {
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  },
                }}
              />
              {/* <Alert severity="info" variant="outlined">
                <Typography variant="body2">
                  💡 <strong>Советы для хорошего промпта:</strong>
                  <br />• Будьте конкретны в инструкциях
                  <br />• Укажите желаемый формат ответа
                  <br />• Приведите примеры, если нужно
                  <br />• Используйте простой и понятный язык
                </Typography>
              </Alert> */}
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          paddingBottom: 3,
          paddingTop: 0,
          paddingRight: 3,
          justifyContent: "flex-end",
        }}
      >
        {isLoading ? (
          <>
            <Skeleton variant="rectangular" width={64} height={36} />
            <Skeleton variant="rectangular" width={96} height={36} />
          </>
        ) : (
          <>
            <Button onClick={onClose}>Отмена</Button>
            <Button
              onClick={onSubmit}
              variant="contained"
              disabled={isSubmitting}
              startIcon={
                isSubmitting ? <CircularProgress size={16} /> : <Psychology />
              }
            >
              {isSubmitting ? "Сохранение..." : "Сохранить промпт"}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};
