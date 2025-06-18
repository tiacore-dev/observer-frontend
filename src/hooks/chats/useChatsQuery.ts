import { useQuery } from "@tanstack/react-query";
import { fetchChats, IChat } from "../../api/chatsApi";
import { useAuth } from "../../context/authContext";

export interface IChatsResponse {
  total: number;
  chats: IChat[];
}

export const useChatsQuery = () => {
  const { selectedCompanyId } = useAuth();

  return useQuery<IChatsResponse>({
    queryKey: ["chats", selectedCompanyId],
    queryFn: () => fetchChats(selectedCompanyId),
    staleTime: 5 * 60 * 1000,
    retry: false, // Отключает повторные попытки
  });
};
