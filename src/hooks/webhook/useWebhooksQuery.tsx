import { useQuery } from "@tanstack/react-query";
import { fetchWebhook, IWebhook } from "../../api/webhookApi";
import { useAuth } from "../../context/authContext";

interface IWebhookResponse {
  ok: boolean;
  result: IWebhook;
}

export const useWebhookQuery = (bot_id: string) => {
  const { selectedCompanyId, isSuperadmin } = useAuth();
  const user_id = localStorage.getItem("user_id");

  return useQuery<IWebhookResponse>({
    queryKey: ["webhook", bot_id, selectedCompanyId, user_id],
    queryFn: () => fetchWebhook(bot_id, selectedCompanyId, isSuperadmin),
    staleTime: 5 * 60 * 1000,
  });
};
