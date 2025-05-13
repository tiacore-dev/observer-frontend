// src/api/servicesApi.tsx
import { axiosInstance } from "../axiosConfig";
import { AxiosError } from "axios";

export interface IBot {
  bot_id: number;
  bot_token: string;
  bot_username: string;
  bot_first_name: string;
  company: string; //uuid4
  is_active: boolean;
  created_at: string; //date-time
  comment?: string;
}
// Функция для получения списка услуг с параметрами
export const fetchBots = async () => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  // const selectedCompanyId = localStorage.getItem("selectedCompanyId");

  const params: any = { page: 1, page_size: 100 };

  const response = await axiosInstance.get(`${url}/api/bots/all`, {
    params,

    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// Функция для создания новой услуги
export const createBot = async (newBot: {
  token: string;
  company: string;
  comment?: string;
}): Promise<IBot> => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");

  const response = await axiosInstance.post(`${url}/api/bots/add`, newBot, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const fetchBotDetails = async (bot_id: string) => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const response = await axiosInstance.get(`${url}/api/bots/${bot_id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const deleteBot = async (bot_id: string) => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");

  await axiosInstance.delete(`${url}/api/bots/${bot_id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
};
