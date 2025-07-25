import { useQuery } from "@tanstack/react-query";
import { fetchBotDetails, fetchBots, IBot } from "../../api/botsApi";
import { useAuth } from "../../context/authContext";

interface IBotsResponse {
  total: number;
  bots: IBot[];
}

export const useBotsQuery = (company_id?: string) => {
  const { selectedCompanyId } = useAuth();
  const user_id = localStorage.getItem("user_id");

  return useQuery<IBotsResponse>({
    queryKey: ["bots", company_id || selectedCompanyId, user_id],
    queryFn: () => fetchBots(company_id || selectedCompanyId),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};

export const useBotDetailsQuery = (bot_id: string) => {
  const { selectedCompanyId, isSuperadmin } = useAuth();

  return useQuery({
    queryKey: ["botDetails", bot_id],
    queryFn: () => fetchBotDetails(bot_id, selectedCompanyId, isSuperadmin),
    // staleTime: 5 * 60 * 1000,
    // retry: false,
  });
};
