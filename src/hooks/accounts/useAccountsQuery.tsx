import { useQuery } from "@tanstack/react-query";
import { fetchChats, IChat } from "../../api/chatsApi";
import { fetchAccounts, IAccount } from "../../api/accountsApi";

export interface IAccountsResponse {
  total: number;
  accounts: IAccount[];
}

export const useAccountsQuery = () => {
  return useQuery<IAccountsResponse>({
    queryKey: ["accounts"],
    queryFn: () => fetchAccounts(),
    staleTime: 5 * 60 * 1000,
  });
};
