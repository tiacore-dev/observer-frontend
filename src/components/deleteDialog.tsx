import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";

interface DeletePromptDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

export const DeleteDialog: React.FC<DeletePromptDialogProps> = ({
  open,
  onClose,
  onConfirm,
  isDeleting,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm" // Устанавливаем максимальную ширину как 'sm' (600px)
      fullWidth // Растягиваем на всю доступную ширину в пределах maxWidth
      PaperProps={{
        style: {
          minWidth: "400px", // Минимальная ширина
          minHeight: "200px", // Минимальная высота
        },
      }}
    >
      <DialogTitle sx={{ fontSize: "1.2rem", padding: "20px 24px" }}>
        Подтверждение удаления
      </DialogTitle>
      <DialogContent sx={{ padding: "20px 24px" }}>
        <Typography variant="body1">Вы уверены, что хотите удалить?</Typography>
      </DialogContent>
      <DialogActions sx={{ padding: "20px 24px" }}>
        <Button
          onClick={onClose}
          sx={{ fontSize: "0.9rem", padding: "8px 16px" }}
        >
          Отмена
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          disabled={isDeleting}
          sx={{ fontSize: "0.9rem", padding: "8px 16px" }}
        >
          {isDeleting ? <CircularProgress size={24} /> : "Удалить"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
