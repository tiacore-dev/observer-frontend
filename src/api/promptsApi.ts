import { axiosInstance } from "../axiosConfig";

export interface IPrompt {
  prompt_id: string;
  prompt_name: string;
  text: string;
  created_at: string;
  company_id: string;
}

export const fetchPrompts = async (selectedCompanyId?: string | null) => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const params: any = { page: 1, page_size: 100 };

  if (selectedCompanyId) {
    params.company_id = selectedCompanyId;
  }

  const response = await axiosInstance.get(`${url}/api/prompts/all`, {
    params,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const createPrompt = async (
  newPrompt: {
    prompt_name: string;
    text: string;
    company_id: string;
  },
  isSuperadmin?: boolean,
  selectedCompanyId?: string | null
): Promise<IPrompt> => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const params: any = {};

  if (!isSuperadmin && selectedCompanyId) {
    params.company_id = selectedCompanyId;
  }

  const response = await axiosInstance.post(
    `${url}/api/prompts/add`,
    newPrompt,
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

export const fetchPromptDetails = async (
  prompt_id: string,
  selectedCompanyId?: string | null,
  isSuperadmin?: boolean
) => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const params: any = {};

  if (!isSuperadmin && selectedCompanyId) {
    params.company_id = selectedCompanyId;
  }

  const response = await axiosInstance.get(`${url}/api/prompts/${prompt_id}`, {
    params,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const updatePrompt = async (
  prompt_id: string,
  updatedData: any,
  isSuperadmin?: boolean,
  selectedCompanyId?: string | null
) => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const params: any = {};

  if (!isSuperadmin && selectedCompanyId) {
    params.company_id = selectedCompanyId;
  }

  const response = await axiosInstance.patch(
    `${url}/api/prompts/${prompt_id}`,
    updatedData,
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

export const deletePrompt = async (
  prompt_id: string,
  isSuperadmin?: boolean,
  selectedCompanyId?: string | null
) => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const params: any = {};

  if (!isSuperadmin && selectedCompanyId) {
    params.company_id = selectedCompanyId;
  }

  await axiosInstance.delete(`${url}/api/prompts/${prompt_id}`, {
    params,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
};
