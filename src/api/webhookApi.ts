import { axiosInstance } from "../axiosConfig";

export interface IWebhook {
  url: string | "";
  has_custom_certificate: boolean;
  pending_update_count: number;
  max_connections: number;
  ip_address: string;
  allowed_updates: string[];
}

export const fetchWebhook = async (bot_id: string) => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const response = await axiosInstance.get(
    `${url}/api/webhook/${bot_id}/info`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};
// /api/webhook/{bot_id}/set
export const setWebhook = async (bot_id: string) => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const response = await axiosInstance.patch(
    `${url}/api/webhook/${bot_id}/set`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};
// /api/webhook/{bot_id}/delete
export const deleteWebhook = async (bot_id: string) => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const response = await axiosInstance.delete(
    `${url}/api/webhook/${bot_id}/delete`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};
