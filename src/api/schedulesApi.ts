import { axiosInstance } from "../axiosConfig";

export interface ISchedule {
  schedule_name?: string;
  description?: string;
  schedule_id: string;
  schedule_strategy: "analysis" | "notification";
  notification_text?: string;
  chat_id?: number;
  prompt_id?: string;
  company_id: string;
  schedule_type: "interval" | "cron";
  message_intro?: string;
  interval_hours?: number;
  interval_minutes?: number;
  cron_expression?: string;
  enabled: boolean;
  last_run_at?: string;
  created_at: string;
  send_strategy?: "fixed" | "relative";
  time_to_send?: string;
  send_after_minutes?: number;
  bot_id: number;
  target_chats: number[];
  run_on_empty_chat?: boolean;
}

export interface IScheduleCreate {
  schedule_name?: string;
  description?: string;
  schedule_strategy: "analysis" | "notification";
  chat_id?: number;
  prompt_id?: string;
  schedule_type: "interval" | "cron";
  notification_text?: string;
  message_intro?: string;
  interval_hours?: number;
  interval_minutes?: number;
  cron_expression?: string;
  company_id: string;
  target_chats: number[];
  bot_id: number;
  enabled?: boolean;
  send_strategy?: "fixed" | "relative";
  time_to_send?: string;
  send_after_minutes?: number;
  run_on_empty_chat?: boolean;
}

export interface IScheduleEdit {
  schedule_name?: string;
  description?: string;
  schedule_strategy?: "analysis" | "notification";
  notification_text?: string;
  chat_id?: number;
  prompt_id?: string;
  schedule_type?: "interval" | "cron";
  message_intro?: string;
  interval_hours?: number;
  interval_minutes?: number;
  cron_expression?: string;
  target_chats?: number[];
  removed_chats?: number[];
  bot_id?: number;
  enabled?: boolean;
  send_strategy?: "fixed" | "relative";
  time_to_send?: string;
  send_after_minutes?: number;
  company_id?: string;
  run_on_empty_chat?: boolean;
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
  newSchedule: IScheduleCreate,
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
  updatedData: IScheduleEdit,
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
