import { useQuery } from "@tanstack/react-query";
import { fetchUserDetails, IUser } from "../../api/usersApi";

export const useUserDetailsQuery = (companyId?: string) => {
  const user_id = localStorage.getItem("user_id");
  return useQuery<IUser>({
    queryKey: ["user", companyId],
    queryFn: () => fetchUserDetails(companyId),
    staleTime: 5 * 60 * 1000,
    enabled: !!user_id,
  });
};
