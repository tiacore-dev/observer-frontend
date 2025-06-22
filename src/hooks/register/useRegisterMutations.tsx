// src/hooks/auth/useRegisterMutations.ts
import { useMutation } from "@tanstack/react-query";
import {
  registrationUser,
  verifyEmail,
  resendVerification,
} from "../../api/registrationApi";
import { enqueueSnackbar } from "notistack";

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: registrationUser,
    onSuccess: () => {
      // enqueueSnackbar(
      //   "Регистрация успешна! Пожалуйста, проверьте вашу почту для подтверждения email.",
      //   { variant: "success" }
      // );
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
