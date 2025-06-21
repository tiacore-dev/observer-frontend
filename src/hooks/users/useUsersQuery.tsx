// useUsersQuery.tsx
import { useQuery } from "@tanstack/react-query";
import { fetchUserDetails, IUser } from "../../api/usersApi";
import { useAuth } from "../../context/authContext";

export const useUserDetailsQuery = (companyId?: string) => {
  const { selectedCompanyId } = useAuth();
  const user_id = localStorage.getItem("user_id");

  return useQuery<IUser>({
    queryKey: ["user", selectedCompanyId],
    queryFn: () => fetchUserDetails(selectedCompanyId),
    staleTime: 5 * 60 * 1000,
    enabled: !!user_id,
    // Добавляем проверку на начальную загрузку
    initialData: undefined,
  });
};
