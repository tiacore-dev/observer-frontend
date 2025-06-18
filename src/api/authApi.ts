// src/api/authApi.ts
import { axiosInstance } from "../axiosConfig";

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  permissions: Record<string, string[]> | null;
  is_superadmin: boolean;
  user_id: string;
}

export const loginUser = async (data: {
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  localStorage.clear();
  const url = process.env.REACT_APP_API_URL;
  if (!url) throw new Error("REACT_APP_API_URL is not defined");

  const response = await axiosInstance.post<AuthResponse>(
    `${url}/auth/login`,
    data
  );
  return response.data;
};

export const refreshToken = async (): Promise<string | null> => {
  const r_token = localStorage.getItem("refresh_token");
  if (!r_token) {
    return null;
  }

  try {
    const url = process.env.REACT_APP_API_URL;
    if (!url) throw new Error("REACT_APP_API_URL is not defined");

    const response = await axiosInstance.post<{
      access_token: string;
      refresh_token: string;
    }>(`${url}/auth/refresh`, { refresh_token: r_token });

    localStorage.setItem("access_token", response.data.access_token);
    localStorage.setItem("refresh_token", response.data.refresh_token);

    return response.data.access_token;
  } catch (error) {
    console.error("Refresh token error:", error);
    // Очищаем хранилище при неудачном обновлении токена
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("is_superadmin");
    localStorage.removeItem("user_id");
    return null;
  }
};
