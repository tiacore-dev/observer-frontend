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
  const { selectedCompanyId, isSuperadmin } = useAuth();
  const user_id = localStorage.getItem("user_id");

  return useQuery<ISchedulesResponse>({
    queryKey: ["schedules", selectedCompanyId, user_id],
    queryFn: () => fetchSchedules(selectedCompanyId, isSuperadmin),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};

export const useScheduleDetailsQuery = (schedule_id: string) => {
  const { selectedCompanyId, isSuperadmin } = useAuth();

  return useQuery({
    queryKey: ["scheduleDetails", schedule_id, selectedCompanyId],
    queryFn: () =>
      fetchScheduleDetails(schedule_id, selectedCompanyId, isSuperadmin),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
};
