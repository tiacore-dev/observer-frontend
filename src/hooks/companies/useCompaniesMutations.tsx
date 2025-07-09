import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createCompany,
  deleteCompany,
  ICompany,
  updateCompany,
} from "../../api/companiesApi";
import { enqueueSnackbar } from "notistack";
import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router-dom";

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

// В useCompaniesMutations.tsx
export const useDeleteCompany = () => {
  const queryClient = useQueryClient();
  const { removeAvailableCompany, availableCompanies } = useAuth(); // Добавляем использование контекста
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (company_id: string) => deleteCompany(company_id),
    onSuccess: (_, company_id) => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      removeAvailableCompany(company_id); // Удаляем компанию из доступных
      if (availableCompanies.length === 1) {
        // Мы удаляем последнюю компанию
        navigate("/home"); // Перенаправляем на /home
      }
      enqueueSnackbar("Успешно удалено", { variant: "success" });
    },
    onError: () => {
      enqueueSnackbar("Ошибка при удалении", { variant: "error" });
    },
  });
};
