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
  Skeleton,
} from "@mui/material";
import { ModalSkeleton } from "../../components/skeleton/modalSkeleton";

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
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isLoading ? (
          <Skeleton variant="text" width="60%" />
        ) : (
          "Редактировать промпт"
        )}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          {isLoading ? (
            <>
              <Skeleton variant="rectangular" height={56} />
              <Skeleton variant="rectangular" height={200} />
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
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
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
            >
              {isSubmitting ? <CircularProgress size={24} /> : "Сохранить"}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};
