import { axiosInstance } from "../axiosConfig";
import { AxiosError } from "axios";

export interface ICompany {
  company_id: string; //uuid4
  company_name: string;
  description?: string; //Collapse all(string | null)
}

// Функция для получения списка услуг с параметрами
export const fetchCompanies = async () => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const params: any = { page: 1, page_size: 100 };
  const response = await axiosInstance.get(`${url}/api/companies/all`, {
    params,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// Функция для создания новой услуги
export const createCompany = async (newCompany: {
  company_name: string;
  description?: string;
}): Promise<ICompany> => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const payload = {
    ...newCompany,
    application_id: process.env.REACT_APP_ID || "observer_app", // fallback значение
  };

  const response = await axiosInstance.post(
    `${url}/api/companies/add`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;

  //   const payload = {
  //     ...newUser,
  //     application_id: process.env.REACT_APP_ID || "observer_app", // fallback значение
  //   };

  //   const response = await axiosInstance.post(`${url}/api/register`, payload, {
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   });
  //   return response.data;
  // };
};

export const fetchCompanyDetails = async (company_id: string) => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const response = await axiosInstance.get(
    `${url}/api/companies/${company_id}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const updateCompany = async (company_id: string, updatedData: any) => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const response = await axiosInstance.patch(
    `${url}/api/companies/${company_id}`,
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

export const deleteCompany = async (company_id: string) => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");

  await axiosInstance.delete(`${url}/api/companies/${company_id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
};
