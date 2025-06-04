import { useQuery } from "@tanstack/react-query";
import { fetchWebhook, IWebhook } from "../../api/webhookApi";

interface IWebhookResponse {
  ok: boolean;
  result: IWebhook;
}

export const useWebhookQuery = (bot_id: string) => {
  return useQuery<IWebhookResponse>({
    queryKey: ["webhook", bot_id],
    queryFn: () => fetchWebhook(bot_id),
    staleTime: 5 * 60 * 1000,
  });
};
