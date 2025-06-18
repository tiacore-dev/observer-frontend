// useAnalysisQuery.tsx
import { useQuery } from "@tanstack/react-query";
import {
  fetchAnalysDetails,
  fetchAnalysis,
  IAnalys,
} from "../../api/analysisApi";
import { useAuth } from "../../context/authContext";

export interface IAnalysisResponse {
  total: number;
  analysis: IAnalys[]; // Изменили chats на analysis
}

export const useAnalysisQuery = () => {
  const { selectedCompanyId } = useAuth();

  return useQuery<IAnalysisResponse>({
    queryKey: ["analysis", selectedCompanyId],
    queryFn: () => fetchAnalysis(selectedCompanyId),
    staleTime: 5 * 60 * 1000,
    retry: false, // Отключает повторные попытки
  });
};

export const useAnalysDetailsQuery = (analysis_id: string) => {
  const { selectedCompanyId } = useAuth();

  return useQuery({
    queryKey: ["analysDetails", analysis_id, selectedCompanyId],
    queryFn: () => fetchAnalysDetails(analysis_id, selectedCompanyId),
    staleTime: 5 * 60 * 1000,
    retry: false, // Отключает повторные попытки
  });
};
