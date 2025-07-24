// Создайте файл EditBotDescriptionModal.tsx
"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";
import { Comment as CommentIcon, Edit as EditIcon } from "@mui/icons-material";

interface EditBotDescriptionModalProps {
  open: boolean;
  onClose: () => void;
  description: string;
  onSave: (newDescription: string) => void;
  isLoading?: boolean;
}

export const EditBotDescriptionModal: React.FC<
  EditBotDescriptionModalProps
> = ({ open, onClose, description, onSave, isLoading = false }) => {
  const [newDescription, setNewDescription] = React.useState(description);

  React.useEffect(() => {
    setNewDescription(description);
  }, [description]);

  const handleSave = () => {
    onSave(newDescription);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <EditIcon color="primary" />
          Редактировать описание бота
        </Box>
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          multiline
          rows={6}
          label="Описание бота"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          margin="normal"
          helperText="Опишите назначение и особенности этого бота"
        />
      </DialogContent>
      <DialogActions
        sx={{
          paddingBottom: 3,
          paddingTop: 0,
          paddingRight: 3,
          justifyContent: "flex-end",
        }}
      >
        <Button onClick={onClose} disabled={isLoading}>
          Отмена
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={16} /> : <EditIcon />}
        >
          {isLoading ? "Сохранение..." : "Сохранить"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
