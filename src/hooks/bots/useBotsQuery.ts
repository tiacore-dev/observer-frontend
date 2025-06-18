import { useQuery } from "@tanstack/react-query";
import { fetchBotDetails, fetchBots, IBot } from "../../api/botsApi";
import { useAuth } from "../../context/authContext";

interface IBotsResponse {
  total: number;
  bots: IBot[];
}

export const useBotsQuery = () => {
  const { selectedCompanyId } = useAuth();
  return useQuery<IBotsResponse>({
    queryKey: ["bots", selectedCompanyId],
    queryFn: () => fetchBots(selectedCompanyId),
    staleTime: 5 * 60 * 1000,
    retry: false, // Отключает повторные попытки
  });
};

export const useBotDetailsQuery = (bot_id: string) => {
  const { selectedCompanyId } = useAuth();

  return useQuery({
    queryKey: ["botDetails", bot_id, selectedCompanyId],
    queryFn: () => fetchBotDetails(bot_id, selectedCompanyId),
    staleTime: 5 * 60 * 1000,
    retry: false, // Отключает повторные попытки
  });
};
