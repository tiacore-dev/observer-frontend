import { useQuery } from "@tanstack/react-query";
import { fetchAccounts, IAccount } from "../../api/accountsApi";
import { useAuth } from "../../context/authContext";

export interface IAccountsResponse {
  total: number;
  accounts: IAccount[];
}

export const useAccountsQuery = () => {
  const { selectedCompanyId } = useAuth();
  return useQuery<IAccountsResponse>({
    queryKey: ["accounts", selectedCompanyId],
    queryFn: () => fetchAccounts(selectedCompanyId),
    staleTime: 5 * 60 * 1000,
    retry: false, // Отключает повторные попытки
  });
};
