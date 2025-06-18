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
    queryFn: () => fetchSchedules(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useScheduleDetailsQuery = (schedule_id: string) => {
  const { selectedCompanyId } = useAuth();
  return useQuery({
    queryKey: ["scheduleDetails", schedule_id, selectedCompanyId],
    queryFn: () => fetchScheduleDetails(schedule_id),
    // retry: false,
    staleTime: 5 * 60 * 1000,
  });
};
