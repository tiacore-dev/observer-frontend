import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import { useResetPasswordRequestMutation } from "../../hooks/register/useRegisterMutations";

interface ResetPasswordModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [email, setEmail] = useState("");
  const resetPasswordMutation = useResetPasswordRequestMutation();

  const handleSubmit = () => {
    resetPasswordMutation.mutate(email, {
      onSuccess: () => {
        onSuccess();
        onClose();
      },
      onError: (error: any) => {},
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Восстановление пароля</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1" gutterBottom>
            Введите email, указанный при регистрации. Мы отправим вам ссылку для
            восстановления пароля.
          </Typography>
          <TextField
            autoComplete="off"
            label="Email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={resetPasswordMutation.isPending}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={resetPasswordMutation.isPending}>
          Отмена
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          disabled={resetPasswordMutation.isPending || !email}
        >
          {resetPasswordMutation.isPending ? (
            <CircularProgress size={24} />
          ) : (
            "Отправить"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
