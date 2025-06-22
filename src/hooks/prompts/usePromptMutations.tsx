import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import {
  createPrompt,
  deletePrompt,
  IPrompt,
  updatePrompt,
} from "../../api/promptsApi";
import { useAuth } from "../../context/authContext";

export const useCreatePrompt = () => {
  const queryClient = useQueryClient();
  const { isSuperadmin, selectedCompanyId } = useAuth();

  return useMutation({
    mutationFn: (newPrompt: {
      prompt_name: string;
      text: string;
      company_id: string;
    }) => createPrompt(newPrompt, isSuperadmin, selectedCompanyId),
    onSuccess: () => {
      enqueueSnackbar("Успешно добавлено", { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["prompts"] });
    },
    onError: () => {
      enqueueSnackbar("Ошибка при создании", { variant: "error" });
    },
  });
};

export const useUpdatePrompt = () => {
  const queryClient = useQueryClient();
  const { isSuperadmin, selectedCompanyId } = useAuth();

  return useMutation({
    mutationFn: ({
      prompt_id,
      updatedData,
    }: {
      prompt_id: string;
      updatedData: Partial<IPrompt>;
    }) => updatePrompt(prompt_id, updatedData, isSuperadmin, selectedCompanyId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["prompts"] });
      queryClient.invalidateQueries({
        queryKey: ["promptDetails", variables.prompt_id],
      });
      enqueueSnackbar("Успешно обновлено", { variant: "success" });
    },
    onError: () => {
      enqueueSnackbar("Ошибка при обновлении", { variant: "error" });
    },
  });
};

export const useDeletePrompt = () => {
  const queryClient = useQueryClient();
  const { isSuperadmin, selectedCompanyId } = useAuth();

  return useMutation({
    mutationFn: (prompt_id: string) =>
      deletePrompt(prompt_id, isSuperadmin, selectedCompanyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prompts"] });
      enqueueSnackbar("Успешно удалено", { variant: "success" });
    },
    onError: () => {
      enqueueSnackbar("Ошибка при удалении", { variant: "error" });
    },
  });
};
