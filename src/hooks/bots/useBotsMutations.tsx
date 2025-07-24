import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBot, deleteBot, updateBot } from "../../api/botsApi";
import { enqueueSnackbar } from "notistack";
import { useAuth } from "../../context/authContext";

export const useCreateBot = () => {
  const queryClient = useQueryClient();
  const { isSuperadmin, selectedCompanyId } = useAuth();

  return useMutation({
    mutationFn: (newBot: {
      token: string;
      company_id: string;
      comment?: string;
    }) => createBot(newBot, isSuperadmin, selectedCompanyId),
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
  const { isSuperadmin, selectedCompanyId } = useAuth();

  return useMutation({
    mutationFn: (bot_id: string) =>
      deleteBot(bot_id, isSuperadmin, selectedCompanyId),
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

export const useUpdateBot = () => {
  const queryClient = useQueryClient();
  const { isSuperadmin, selectedCompanyId } = useAuth();

  return useMutation({
    mutationFn: ({ bot_id, comment }: { bot_id: string; comment: string }) =>
      updateBot(bot_id, comment, isSuperadmin, selectedCompanyId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["bots"] });
      queryClient.invalidateQueries({
        queryKey: ["botDetails", variables.bot_id],
      });
      enqueueSnackbar("Успешно обновлено", { variant: "success" });
    },
    onError: () => {
      enqueueSnackbar("Ошибка при обновлении", { variant: "error" });
    },
  });
};
