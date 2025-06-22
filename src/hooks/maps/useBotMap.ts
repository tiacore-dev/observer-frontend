// src/hooks/maps/useBotMap.ts
import { useBotsQuery } from "../bots/useBotsQuery";
import { useMemo } from "react";

export const useBotMap = (company_id?: string) => {
  const { data: botsData, isLoading: isLoadingBotMap } = useBotsQuery(
    company_id !== undefined ? company_id : undefined
  );

  const botMap = useMemo(() => {
    const map = new Map<string, string>();
    botsData?.bots?.forEach((bot) => {
      map.set(bot.bot_id.toString(), bot.bot_first_name);
    });
    return map;
  }, [botsData]);
  return { botMap, isLoadingBotMap };
};
