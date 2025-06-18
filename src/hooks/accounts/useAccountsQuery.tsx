import { useQuery } from "@tanstack/react-query";
import { fetchChats, IChat } from "../../api/chatsApi";
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
    queryFn: () => fetchAccounts(),
    staleTime: 5 * 60 * 1000,
  });
};
