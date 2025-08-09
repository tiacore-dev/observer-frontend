// src/components/UserRegistrationModal.tsx
import React, { useState } from "react";
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
  InputAdornment,
  IconButton,
  Checkbox,
  FormControlLabel,
  Link,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useRegisterMutation } from "../../hooks/register/useRegisterMutations";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface UserRegistrationModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type FormData = {
  email: string;
  password: string;
  confirmPassword: string;
  full_name: string;
  position: string;
  termsAccepted: boolean;
  privacyAccepted: boolean;
};

export const UserRegistrationModal: React.FC<UserRegistrationModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<FormData>({
    mode: "onChange",
    defaultValues: {
      termsAccepted: false,
      privacyAccepted: false,
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const registerMutation = useRegisterMutation();

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);

  const onSubmit = (data: FormData) => {
    const { confirmPassword, termsAccepted, privacyAccepted, ...userData } =
      data;
    registerMutation.mutate(userData, {
      onSuccess: () => {
        onSuccess();
        onClose();
      },
    });
  };

  const password = watch("password");
  const termsAccepted = watch("termsAccepted");
  const privacyAccepted = watch("privacyAccepted");

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Регистрация</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
          autoComplete="off"
        >
          <Controller
            name="email"
            control={control}
            rules={{
              required: "Email обязателен",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Введите корректный email",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Email"
                error={!!errors.email}
                helperText={errors.email?.message}
                autoComplete="new-email"
                inputProps={{
                  autocomplete: "new-email",
                  autocorrect: "off",
                  autocapitalize: "none",
                  spellcheck: "false",
                }}
              />
            )}
          />
          <Controller
            name="full_name"
            control={control}
            rules={{ required: "Полное имя обязательно" }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Полное имя"
                error={!!errors.full_name}
                helperText={errors.full_name?.message}
                autoComplete="off"
                inputProps={{
                  autocomplete: "off",
                  autocorrect: "off",
                  autocapitalize: "words",
                  spellcheck: "false",
                }}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            rules={{
              required: "Пароль обязателен",
              minLength: {
                value: 6,
                message: "Пароль должен содержать минимум 6 символов",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                type={showPassword ? "text" : "password"}
                label="Пароль"
                error={!!errors.password}
                helperText={errors.password?.message}
                autoComplete="new-password"
                inputProps={{
                  autocomplete: "new-password",
                  autocorrect: "off",
                  autocapitalize: "none",
                  spellcheck: "false",
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />

          <Controller
            name="confirmPassword"
            control={control}
            rules={{
              required: "Подтвердите пароль",
              validate: (value) => value === password || "Пароли не совпадают",
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                type={showConfirmPassword ? "text" : "password"}
                label="Подтвердите пароль"
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                autoComplete="new-password"
                inputProps={{
                  autocomplete: "new-password",
                  autocorrect: "off",
                  autocapitalize: "none",
                  spellcheck: "false",
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={handleClickShowConfirmPassword}
                        edge="end"
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />

          <Controller
            name="termsAccepted"
            control={control}
            rules={{ required: "Необходимо принять условия" }}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Checkbox {...field} checked={field.value} color="primary" />
                }
                label={
                  <Typography>
                    Я принимаю условия{" "}
                    <Link href="/terms" target="_blank" rel="noopener">
                      Пользовательского соглашения
                    </Link>
                  </Typography>
                }
              />
            )}
          />

          <Controller
            name="privacyAccepted"
            control={control}
            rules={{ required: "Необходимо принять условия" }}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Checkbox {...field} checked={field.value} color="primary" />
                }
                label={
                  <Typography>
                    Я принимаю условия{" "}
                    <Link href="/privacy" target="_blank" rel="noopener">
                      Политики конфиденциальности
                    </Link>
                  </Typography>
                }
              />
            )}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          disabled={
            registerMutation.isPending || !termsAccepted || !privacyAccepted
          }
        >
          {registerMutation.isPending ? (
            <CircularProgress size={24} />
          ) : (
            "Зарегистрироваться"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
