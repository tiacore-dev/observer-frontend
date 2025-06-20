// src/hooks/maps/useBotMap.ts
import { useBotsQuery } from "../bots/useBotsQuery";
import { useMemo } from "react";

export const useBotMap = () => {
  const { data: botsData } = useBotsQuery();

  const botMap = useMemo(() => {
    const map = new Map<string, string>();
    botsData?.bots?.forEach((bot) => {
      map.set(bot.bot_id.toString(), bot.bot_first_name);
    });
    return map;
  }, [botsData]);

  return botMap;
};
