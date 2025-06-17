import { axiosInstance } from "../axiosConfig";
import { AxiosError } from "axios";

export interface ISchedule {
  schedule_id: string; // uuid4
  chat_id: number;
  prompt_id: string; // uuid4
  company_id: string; // uuid4
  schedule_type: "interval" | "cron" | "once";
  interval_hours?: number;
  interval_minutes?: number;
  time_of_day?: string;
  cron_expression?: string;
  run_at?: string;
  enabled: boolean;
  last_run_at?: string;
  created_at: string; // date-time
  send_strategy: "fixed" | "relative";
  time_to_send?: string;
  send_after_minutes?: number;
  bot_id: number;
  target_chats: number[];
}

export interface IscheduleCreate {
  chat_id: number; //куда отправлять результат вводить ручками
  prompt_id: string; // промт из списка
  schedule_type: "interval" | "cron" | "once";
  company_id: string; // компания под которой пользователь
  target_chats: number[]; //чаты из chat get all куда отправить чезультат из списка
  bot_id: number; //бот из списка
  send_strategy: "fixed" | "relative"; // ???
  interval_hours?: number; //interval
  interval_minutes?: number; //interval
  time_of_day?: string; //
  cron_expression?: string; //cron
  run_at?: string; //
  enabled?: boolean; //
  time_to_send?: string; //
  send_after_minutes?: number; //
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
export const createSchedule = async (
  newSchedule: IscheduleCreate
): Promise<ISchedule> => {
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
