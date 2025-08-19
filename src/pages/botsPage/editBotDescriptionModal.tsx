// src/components/editBotDescriptionModal.tsx
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
  useMediaQuery,
  Theme,
} from "@mui/material";
import { Comment as CommentIcon, Edit as EditIcon } from "@mui/icons-material";

interface EditBotDescriptionModalProps {
  open: boolean;
  onClose: () => void;
  description: string;
  onSave: (newDescription: string) => void;
  isLoading?: boolean;
  isMobile?: boolean;
}

export const EditBotDescriptionModal: React.FC<
  EditBotDescriptionModalProps
> = ({
  open,
  onClose,
  description,
  onSave,
  isLoading = false,
  isMobile = false,
}) => {
  const [newDescription, setNewDescription] = React.useState(description);

  React.useEffect(() => {
    setNewDescription(description);
  }, [description]);

  const handleSave = () => {
    onSave(newDescription);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
    >
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <EditIcon color="primary" />
          <Typography variant={isMobile ? "h6" : "inherit"}>
            Редактировать описание бота
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          multiline
          rows={isMobile ? 6 : 8}
          label="Описание бота"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          margin="normal"
          helperText="Опишите назначение и особенности этого бота"
        />
      </DialogContent>
      <DialogActions
        sx={{
          p: isMobile ? 2 : 3,
          justifyContent: isMobile ? "space-between" : "flex-end",
        }}
      >
        <Button onClick={onClose} disabled={isLoading} fullWidth={isMobile}>
          Отмена
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={16} /> : <EditIcon />}
          fullWidth={isMobile}
          sx={isMobile ? { ml: 1 } : {}}
        >
          {isLoading ? "Сохранение..." : "Сохранить"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
