import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchAccounts, IAccount, updateAccount } from "../../api/accountsApi";
import { useAuth } from "../../context/authContext";
import { enqueueSnackbar } from "notistack";

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

export const useUpdateAccount = () => {
  const queryClient = useQueryClient();
  const { isSuperadmin, selectedCompanyId } = useAuth();

  return useMutation({
    mutationFn: ({
      account_id,
      account_name,
    }: {
      account_id: string;
      account_name: string;
    }) =>
      updateAccount(account_id, account_name, isSuperadmin, selectedCompanyId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      enqueueSnackbar("Успешно обновлено", { variant: "success" });
    },
    onError: () => {
      enqueueSnackbar("Ошибка при обновлении", { variant: "error" });
    },
  });
};
