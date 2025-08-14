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
    onError: (error: any) => {
      if (error.response?.status === 419) {
        enqueueSnackbar("Этот бот уже привязан к другой компании", {
          variant: "error",
        });
      } else {
        enqueueSnackbar("Ошибка при создании", { variant: "error" });
      }
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

export const useUpdateBot = (bot_id: string) => {
  const queryClient = useQueryClient();
  const { isSuperadmin, selectedCompanyId } = useAuth();

  return useMutation({
    mutationFn: ({ bot_id, comment }: { bot_id: string; comment: string }) =>
      updateBot(bot_id, comment, isSuperadmin, selectedCompanyId),
    onSuccess: () => {
      // Инвалидируем все возможные варианты ключа
      queryClient.invalidateQueries({
        queryKey: ["botDetails", bot_id],
        exact: false, // Инвалидирует все подходящие ключи
      });
      enqueueSnackbar("Описание бота успешно обновлено", {
        variant: "success",
      });
    },
    onError: () => {
      enqueueSnackbar("Ошибка при обновлении описания", { variant: "error" });
    },
  });
};
