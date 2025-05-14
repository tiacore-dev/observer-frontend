import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createCompany,
  deleteCompany,
  ICompany,
  updateCompany,
} from "../../api/companiesApi";
import { enqueueSnackbar } from "notistack";

export const useCreateCompany = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newCompany: { company_name: string; description?: string }) =>
      createCompany(newCompany),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      enqueueSnackbar("Успешно добавлено", { variant: "success" });
    },
    onError: () => {
      enqueueSnackbar("Ошибка при создании", { variant: "error" });
    },
  });
};

export const useUpdateCompany = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      company_id,
      updatedData,
    }: {
      company_id: string;
      updatedData: Partial<ICompany>;
    }) => updateCompany(company_id, updatedData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      queryClient.invalidateQueries({
        queryKey: ["companyDetails", variables.company_id],
      });
      enqueueSnackbar("Успешно обновлено", { variant: "success" });
    },
    onError: () => {
      enqueueSnackbar("Ошибка при обновлении", { variant: "error" });
    },
  });
};

export const useDeleteCompany = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (company_id: string) => deleteCompany(company_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      enqueueSnackbar("Успешно удалено", { variant: "success" });
    },
    onError: () => {
      enqueueSnackbar("Ошибка при удалении", { variant: "error" });
    },
  });
};
