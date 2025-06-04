import { axiosInstance } from "../axiosConfig";
import { AxiosError } from "axios";

export interface IChat {
  chat_id: number;
  chat_name: string;
  created_at: string | Date;
}
// Функция для получения списка услуг с параметрами
export const fetchChats = async () => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  // const selectedCompanyId = localStorage.getItem("selectedCompanyId");

  const params: any = { page: 1, page_size: 100 };

  const response = await axiosInstance.get(`${url}/api/chats/all`, {
    params,

    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
