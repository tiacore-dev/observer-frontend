"use client";

import type React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Typography,
  Box,
} from "@mui/material";
import { DeleteOutline, Close } from "@mui/icons-material";

interface DeletePromptDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
  title?: string;
  message?: string;
  itemName?: string;
}

export const DeleteDialog: React.FC<DeletePromptDialogProps> = ({
  open,
  onClose,
  onConfirm,
  isDeleting,
  title = "Удаление",
  message = "Вы уверены, что хотите удалить этот элемент?",
  itemName,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 1,
          padding: "24px",
          width: "440px",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      {/* Заголовок */}
      <DialogTitle
        sx={{
          p: 0,
          mb: 2,
          fontSize: "1.25rem",
          fontWeight: 600,
          color: "text.primary",
          lineHeight: 1.5,
        }}
      >
        {title}
      </DialogTitle>

      {/* Содержимое */}
      <DialogContent sx={{ p: 0, mb: 3 }}>
        <Typography variant="body1" sx={{ mb: 2, color: "text.secondary" }}>
          {message}
        </Typography>

        {itemName && (
          <Box
            sx={{
              backgroundColor: "action.hover",
              p: 2,
              borderRadius: 1,
              mb: 2,
            }}
          >
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", mb: 0.5 }}
            >
              Удаляемый элемент:
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {itemName}
            </Typography>
          </Box>
        )}

        <Typography
          variant="body2"
          sx={{ color: "error.main", fontSize: "0.875rem" }}
        >
          Это действие нельзя отменить
        </Typography>
      </DialogContent>

      {/* Кнопки */}
      <DialogActions sx={{ p: 0, gap: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          disabled={isDeleting}
          startIcon={<Close />}
          sx={{
            flex: 1,
            py: 1.5,
            borderRadius: 1,
            borderColor: "divider",
            textTransform: "none",
            fontWeight: 500,
          }}
        >
          Отмена
        </Button>

        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          disabled={isDeleting}
          startIcon={
            isDeleting ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <DeleteOutline />
            )
          }
          sx={{
            flex: 1,
            py: 1.5,
            borderRadius: 1,
            textTransform: "none",
            fontWeight: 500,
          }}
        >
          {isDeleting ? "Удаление..." : "Удалить"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
