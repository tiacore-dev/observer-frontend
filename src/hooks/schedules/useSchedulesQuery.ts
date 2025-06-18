import { useQuery } from "@tanstack/react-query";
import {
  fetchScheduleDetails,
  fetchSchedules,
  ISchedule,
} from "../../api/schedulesApi";
import { useAuth } from "../../context/authContext";

interface ISchedulesResponse {
  total: number;
  schedules: ISchedule[];
}

export const useSchedulesQuery = () => {
  const { selectedCompanyId } = useAuth();

  return useQuery<ISchedulesResponse>({
    queryKey: ["schedules", selectedCompanyId],
    queryFn: () => fetchSchedules(selectedCompanyId),
    staleTime: 5 * 60 * 1000,
    retry: false, // Отключает повторные попытки
  });
};

export const useScheduleDetailsQuery = (schedule_id: string) => {
  const { selectedCompanyId } = useAuth();
  return useQuery({
    queryKey: ["scheduleDetails", schedule_id, selectedCompanyId],
    queryFn: () => fetchScheduleDetails(schedule_id, selectedCompanyId),
    retry: false, // Отключает повторные попытки
    staleTime: 5 * 60 * 1000,
  });
};
