import { axiosInstance } from "../axiosConfig";
import { AxiosError } from "axios";

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

export const fetchAnalysis = async () => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");

  const params: any = { page: 1, page_size: 100 };

  const response = await axiosInstance.get(`${url}/api/analysis/all`, {
    params,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const createAnalysis = async (newAnalysis: {
  prompt_id: string;
  chat_id: number;
  date_from: number;
  date_to: number;
  company_id: string;
}): Promise<IAnalys> => {
  try {
    const url = process.env.REACT_APP_API_URL;
    const accessToken = localStorage.getItem("access_token");

    const response = await axiosInstance.post(
      `${url}/api/analysis/create`,
      newAnalysis,
      {
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

export const fetchAnalysDetails = async (analysis_id: string) => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const response = await axiosInstance.get(
    `${url}/api/analysis/${analysis_id}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};
