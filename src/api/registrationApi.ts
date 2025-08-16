import { axiosInstance } from "../axiosConfig";
import { IUser } from "./usersApi";

export const registrationUser = async (newUser: {
  email: string;
  password: string;
  full_name: string;
  position: string;
}): Promise<{ user_id: string }> => {
  // Измененный тип возвращаемого значения
  const url = process.env.REACT_APP_API_URL;

  const payload = {
    ...newUser,
    application_id: process.env.REACT_APP_ID || "observer_app", // fallback значение
  };

  const response = await axiosInstance.post(`${url}/api/register`, payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const verifyEmail = async (token: string) => {
  const url = process.env.REACT_APP_API_URL;
  if (!url) throw new Error("REACT_APP_API_URL is not defined");

  const response = await axiosInstance.get(
    `${url}/api/verify-email?token=${token}`
  );
  return response.data;
};

export const resendVerification = async (email: string) => {
  const url = process.env.REACT_APP_API_URL;
  const application_id = process.env.REACT_APP_ID || "observer_app";
  if (!url) throw new Error("REACT_APP_API_URL is not defined");

  await axiosInstance.post(`${url}/api/resend-verification`, {
    email,
    application_id,
  });
};

export const inviteUser = async (data: {
  email: string;
  company_id: string;
  application_id?: string;
}) => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const app_id = process.env.REACT_APP_ID;
  data.application_id = app_id;
  if (!url) throw new Error("REACT_APP_API_URL is not defined");
  if (!accessToken) throw new Error("Access token is missing");

  const response = await axiosInstance.post(`${url}/api/invite`, data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const acceptInvite = async (token: string) => {
  const url = process.env.REACT_APP_API_URL;
  if (!url) throw new Error("REACT_APP_API_URL is not defined");

  const response = await axiosInstance.get(
    `${url}/api/accept-invite?token=${token}`
  );
  return response.data;
};

export const registerWithToken = async (data: {
  token: string;
  email: string;
  password: string;
  full_name: string;
  position: string;
}) => {
  const url = process.env.REACT_APP_API_URL;
  const app_id = process.env.REACT_APP_ID;
  const response = await axiosInstance.post(
    `${url}/api/register-with-token?token=${encodeURIComponent(data.token)}`,
    {
      email: data.email,
      password: data.password,
      full_name: data.full_name,
      position: data.position,
      application_id: app_id,
    }
  );
  return response.data;
};
