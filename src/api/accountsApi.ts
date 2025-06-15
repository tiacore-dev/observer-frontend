import { axiosInstance } from "../axiosConfig";
import { AxiosError } from "axios";

export interface IAccount {
  account_id: number;
  account_name: string;
  email: string;
  created_at: string | Date;
}
// Функция для получения списка услуг с параметрами
export const fetchAccounts = async () => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  // const selectedCompanyId = localStorage.getItem("selectedCompanyId");

  const params: any = { page: 1, page_size: 100 };

  const response = await axiosInstance.get(`${url}/api/accounts/all`, {
    params,

    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
