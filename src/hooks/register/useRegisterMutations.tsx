// src/hooks/auth/useRegisterMutations.ts
import { useMutation } from "@tanstack/react-query";
import {
  registrationUser,
  verifyEmail,
  resendVerification,
} from "../../api/registrationApi";
import { enqueueSnackbar } from "notistack";
import {
  resetPassword,
  resetPasswordRequest,
  userAgreement,
} from "../../api/authApi";
import { useNavigate } from "react-router-dom";

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: registrationUser,
    onSuccess: (response) => {
      if (response?.user_id) {
        userAgreement(response.user_id);
      }
    },
    onError: (error: any) => {
      if (error.response?.status === 400) {
        enqueueSnackbar("Пользователь с таким email уже зарегистрирован", {
          variant: "error",
        });
      } else {
        enqueueSnackbar("Ошибка при регистрации", { variant: "error" });
      }
    },
  });
};

// Остальной код остается без изменений
export const useVerifyEmailMutation = () => {
  return useMutation({
    mutationFn: verifyEmail,
    onSuccess: () => {
      enqueueSnackbar(
        "Email успешно подтверждён! Теперь вы можете войти в систему.",
        { variant: "success" }
      );
    },
    onError: (error: any) => {
      enqueueSnackbar("Ошибка при подтверждении email", { variant: "error" });
    },
  });
};

export const useResendVerificationMutation = () => {
  return useMutation({
    mutationFn: resendVerification,
    onSuccess: () => {
      enqueueSnackbar("Письмо подтверждения отправлено повторно", {
        variant: "success",
      });
    },
    onError: () => {
      enqueueSnackbar("Ошибка при отправке письма подтверждения", {
        variant: "error",
      });
    },
  });
};

type ApiError = {
  response?: {
    status: number;
    data: {
      message: string;
    };
  };
};

type ResetPasswordData = {
  password: string;
  token: string;
};

export const useResetPasswordRequestMutation = () => {
  return useMutation({
    mutationFn: (email: string) => resetPasswordRequest(email),
    onSuccess: () => {
      enqueueSnackbar(
        "Письмо с инструкциями по восстановлению пароля отправлено на ваш email",
        { variant: "success" }
      );
    },
    onError: (error: ApiError) => {
      const errorMessage =
        error.response?.data.message || "Ошибка при запросе сброса пароля";
      enqueueSnackbar(errorMessage, { variant: "error" });
    },
  });
};

export const useResetPasswordMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: ResetPasswordData) =>
      resetPassword(data.password, data.token),
    onSuccess: () => {
      enqueueSnackbar(
        "Пароль успешно изменён. Теперь вы можете войти с новым паролем.",
        { variant: "success" }
      );
      navigate("/login");
    },
    onError: (error: ApiError) => {
      const errorMessage =
        error.response?.data.message || "Ошибка при изменении пароля";
      enqueueSnackbar(errorMessage, { variant: "error" });
    },
  });
};
