import { useQuery } from "@tanstack/react-query";
import {
  fetchScheduleDetails,
  fetchSchedules,
  Ischedule,
} from "../../api/schedulesApi";

interface ISchedulesResponse {
  total: number;
  schedules: Ischedule[];
}

export const useSchedulesQuery = () => {
  return useQuery<ISchedulesResponse>({
    queryKey: ["schedules"],
    queryFn: () => fetchSchedules(),
  });
};

export const useScheduleDetailsQuery = (schedule_id: string) => {
  return useQuery({
    queryKey: ["scheduleDetails", schedule_id],
    queryFn: () => fetchScheduleDetails(schedule_id),
    retry: false,
  });
};
