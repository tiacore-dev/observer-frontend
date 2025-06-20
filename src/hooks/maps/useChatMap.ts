// src/hooks/maps/useChatMap.ts
import { useChatsSelectQuery } from "../chats/useChatsQuery";
import { useMemo } from "react";

export const useChatMap = () => {
  const { data: chatsData } = useChatsSelectQuery();

  const chatMap = useMemo(() => {
    const map = new Map<number, string>();
    chatsData?.chats?.forEach((chat) => {
      map.set(chat.chat_id, chat.chat_name);
    });
    return map;
  }, [chatsData]);

  return chatMap;
};
