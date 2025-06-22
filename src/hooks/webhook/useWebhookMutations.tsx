import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteWebhook, setWebhook } from "../../api/webhookApi";
import { enqueueSnackbar } from "notistack";
import { IBot } from "../../api/botsApi";
import { useAuth } from "../../context/authContext";

export const useSetWebhookMutation = () => {
  const queryClient = useQueryClient();
  const { selectedCompanyId, isSuperadmin } = useAuth();
  console.log("Mutation  sci:", selectedCompanyId, " isa:", isSuperadmin);
  return useMutation({
    mutationFn: (bot_id: string) =>
      setWebhook(bot_id, selectedCompanyId, isSuperadmin),
    onMutate: async (bot_id) => {
      await queryClient.cancelQueries({ queryKey: ["webhook", bot_id] });
      await queryClient.cancelQueries({ queryKey: ["botDetails", bot_id] });
      await queryClient.cancelQueries({ queryKey: ["bots"] });

      const previousWebhook = queryClient.getQueryData(["webhook", bot_id]);
      const previousBotDetails = queryClient.getQueryData([
        "botDetails",
        bot_id,
      ]);
      const previousBots = queryClient.getQueryData(["bots"]);

      queryClient.setQueryData(["webhook", bot_id], (old: any) => ({
        ...old,
        result: {
          ...old?.result,
          url: "optimistic_update_in_progress",
          pending_update_count: 0,
        },
      }));

      queryClient.setQueryData(["bots"], (old: any) => ({
        ...old,
        bots: old?.bots?.map((bot: IBot) =>
          bot.bot_id === bot_id ? { ...bot, is_active: true } : bot
        ),
      }));

      return { previousWebhook, previousBotDetails, previousBots };
    },
    onError: (err, bot_id, context) => {
      if (context?.previousWebhook) {
        queryClient.setQueryData(["webhook", bot_id], context.previousWebhook);
      }
      if (context?.previousBotDetails) {
        queryClient.setQueryData(
          ["botDetails", bot_id],
          context.previousBotDetails
        );
      }
      if (context?.previousBots) {
        queryClient.setQueryData(["bots"], context.previousBots);
      }
      enqueueSnackbar("Ошибка", { variant: "error" });
    },
    onSuccess: (data, bot_id) => {
      queryClient.invalidateQueries({ queryKey: ["webhook", bot_id] });
      queryClient.invalidateQueries({ queryKey: ["botDetails", bot_id] });
      queryClient.invalidateQueries({ queryKey: ["bots"] });
      enqueueSnackbar("Успешно", { variant: "success" });
    },
  });
};

export const useDeleteWebhookMutation = () => {
  const queryClient = useQueryClient();
  const { selectedCompanyId, isSuperadmin } = useAuth();
  return useMutation({
    mutationFn: (bot_id: string) =>
      deleteWebhook(bot_id, selectedCompanyId, isSuperadmin),
    onMutate: async (bot_id) => {
      await queryClient.cancelQueries({ queryKey: ["webhook", bot_id] });
      await queryClient.cancelQueries({ queryKey: ["botDetails", bot_id] });
      await queryClient.cancelQueries({ queryKey: ["bots"] });

      const previousWebhook = queryClient.getQueryData(["webhook", bot_id]);
      const previousBotDetails = queryClient.getQueryData([
        "botDetails",
        bot_id,
      ]);
      const previousBots = queryClient.getQueryData(["bots"]);

      queryClient.setQueryData(["webhook", bot_id], null);

      queryClient.setQueryData(["bots"], (old: any) => ({
        ...old,
        bots: old?.bots?.map((bot: IBot) =>
          bot.bot_id === bot_id ? { ...bot, is_active: false } : bot
        ),
      }));

      return { previousWebhook, previousBotDetails, previousBots };
    },
    onError: (err, bot_id, context) => {
      if (context?.previousWebhook) {
        queryClient.setQueryData(["webhook", bot_id], context.previousWebhook);
      }
      if (context?.previousBotDetails) {
        queryClient.setQueryData(
          ["botDetails", bot_id],
          context.previousBotDetails
        );
      }
      if (context?.previousBots) {
        queryClient.setQueryData(["bots"], context.previousBots);
      }
      enqueueSnackbar("Ошибка", { variant: "error" });
    },
    onSuccess: (data, bot_id) => {
      queryClient.invalidateQueries({ queryKey: ["webhook", bot_id] });
      queryClient.invalidateQueries({ queryKey: ["botDetails", bot_id] });
      queryClient.invalidateQueries({ queryKey: ["bots"] });
      enqueueSnackbar("Успешно", { variant: "success" });
    },
  });
};
