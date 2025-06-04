import { useQuery } from "@tanstack/react-query";
import { fetchChats, IChat } from "../../api/chatsApi";

export interface IChatsResponse {
  total: number;
  chats: IChat[];
}

export const useChatsQuery = () => {
  return useQuery<IChatsResponse>({
    queryKey: ["chats"],
    queryFn: () => fetchChats(),
    staleTime: 5 * 60 * 1000,
  });
};
