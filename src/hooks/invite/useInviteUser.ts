// src/hooks/useInviteUser.ts
import { useMutation } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import {
  acceptInvite,
  inviteUser,
  registerWithToken,
} from "../../api/registrationApi";
import { useNavigate } from "react-router-dom";

export const useInviteUser = () => {
  return useMutation({
    mutationFn: inviteUser,
    onSuccess: () => {
      enqueueSnackbar("Приглашение отправлено", { variant: "success" });
    },
    onError: () => {
      enqueueSnackbar("Ошибка при отправке приглашения", { variant: "error" });
    },
  });
};

export const useAcceptInviteMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (token: string) => acceptInvite(token),
    onSuccess: () => {
      //   enqueueSnackbar("Приглашение успешно принято!", { variant: "success" });
    },
    onError: (error: any) => {
      enqueueSnackbar(
        error.response?.data?.message || "Ошибка при принятии приглашения",
        { variant: "error" }
      );
      navigate("/login");
    },
  });
};

type RegisterData = {
  token: string;
  email: string;
  password: string;
  full_name: string;
  position: string;
};

export const useRegisterWithToken = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: RegisterData) => registerWithToken(data),
    onSuccess: () => {
      enqueueSnackbar("Регистрация завершена успешно!", { variant: "success" });
      navigate("/");
    },
    onError: (error: any) => {
      if (error.response?.status === 401) {
        enqueueSnackbar(
          "Ссылка приглашения недействительна. Пожалуйста, запросите новое приглашение",
          {
            variant: "error",
            autoHideDuration: 10000, // Показывать 10 секунд
          }
        );
      } else {
        enqueueSnackbar(error || "Ошибка при регистрации", {
          variant: "error",
        });
      }
    },
  });
};
