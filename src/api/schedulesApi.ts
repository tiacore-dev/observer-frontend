import { axiosInstance } from "../axiosConfig";

export interface ISchedule {
  schedule_id: string; // uuid4
  chat_id: number;
  prompt_id: string; // uuid4
  company_id: string; // uuid4
  schedule_type: "interval" | "cron" | "once" | "daily_time";
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
  chat_id: number; //это анализируемый чат, выбираем из списка
  prompt_id: string; // промт, выбираем из списка
  schedule_type: "interval" | "cron" | "once" | "daily_time"; // тип расписания
  company_id: string; // компания, выбираем из списка
  target_chats: number[]; //это чаты в которые надо разослать, выбираем из списка
  bot_id: number; //бот , выбираем из списка
  send_strategy: "fixed" | "relative"; // Время в которое анализ присылается
  interval_hours?: number; //schedule_type interval через интервал времени
  interval_minutes?: number; //schedule_type interval через интервал времени
  time_of_day?: string; //schedule_type daily_time ежедневно в одно и то же время
  cron_expression?: string; //schedule_type cron
  run_at?: string; //schedule_type once одноразовое
  enabled?: boolean; //
  time_to_send?: string; //send_strategy fixed конкретное время дня
  send_after_minutes?: number; // send_strategy relative это то, через сколько минут после создания нужно отправить
}

export interface IscheduleEdit {
  chat_id: number; //это анализируемый чат, выбираем из списка
  prompt_id: string; // промт, выбираем из списка
  schedule_type: "interval" | "cron" | "once" | "daily_time"; // тип расписания
  target_chats: number[]; //это чаты которые добавились в уже существующий список, выбираем из списка
  removed_chats: number[]; //это чаты которые убрали из уже существующего списка, выбираем из списка
  bot_id: number; //бот , выбираем из списка
  send_strategy: "fixed" | "relative"; // Время в которое анализ присылается
  interval_hours?: number; //schedule_type interval через интервал времени
  interval_minutes?: number; //schedule_type interval через интервал времени
  time_of_day?: string; //schedule_type daily_time ежедневно в одно и то же время
  cron_expression?: string; //schedule_type cron
  run_at?: string; //schedule_type once одноразовое
  enabled?: boolean; //
  time_to_send?: string; //send_strategy fixed конкретное время дня
  send_after_minutes?: number; // send_strategy relative это то, через сколько минут после создания нужно отправить
}

// Функция для получения списка услуг с параметрами
export const fetchSchedules = async (selectedCompanyId?: string | null) => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const isSuperadmin = localStorage.getItem("is_superadmin") === "true";
  const params: any = { page: 1, page_size: 100 };
  if (!isSuperadmin && selectedCompanyId) {
    params.company_id = selectedCompanyId;
  }
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

export const fetchScheduleDetails = async (
  schedule_id: string,
  selectedCompanyId?: string | null
) => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const isSuperadmin = localStorage.getItem("is_superadmin") === "true";
  const params: any = {};
  if (!isSuperadmin && selectedCompanyId) {
    params.company_id = selectedCompanyId;
  }
  const response = await axiosInstance.get(
    `${url}/api/schedules/${schedule_id}`,
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
