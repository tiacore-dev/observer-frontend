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
  useMediaQuery,
  useTheme,
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [newName, setNewName] = React.useState(accountName);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    setNewName(accountName);
  }, [accountName]);

  const handleSave = () => {
    if (!newName.trim()) {
      setError("Имя аккаунта обязательно");
      return;
    }
    setError("");
    onSave(newName);
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
            Редактировать имя пользователя
          </Typography>
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
          onChange={(e) => {
            setNewName(e.target.value);
            if (error) setError("");
          }}
          margin="normal"
          error={!!error}
          helperText={
            error || "Используйте удобное для вас имя для отображения в системе"
          }
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccountIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />
      </DialogContent>

      <DialogActions
        sx={{
          padding: isMobile ? 2 : 3,
          paddingTop: 0,
          justifyContent: "space-between",
        }}
      >
        <Button
          onClick={onClose}
          disabled={isLoading}
          size={isMobile ? "medium" : "small"}
        >
          Отмена
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={isLoading || !newName.trim()}
          startIcon={isLoading ? <CircularProgress size={16} /> : <EditIcon />}
          size={isMobile ? "medium" : "small"}
        >
          {isLoading ? "Сохранение..." : "Сохранить"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
