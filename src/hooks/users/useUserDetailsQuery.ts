import { useQuery } from "@tanstack/react-query";
import { fetchUserDetails, IUser } from "../../api/usersApi";

export const useUserDetailsQuery = () => {
  return useQuery<IUser>({
    queryKey: ["user"],
    queryFn: () => fetchUserDetails(),
    staleTime: 5 * 60 * 1000,
  });
};
