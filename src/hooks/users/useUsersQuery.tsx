import { useQuery } from "@tanstack/react-query";
import { fetchUserDetails, IUser } from "../../api/usersApi";
import { useAuth } from "../../context/authContext";

export const useUserDetailsQuery = (companyId?: string) => {
  const { selectedCompanyId, isSuperadmin } = useAuth();
  const user_id = localStorage.getItem("user_id");

  return useQuery<IUser>({
    queryKey: ["user", selectedCompanyId, user_id],
    queryFn: () => fetchUserDetails(selectedCompanyId, isSuperadmin),
    staleTime: 5 * 60 * 1000,
    enabled: !!user_id,
    // initialData: undefined,
  });
};
