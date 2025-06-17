import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBot, deleteBot } from "../../api/botsApi";
import { enqueueSnackbar } from "notistack";

export const useCreateBot = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newBot: {
      token: string;
      company_id: string;
      comment?: string;
    }) => createBot(newBot),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bots"] });
      enqueueSnackbar("Успешно добавлено", { variant: "success" });
    },
    onError: () => {
      enqueueSnackbar("Ошибка при создании", { variant: "error" });
    },
  });
};

export const useDeleteBot = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bot_id: string) => deleteBot(bot_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bots"] });
      queryClient.invalidateQueries({ queryKey: ["bot"] });

      enqueueSnackbar("Успешно удалено", { variant: "success" });
    },
    onError: () => {
      enqueueSnackbar("Ошибка при удалении", { variant: "error" });
    },
  });
};
