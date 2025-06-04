import { useQuery } from "@tanstack/react-query";
import { fetchBotDetails, fetchBots, IBot } from "../../api/botsApi";

interface IBotsResponse {
  total: number;
  bots: IBot[];
}

export const useBotsQuery = () => {
  return useQuery<IBotsResponse>({
    queryKey: ["bots"],
    queryFn: () => fetchBots(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useBotDetailsQuery = (bot_id: string) => {
  return useQuery({
    queryKey: ["botDetails", bot_id],
    queryFn: () => fetchBotDetails(bot_id),
    staleTime: 5 * 60 * 1000,
  });
};
