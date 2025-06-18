// useAnalysisQuery.tsx
import { useQuery } from "@tanstack/react-query";
import {
  fetchAnalysDetails,
  fetchAnalysis,
  IAnalys,
} from "../../api/analysisApi";

export interface IAnalysisResponse {
  total: number;
  analysis: IAnalys[]; // Изменили chats на analysis
}

export const useAnalysisQuery = () => {
  return useQuery<IAnalysisResponse>({
    queryKey: ["analysis"],
    queryFn: () => fetchAnalysis(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useAnalysDetailsQuery = (analysis_id: string) => {
  return useQuery({
    queryKey: ["analysDetails", analysis_id],
    queryFn: () => fetchAnalysDetails(analysis_id),
    staleTime: 5 * 60 * 1000,
  });
};
