// editUserModal.tsx
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
  Typography,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { IUserEdit } from "../../hooks/users/useUserMutations";

interface EditUserModalProps {
  open: boolean;
  onClose: () => void;
  userData: {
    email: string;
    full_name: string;
    position?: string;
    is_verified: boolean;
  };
  onSubmit: (data: Partial<IUserEdit>) => void;
  isSubmitting: boolean;
}

export const EditUserModal: React.FC<EditUserModalProps> = ({
  open,
  onClose,
  userData,
  onSubmit,
  isSubmitting,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    control,
    setValue,
  } = useForm({
    defaultValues: {
      email: userData.email,
      full_name: userData.full_name,
      position: userData.position || "",
      is_verified: userData.is_verified,
      newPassword: "",
      confirmPassword: "",
    },
  });

  React.useEffect(() => {
    reset({
      email: userData.email,
      full_name: userData.full_name,
      position: userData.position || "",
      is_verified: userData.is_verified,
      newPassword: "",
      confirmPassword: "",
    });
  }, [userData, reset]);

  const handleFormSubmit = (data: any) => {
    const updatedData: Partial<IUserEdit> = {};

    // Only include changed fields
    if (data.email !== userData.email) updatedData.email = data.email;
    if (data.full_name !== userData.full_name)
      updatedData.full_name = data.full_name;
    if (data.position !== userData.position)
      updatedData.position = data.position;
    if (data.is_verified !== userData.is_verified)
      updatedData.is_verified = data.is_verified;
    if (data.newPassword) updatedData.password = data.newPassword;

    onSubmit(updatedData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Редактировать профиль</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          onSubmit={handleSubmit(handleFormSubmit)}
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
        >
          <TextField
            fullWidth
            label="Email"
            error={!!errors.email}
            helperText={errors.email?.message}
            {...register("email", {
              required: "Email обязателен",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$|^admin$/,
                message: "Введите корректный email",
              },
            })}
          />

          <TextField
            fullWidth
            label="Полное имя"
            error={!!errors.full_name}
            helperText={errors.full_name?.message}
            {...register("full_name", {
              required: "Полное имя обязательно",
            })}
          />

          <TextField fullWidth label="Должность" {...register("position")} />

          <TextField
            fullWidth
            type="password"
            label="Новый пароль"
            {...register("newPassword", {
              minLength: {
                value: 6,
                message: "Пароль должен быть не менее 6 символов",
              },
            })}
            error={!!errors.newPassword}
            helperText={errors.newPassword?.message}
          />

          <TextField
            fullWidth
            type="password"
            label="Подтвердите пароль"
            {...register("confirmPassword", {
              validate: (value) =>
                value === watch("newPassword") || "Пароли не совпадают",
            })}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
          />
          <FormControlLabel
            control={
              <Switch
                checked={watch("is_verified")}
                onChange={(e) => setValue("is_verified", e.target.checked)}
              />
            }
            label="Статус верификации"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button
          onClick={handleSubmit(handleFormSubmit)}
          variant="contained"
          disabled={isSubmitting}
        >
          {isSubmitting ? <CircularProgress size={24} /> : "Сохранить"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
