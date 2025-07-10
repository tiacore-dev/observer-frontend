import { axiosInstance } from "../axiosConfig";

export interface ISchedule {
  schedule_id: string;
  chat_id: number;
  prompt_id: string;
  company_id: string;
  message_intro?: string;
  schedule_type: "interval" | "cron" | "once" | "daily_time";
  interval_hours?: number;
  interval_minutes?: number;
  time_of_day?: string;
  cron_expression?: string;
  run_at?: string;
  enabled: boolean;
  last_run_at?: string;
  created_at: string;
  send_strategy: "fixed" | "relative";
  time_to_send?: string;
  send_after_minutes?: number;
  bot_id: number;
  target_chats: number[];
}

export interface IscheduleCreate {
  chat_id: number;
  prompt_id: string;
  schedule_type: "interval" | "cron" | "once" | "daily_time";
  company_id: string;
  target_chats: number[];
  message_intro?: string;
  bot_id: number;
  send_strategy: "fixed" | "relative";
  interval_hours?: number;
  interval_minutes?: number;
  time_of_day?: string;
  cron_expression?: string;
  run_at?: string;
  enabled?: boolean;
  time_to_send?: string;
  send_after_minutes?: number;
}

export interface IScheduleEdit {
  chat_id: number;
  prompt_id: string;
  schedule_type: "interval" | "cron" | "once" | "daily_time";
  target_chats: number[];
  removed_chats: number[];
  bot_id: number;
  message_intro?: string;
  send_strategy: "fixed" | "relative";
  interval_hours?: number;
  interval_minutes?: number;
  time_of_day?: string;
  cron_expression?: string;
  run_at?: string;
  enabled?: boolean;
  time_to_send?: string;
  send_after_minutes?: number;
  company_id: string;
}

export const fetchSchedules = async (
  selectedCompanyId?: string | null,
  isSuperadmin?: boolean
) => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
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

export const createSchedule = async (
  newSchedule: IscheduleCreate,
  isSuperadmin?: boolean,
  selectedCompanyId?: string | null
): Promise<ISchedule> => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const params: any = {};

  if (!isSuperadmin && selectedCompanyId) {
    params.company_id = selectedCompanyId;
  }

  const response = await axiosInstance.post(
    `${url}/api/schedules/add`,
    newSchedule,
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

export const fetchScheduleDetails = async (
  schedule_id: string,
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

export const updateSchedule = async (
  schedule_id: string,
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
    `${url}/api/schedules/${schedule_id}`,
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

export const toggleSchedule = async (
  schedule_id: string,
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
    `${url}/api/schedules/${schedule_id}/toggle`,
    {},
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

export const deleteSchedule = async (
  schedule_id: string,
  isSuperadmin?: boolean,
  selectedCompanyId?: string | null
) => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const params: any = {};

  if (!isSuperadmin && selectedCompanyId) {
    params.company_id = selectedCompanyId;
  }

  await axiosInstance.delete(`${url}/api/schedules/${schedule_id}`, {
    params,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
};
