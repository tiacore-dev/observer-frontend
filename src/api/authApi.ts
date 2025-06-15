import { axiosInstance } from "../axiosConfig";
// {
//   "access_token": "string",
//   "refresh_token": "string",
//   "permissions": {
//     "additionalProp1": {
//       "additionalProp1": [
//         {}
//       ],
//       "additionalProp2": [
//         {}
//       ],
//     },
//     "additionalProp2": {
//       "additionalProp1": [
//         {}
//       ],
//       "additionalProp2": [
//         {}
//       ],

//   },
//   "is_superadmin": true,
//   "user_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
// }
export const loginUser = async (data: { email: string; password: string }) => {
  const url = process.env.REACT_APP_API_URL;
  if (!url) throw new Error("REACT_APP_API_URL is not defined");

  console.log("Sending login request to:", `${url}/auth/login`); // Логирование
  const response = await axiosInstance.post(`${url}/auth/login`, data);
  console.log("Login response:", response.data); // Логирование
  localStorage.setItem("access_token", response.data.access_token);
  localStorage.setItem("refresh_token", response.data.refresh_token);
  localStorage.setItem("is_superadmin", response.data.is_superadmin);
  localStorage.setItem("user_id", response.data.user_id);

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
