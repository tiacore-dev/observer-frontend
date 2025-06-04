import { useQuery } from "@tanstack/react-query";
import {
  fetchScheduleDetails,
  fetchSchedules,
  ISchedule,
} from "../../api/schedulesApi";

interface ISchedulesResponse {
  total: number;
  schedules: ISchedule[];
}

export const useSchedulesQuery = () => {
  return useQuery<ISchedulesResponse>({
    queryKey: ["schedules"],
    queryFn: () => fetchSchedules(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useScheduleDetailsQuery = (schedule_id: string) => {
  return useQuery({
    queryKey: ["scheduleDetails", schedule_id],
    queryFn: () => fetchScheduleDetails(schedule_id),
    // retry: false,
    staleTime: 5 * 60 * 1000,
  });
};
