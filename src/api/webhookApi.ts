import { axiosInstance } from "../axiosConfig";

export interface IWebhook {
  url: string | "";
  has_custom_certificate: boolean;
  pending_update_count: number;
  max_connections: number;
  ip_address: string;
  allowed_updates: string[];
}

export const fetchWebhook = async (
  bot_id: string,
  selectedCompanyId?: string | null,
  isSuperadmin?: boolean
) => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const params: any = {};
  if (!isSuperadmin && selectedCompanyId) {
    params.company_id = selectedCompanyId;
  }
  const response = await axiosInstance.get(
    `${url}/api/webhook/${bot_id}/info`,
    {
      params,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const setWebhook = async (
  bot_id: string,
  selectedCompanyId?: string | null,
  isSuperadmin?: boolean
) => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const params: any = {};
  if (!isSuperadmin && selectedCompanyId) {
    params.company_id = selectedCompanyId;
  }

  const response = await axiosInstance.patch(
    `${url}/api/webhook/${bot_id}/set`,
    null, // тело запроса пустое, так как мы передаем параметры в URL
    {
      params, // параметры теперь передаются правильно
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const deleteWebhook = async (
  bot_id: string,
  selectedCompanyId?: string | null,
  isSuperadmin?: boolean
) => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const params: any = {};
  if (!isSuperadmin && selectedCompanyId) {
    params.company_id = selectedCompanyId;
  }
  const response = await axiosInstance.delete(
    `${url}/api/webhook/${bot_id}/delete`,
    {
      params,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};
