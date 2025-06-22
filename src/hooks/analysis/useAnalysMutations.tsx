import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { createAnalysis } from "../../api/analysisApi";
import { useAuth } from "../../context/authContext";

export const useCreateAnalys = () => {
  const queryClient = useQueryClient();
  const { isSuperadmin, selectedCompanyId } = useAuth();

  return useMutation({
    mutationFn: (newAnalys: {
      prompt_id: string;
      chat_id: number;
      date_from: number;
      date_to: number;
      company_id: string;
    }) => createAnalysis(newAnalys, isSuperadmin, selectedCompanyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["analysis"] });
      enqueueSnackbar("Успешно добавлено", { variant: "success" });
    },
    onError: () => {
      enqueueSnackbar("Ошибка при создании", { variant: "error" });
    },
  });
};
