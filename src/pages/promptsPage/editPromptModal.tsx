// EditPromptModal.tsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  Box,
} from "@mui/material";

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
}

export const EditPromptModal: React.FC<EditPromptModalProps> = ({
  open,
  onClose,
  editData,
  onEditDataChange,
  onSubmit,
  isSubmitting,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Редактировать промпт</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <TextField
            fullWidth
            label="Название промпта"
            name="prompt_name"
            value={editData.prompt_name}
            onChange={(e) => onEditDataChange("prompt_name", e.target.value)}
            required
          />

          <TextField
            fullWidth
            label="Текст промпта"
            name="text"
            value={editData.text}
            onChange={(e) => onEditDataChange("text", e.target.value)}
            multiline
            rows={6}
            required
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button onClick={onSubmit} variant="contained" disabled={isSubmitting}>
          {isSubmitting ? <CircularProgress size={24} /> : "Сохранить"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
