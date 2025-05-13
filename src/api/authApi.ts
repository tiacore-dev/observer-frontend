import { axiosInstance } from "../axiosConfig";

export const loginUser = async (data: {
  username: string;
  password: string;
}) => {
  const url = process.env.REACT_APP_API_URL;
  if (!url) throw new Error("REACT_APP_API_URL is not defined");

  console.log("Sending login request to:", `${url}/auth/token`); // Логирование
  const response = await axiosInstance.post(`${url}/auth/token`, data);
  console.log("Login response:", response); // Логирование
  return response.data;
};

export const refreshToken = async (): Promise<string | null> => {
  const r_token = localStorage.getItem("refresh_token");
  if (!r_token) {
    console.log("No refresh token found");
    return null;
  }

  try {
    const url = process.env.REACT_APP_API_URL;
    if (!url) throw new Error("REACT_APP_API_URL is not defined");

    console.log("Sending refresh token request"); // Логирование
    const response = await axiosInstance.post<{
      access_token: string;
      refresh_token: string;
    }>(`${url}/auth/refresh`, { refresh_token: r_token });

    localStorage.setItem("access_token", response.data.access_token);
    localStorage.setItem("refresh_token", response.data.refresh_token);

    return response.data.access_token;
  } catch (error) {
    console.error("Refresh token error:", error); // Логирование
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    return null;
  }
};
