import { useQuery } from "@tanstack/react-query";
import { fetchAccounts, IAccount } from "../../api/accountsApi";
import { useAuth } from "../../context/authContext";

export interface IAccountsResponse {
  total: number;
  accounts: IAccount[];
}

export const useAccountsQuery = () => {
  const { selectedCompanyId, isSuperadmin } = useAuth();
  const user_id = localStorage.getItem("user_id");

  return useQuery<IAccountsResponse>({
    queryKey: ["accounts", selectedCompanyId, user_id],
    queryFn: () => fetchAccounts(selectedCompanyId, isSuperadmin),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};
