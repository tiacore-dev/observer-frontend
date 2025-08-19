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
  useMediaQuery,
  Theme,
  Collapse,
} from "@mui/material";
import { ModalSkeleton } from "../../components/skeleton/modalSkeleton";
import { Psychology, Code, ExpandMore, ExpandLess } from "@mui/icons-material";
import { InfoCard } from "../../components/infoCard";
import { useState } from "react";

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
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );
  const [showHelp, setShowHelp] = useState(false);

  if (isLoading) {
    return <ModalSkeleton fieldCount={2} hasActions={true} />;
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
            Редактировать промпт
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Button
            variant="text"
            onClick={() => setShowHelp(!showHelp)}
            endIcon={showHelp ? <ExpandLess /> : <ExpandMore />}
            size="small"
          >
            {isMobile ? "Помощь" : "Информация"}
          </Button>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Collapse in={showHelp}>
          <InfoCard
            type="info"
            title="Редактирование промпта"
            description="Здесь вы можете изменить название и текст промпта. Промпт используется для анализа сообщений в чатах."
          />
          <Alert severity="info" sx={{ mb: 1 }}>
            <Typography variant="body2">
              💡 <strong>Советы для хорошего промпта:</strong>
              <br />• Будьте конкретны в инструкциях
              <br />• Укажите желаемый формат ответа
              <br />• Приведите примеры, если нужно
              <br />• Используйте простой и понятный язык
            </Typography>
          </Alert>
        </Collapse>

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
                minRows={isMobile ? 6 : 8}
                maxRows={isMobile ? 12 : 20}
                required
                helperText={`Опишите подробно, что должен делать ИИ при анализе сообщений`}
                placeholder="Например: Проанализируй сообщения в чате и найди все упоминания проблем с продуктом. Классифицируй проблемы по категориям и предложи решения..."
                sx={{
                  "& .MuiInputBase-root": {
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  },
                }}
              />
            </>
          )}
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
          onClick={onSubmit}
          variant="contained"
          disabled={isSubmitting || !editData.prompt_name.trim()}
          startIcon={
            isSubmitting ? <CircularProgress size={16} /> : <Psychology />
          }
          fullWidth={isMobile}
          sx={isMobile ? { ml: 1 } : {}}
        >
          {isSubmitting ? "Сохранение..." : "Сохранить"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
