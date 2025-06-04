import { useQuery } from "@tanstack/react-query";
import { fetchAnalysis, IAnalys } from "../../api/analysisApi";

export interface IAnalysisResponse {
  total: number;
  chats: IAnalys[];
}

export const useAnalysisQuery = () => {
  return useQuery<IAnalysisResponse>({
    queryKey: ["analysis"],
    queryFn: () => fetchAnalysis(),
    staleTime: 5 * 60 * 1000,
  });
};
