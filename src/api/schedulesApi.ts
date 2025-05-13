// src/api/servicesApi.tsx
import { axiosInstance } from "../axiosConfig";
import { AxiosError } from "axios";

export interface Ischedule {
  schedule_id: string; //uuid4
  chat: number;
  prompt: string; //uuid4
  company: string; //uuid4
  schedule_type: string;
  interval_hours?: number; // Expand: all(integer: |: null)
  interval_minutes?: number; //Expand: all(integer: |: null)
  time_of_day?: string; //Expand: all(string: |: null)
  cron_expression?: string; // Expand: all(string: |: null)
  run_at?: string; //Expand: all(string: |: null)
  enabled: boolean;
  last_run_at?: string; //Expand: all(string: |: null)
  created_at: string; //date-time
  send_strategy: string;
  time_to_send?: string; // Expand: all(string: |: null)
  send_after_minutes?: number; //Expand: all(integer: |: null)
  bot: number;
  target_chats: number[]; //Expand allarray<integer>
}

// Функция для получения списка услуг с параметрами
export const fetchSchedules = async () => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const params: any = { page: 1, page_size: 100 };
  const response = await axiosInstance.get(`${url}/api/schedules/all`, {
    params,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// Функция для создания новой услуги
export const createService = async (newSchedule: {
  chat: number;
  prompt: string; //uuid4
  company: string; //uuid4
  schedule_type: string;
  interval_hours?: number; // Expand: all(integer: |: null)
  interval_minutes?: number; //Expand: all(integer: |: null)
  time_of_day?: string; //Expand: all(string: |: null)
  cron_expression?: string; // Expand: all(string: |: null)
  run_at?: string; //Expand: all(string: |: null)
  enabled: boolean;
  send_strategy: string;
  time_to_send?: string; // Expand: all(string: |: null)
  send_after_minutes?: number; //Expand: all(integer: |: null)
  bot: number;
  target_chats: number[]; //Expand allarray<integer>
}): Promise<Ischedule> => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const response = await axiosInstance.post(
    `${url}/api/schedules/add`,
    newSchedule,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const fetchScheduleDetails = async (schedule_id: string) => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const response = await axiosInstance.get(
    `${url}/api/schedules/${schedule_id}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const updateSchedule = async (schedule_id: string, updatedData: any) => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const response = await axiosInstance.patch(
    `${url}/api/schedules/${schedule_id}`,
    updatedData,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const toggleSchedule = async (schedule_id: string) => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const response = await axiosInstance.patch(
    `${url}/api/schedules/${schedule_id}/toggle`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const deleteSchedule = async (schedule_id: string) => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");

  await axiosInstance.delete(`${url}/api/schedules/${schedule_id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
};
