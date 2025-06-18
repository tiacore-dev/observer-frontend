import { axiosInstance } from "../axiosConfig";

export interface IUser {
  user_id: string;
  email: string;
  full_name: string;
  position?: string;
  is_verified: boolean;
}

export const fetchUserDetails = async (companyId?: string) => {
  const url = process.env.REACT_APP_API_URL;
  if (!url) throw new Error("REACT_APP_API_URL is not defined");

  const accessToken = localStorage.getItem("access_token");
  const user_id = localStorage.getItem("user_id");
  if (!user_id) throw new Error("User ID is not available");

  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  };

  const params = new URLSearchParams();
  if (companyId && localStorage.getItem("is_superadmin") !== "true") {
    params.append("company_id", companyId);
  }

  const response = await axiosInstance.get(
    `${url}/api/users/${user_id}?${params.toString()}`,
    config
  );
  return response.data;
};

export const updateUser = async (user_id: string, updatedData: any) => {
  const url = process.env.REACT_APP_API_URL;
  if (!url) throw new Error("REACT_APP_API_URL is not defined");

  const accessToken = localStorage.getItem("access_token");
  const response = await axiosInstance.patch(
    `${url}/api/users/${user_id}`,
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
