import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createSchedule,
  deleteSchedule,
  ISchedule,
  IscheduleCreate,
  toggleSchedule,
  updateSchedule,
} from "../../api/schedulesApi";
import { enqueueSnackbar } from "notistack";

export const useCreateSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newSchedule: IscheduleCreate) => createSchedule(newSchedule),
    onSuccess: () => {
      // enqueueSnackbar("Успешно добавлено", { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
    },
    onError: () => {
      // enqueueSnackbar("Ошибка при создании", { variant: "error" });
    },
  });
};

export const useUpdateSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      schedule_id,
      updatedData,
    }: {
      schedule_id: string;
      updatedData: Partial<ISchedule>;
    }) => updateSchedule(schedule_id, updatedData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      queryClient.invalidateQueries({
        queryKey: ["scheduleDetails", variables.schedule_id],
      });
      // enqueueSnackbar("Успешно обновлено", { variant: "success" });
    },
    onError: () => {
      // enqueueSnackbar("Ошибка при обновлении", { variant: "error" });
    },
  });
};

export const useToggleSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (schedule_id: string) => toggleSchedule(schedule_id),
    onSuccess: (data, schedule_id) => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      queryClient.invalidateQueries({
        queryKey: ["scheduleDetails", schedule_id],
      });
    },
  });
};

export const useDeleteSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (schedule_id: string) => deleteSchedule(schedule_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      enqueueSnackbar("Успешно удалено", { variant: "success" });
    },
    onError: () => {
      enqueueSnackbar("Ошибка при удалении", { variant: "error" });
    },
  });
};
