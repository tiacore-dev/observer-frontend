import { axiosInstance } from "../axiosConfig";

export const fetchApps = async () => {
  const url = process.env.REACT_APP_AUTH_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const response = await axiosInstance.get(`${url}/api/applications/all`, {
    params: {
      page: 1,
      page_size: 100,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  return response.data;
};
