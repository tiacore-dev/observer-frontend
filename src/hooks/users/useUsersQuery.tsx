import { useQuery } from "@tanstack/react-query";
import { fetchUserDetails, IUser } from "../../api/usersApi";

export const useUserDetailsQuery = () => {
  const user_id = localStorage.getItem("user_id");
  return useQuery<IUser>({
    queryKey: ["user"],
    queryFn: () => fetchUserDetails(),
    staleTime: 5 * 60 * 1000,
  });
};
