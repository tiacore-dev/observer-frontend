import { axiosInstance } from "../axiosConfig";

export interface IAnalys {
  analysis_id: string;
  prompt_id: string;
  chat_id: number;
  company_id: string;
  created_at: string;
  tokens_input: number;
  tokens_output: number;
  result_text?: string;
  schedule_id?: string;
  date_to?: number;
  date_from?: number;
  send_time?: number;
}

export const fetchAnalysis = async (
  selectedCompanyId?: string | null,
  isSuperadmin?: boolean,
  params?: {
    page?: number;
    page_size?: number;
    prompt_id?: string;
    chat_id?: number;
    sort_by?: keyof IAnalys;
    order?: "asc" | "desc";
    date_from?: Date | null;
    date_to?: Date | null;
    company_id?: string;
  }
) => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");

  const requestParams: any = {
    page: params?.page || 1,
    page_size: params?.page_size || 10,
  };

  if (params?.prompt_id) requestParams.prompt_id = params.prompt_id;
  if (params?.chat_id) requestParams.chat_id = params.chat_id;
  if (params?.sort_by) requestParams.sort_by = params.sort_by;
  if (params?.order) requestParams.order = params.order;
  if (params?.date_from) requestParams.date_from = params.date_from;
  if (params?.date_to) requestParams.date_to = params.date_to;

  if (!isSuperadmin && selectedCompanyId) {
    requestParams.company_id = selectedCompanyId;
  } else if (params?.company_id) {
    requestParams.company_id = params.company_id;
  }

  const response = await axiosInstance.get(`${url}/api/analysis/all`, {
    params: requestParams,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// Остальные функции остаются без изменений
export const createAnalysis = async (
  newAnalysis: {
    prompt_id: string;
    chat_id: number;
    date_from: number;
    date_to: number;
    company_id: string;
  },
  isSuperadmin?: boolean,
  selectedCompanyId?: string | null
): Promise<IAnalys> => {
  try {
    const url = process.env.REACT_APP_API_URL;
    const accessToken = localStorage.getItem("access_token");
    const params: any = {};
    if (!isSuperadmin && selectedCompanyId) {
      params.company_id = selectedCompanyId;
    }
    const response = await axiosInstance.post(
      `${url}/api/analysis/create`,
      newAnalysis,
      {
        params,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Не удалось создать анализ");
  }
};

export const fetchAnalysDetails = async (
  analysis_id: string,
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
    `${url}/api/analysis/${analysis_id}`,
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
