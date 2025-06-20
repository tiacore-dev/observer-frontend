// src/pages/botsPage/botDetailsPage.tsx
import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useBotDetailsQuery } from "../../hooks/bots/useBotsQuery";
import { useCompanyMap } from "../../hooks/maps/useCompanyMap";
import { BotCard } from "./botCard";

interface BotDetailsPageProps {
  botId: string;
  developerMode: boolean;
}

export const BotDetailsPage: React.FC<BotDetailsPageProps> = ({
  botId,
  developerMode,
}) => {
  const { data: bot, isLoading, error } = useBotDetailsQuery(botId);
  const companyMap = useCompanyMap();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !bot) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Typography color="error">
          Ошибка: {(error as Error)?.message || "Бот не найден"}
        </Typography>
      </Box>
    );
  }

  return (
    <BotCard
      bot={bot}
      companyName={companyMap.get(bot.company) || bot.company}
      developerMode={developerMode}
    />
  );
};
