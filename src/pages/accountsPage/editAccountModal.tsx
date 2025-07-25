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
  Alert,
  Typography,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import {
  AccountCircle as AccountIcon,
  Edit as EditIcon,
  Info as InfoIcon,
} from "@mui/icons-material";

interface EditAccountModalProps {
  open: boolean;
  onClose: () => void;
  accountName: string;
  onSave: (newName: string) => void;
  isLoading?: boolean;
}

export const EditAccountModal: React.FC<EditAccountModalProps> = ({
  open,
  onClose,
  accountName,
  onSave,
  isLoading = false,
}) => {
  const [newName, setNewName] = React.useState(accountName);

  React.useEffect(() => {
    setNewName(accountName);
  }, [accountName]);

  const handleSave = () => {
    if (newName.trim()) {
      onSave(newName);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <EditIcon color="primary" />
          Редактировать отображаемое имя пользователя
        </Box>
      </DialogTitle>

      <DialogContent>
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            Это имя используется только на этом сайте и не изменяет данные в
            Telegram.
          </Typography>
        </Alert>

        <TextField
          fullWidth
          label="Имя аккаунта"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          margin="normal"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccountIcon color="action" />
              </InputAdornment>
            ),
          }}
          helperText="Используйте удобное для вас имя для отображения в системе"
        />

        <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 1 }}>
          <InfoIcon color="info" fontSize="small" />
          <Typography variant="body2" color="text.secondary">
            Например: "Менеджер поддержки", "Аккаунт для тестов" и т.д.
          </Typography>
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
        <Button onClick={onClose} disabled={isLoading}>
          Отмена
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={isLoading || !newName.trim()}
          startIcon={isLoading ? <CircularProgress size={16} /> : <EditIcon />}
        >
          {isLoading ? "Сохранение..." : "Сохранить"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
