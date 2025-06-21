// userFormModal.tsx
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
  Skeleton,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { IUserEdit } from "../../hooks/users/useUserMutations";

interface EditUserModalProps {
  open: boolean;
  onClose: () => void;
  userData?: {
    email: string;
    full_name: string;
    position?: string;
    is_verified: boolean;
  };
  onSubmit: (data: Partial<IUserEdit>) => void;
  isSubmitting: boolean;
  isLoading?: boolean;
}

export const EditUserModal: React.FC<EditUserModalProps> = ({
  open,
  onClose,
  userData,
  onSubmit,
  isSubmitting,
  isLoading = false,
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
      email: "",
      full_name: "",
      position: "",
      is_verified: false,
      newPassword: "",
      confirmPassword: "",
    },
  });

  React.useEffect(() => {
    if (userData) {
      reset({
        email: userData.email,
        full_name: userData.full_name,
        position: userData.position || "",
        is_verified: userData.is_verified,
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [userData, reset]);

  const handleFormSubmit = (data: any) => {
    if (!userData) return;

    const updatedData: Partial<IUserEdit> = {};
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
      <DialogTitle>
        {isLoading ? (
          <Skeleton variant="text" width={200} height={40} />
        ) : (
          "Редактировать профиль"
        )}
      </DialogTitle>
      <DialogContent>
        <Box
          component="form"
          onSubmit={handleSubmit(handleFormSubmit)}
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
        >
          {isLoading ? (
            <>
              <Skeleton variant="rectangular" width="100%" height={56} />
              <Skeleton variant="rectangular" width="100%" height={56} />
              <Skeleton variant="rectangular" width="100%" height={56} />
              <Skeleton variant="rectangular" width="100%" height={56} />
              <Skeleton variant="rectangular" width="100%" height={56} />
              <Skeleton variant="rectangular" width={120} height={40} />
            </>
          ) : (
            <>
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

              <TextField
                fullWidth
                label="Должность"
                {...register("position")}
              />

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
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        {isLoading ? (
          <>
            <Skeleton variant="rectangular" width={80} height={36} />
            <Skeleton variant="rectangular" width={100} height={36} />
          </>
        ) : (
          <>
            <Button onClick={onClose}>Отмена</Button>
            <Button
              onClick={handleSubmit(handleFormSubmit)}
              variant="contained"
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting ? <CircularProgress size={24} /> : "Сохранить"}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};
