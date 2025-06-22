import { axiosInstance } from "../axiosConfig";

export interface IChat {
  chat_id: number;
  chat_name: string;
  created_at: string | Date;
}
// Функция для получения списка услуг с параметрами
export const fetchChats = async (
  bot_id?: number,
  selectedCompanyId?: string | null
) => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const isSuperadmin = localStorage.getItem("is_superadmin") === "true";

  const params: any = { page: 1, page_size: 100 };
  if (bot_id) {
    params.bot_id = bot_id;
  }
  if (selectedCompanyId) {
    params.company_id = selectedCompanyId;
  }
  const response = await axiosInstance.get(`${url}/api/chats/all`, {
    params,

    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
