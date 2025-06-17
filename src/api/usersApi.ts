import { axiosInstance } from "../axiosConfig";

export interface IUser {
  user_id: string; //uuid
  email: string;
  full_name: string;
  position?: string; //Expand all(string | null)
  is_verified: boolean;
}
export const fetchUserDetails = async () => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const user_id = localStorage.getItem("user_id");
  const response = await axiosInstance.get(`${url}/api/users/${user_id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
