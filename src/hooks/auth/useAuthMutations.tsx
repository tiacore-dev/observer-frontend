import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../api/authApi";
import { enqueueSnackbar } from "notistack";

type FormData = {
  email: string;
  password: string;
};

type AuthResponse = {
  access_token: string;
  refresh_token: string;
  permissions: Record<string, string[]>;
  is_superadmin: boolean;
  user_id: string;
};

type ApiError = {
  response?: {
    status: number;
    data: {
      message: string;
    };
  };
  message?: string;
};

export const useLoginMutation = () => {
  const navigate = useNavigate();

  return useMutation<AuthResponse, ApiError, FormData>({
    mutationFn: loginUser,
    onSuccess: (data) => {
      // localStorage.setItem("access_token", data.access_token);
      // localStorage.setItem("refresh_token", data.refresh_token);
      navigate("/home"); // Используем navigate вместо window.location.href
    },
    onError: (error) => {
      console.error("Login error:", error); // Логирование
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Ошибка при авторизации";
      enqueueSnackbar(errorMessage, { variant: "error" });
    },
  });
};
