import { axiosInstance } from "../axiosConfig";

export interface IBot {
  bot_id: string;
  bot_token: string;
  bot_username: string;
  bot_first_name: string;
  company_id: string; //uuid4
  is_active: boolean;
  created_at: string; //date-time
  comment?: string;
}

export const fetchBots = async (selectedCompanyId?: string | null) => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const params: any = { page: 1, page_size: 100 };

  if (selectedCompanyId) {
    params.company_id = selectedCompanyId;
  }

  const response = await axiosInstance.get(`${url}/api/bots/all`, {
    params,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const createBot = async (
  newBot: {
    token: string;
    company_id: string;
    comment?: string;
  },
  isSuperadmin?: boolean,
  selectedCompanyId?: string | null
): Promise<IBot> => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const params: any = {};

  if (!isSuperadmin && selectedCompanyId) {
    params.company_id = selectedCompanyId;
  }

  const response = await axiosInstance.post(`${url}/api/bots/add`, newBot, {
    params,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const fetchBotDetails = async (
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

  const response = await axiosInstance.get(`${url}/api/bots/${bot_id}`, {
    params,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const deleteBot = async (
  bot_id: string,
  isSuperadmin?: boolean,
  selectedCompanyId?: string | null
) => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const params: any = {};

  if (!isSuperadmin && selectedCompanyId) {
    params.company_id = selectedCompanyId;
  }

  await axiosInstance.delete(`${url}/api/bots/${bot_id}`, {
    params,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
};
