import { axiosInstance } from "../axiosConfig";

export interface IUser {
  user_id: string;
  email: string;
  full_name: string;
  position?: string;
  is_verified: boolean;
}

// export const fetchUserDetails = async (selectedCompanyId?: string | null) => {
//   const url = process.env.REACT_APP_API_URL;
//   const accessToken = localStorage.getItem("access_token");
//   const isSuperadmin = localStorage.getItem("is_superadmin") === "true";
//   const user_id = localStorage.getItem("user_id");

//   const params: any = {};
//   if (!isSuperadmin && selectedCompanyId) {
//     params.company_id = selectedCompanyId;
//   }
//   try {
//     const response = await axiosInstance.get(`${url}/api/users/${user_id}`, {
//       params,
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         "Content-Type": "application/json",
//       },
//     });
//     return response.data;
//   } catch (error) {
//     throw error; // Пробрасываем ошибку дальше
//   }
// };

export const fetchUserDetails = async (selectedCompanyId?: string | null) => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const isSuperadmin = localStorage.getItem("is_superadmin") === "true";
  const user_id = localStorage.getItem("user_id");

  const params: any = {};
  if (!isSuperadmin && selectedCompanyId) {
    params.company_id = selectedCompanyId;
  }
  const response = await axiosInstance.get(`${url}/api/users/${user_id}`, {
    params,

    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
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
