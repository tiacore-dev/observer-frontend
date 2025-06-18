import { axiosInstance } from "../axiosConfig";
import { IUser } from "./usersApi";

export const registrationUser = async (newUser: {
  email: string;
  password: string;
  full_name: string;
  position: string;
}): Promise<IUser> => {
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
  if (!url) throw new Error("REACT_APP_API_URL is not defined");

  await axiosInstance.post(`${url}/api/resend-verification`, { email });
};
