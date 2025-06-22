import { useQuery } from "@tanstack/react-query";
import { fetchChats, IChat } from "../../api/chatsApi";
import { useAuth } from "../../context/authContext";

export interface IChatsResponse {
  total: number;
  chats: IChat[];
}

export const useChatsQuery = (
  bot_id?: number | undefined,
  company_id?: string
) => {
  const { selectedCompanyId } = useAuth();

  return useQuery<IChatsResponse>({
    queryKey: ["chats", company_id || selectedCompanyId, bot_id],
    queryFn: () => fetchChats(bot_id, company_id || selectedCompanyId),
    staleTime: 5 * 60 * 1000,
    retry: false,
    enabled: bot_id !== undefined, // Добавляем условие enabled
  });
};

export const useChatsSelectQuery = (company_id?: string) => {
  const { selectedCompanyId } = useAuth();

  return useQuery<IChatsResponse>({
    queryKey: ["chats", company_id || selectedCompanyId],
    queryFn: () => fetchChats(undefined, company_id || selectedCompanyId),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};
