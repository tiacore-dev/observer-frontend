// useUserMutations.tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "../../api/usersApi";
import { enqueueSnackbar } from "notistack";

export interface IUserEdit {
  email?: string;
  full_name?: string;
  position?: string;
  is_verified?: boolean;
  password?: string;
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      user_id,
      updatedData,
    }: {
      user_id: string;
      updatedData: Partial<IUserEdit>;
    }) => updateUser(user_id, updatedData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["user"] });

      // Обновляем данные пользователя в localStorage
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      const updatedUser = { ...currentUser, ...variables.updatedData };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      enqueueSnackbar("Успешно обновлено", { variant: "success" });
    },
    onError: () => {
      enqueueSnackbar("Ошибка при обновлении", { variant: "error" });
    },
  });
};
