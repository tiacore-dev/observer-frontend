import { axiosInstance } from "../axiosConfig";

export interface IAccount {
  account_id: number;
  account_name: string;
  username: string;
  created_at: string | Date;
}
export const fetchAccounts = async (selectedCompanyId?: string | null) => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const isSuperadmin = localStorage.getItem("is_superadmin") === "true";
  const params: any = { page: 1, page_size: 100 };
  if (!isSuperadmin && selectedCompanyId) {
    params.company_id = selectedCompanyId;
  }

  const response = await axiosInstance.get(`${url}/api/accounts/all`, {
    params,

    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
