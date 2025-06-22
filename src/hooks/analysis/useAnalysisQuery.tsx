import { useQuery } from "@tanstack/react-query";
import {
  fetchAnalysDetails,
  fetchAnalysis,
  IAnalys,
} from "../../api/analysisApi";
import { useAuth } from "../../context/authContext";

export interface IAnalysisResponse {
  total: number;
  analysis: IAnalys[];
}

export const useAnalysisQuery = () => {
  const { selectedCompanyId, isSuperadmin } = useAuth();

  return useQuery<IAnalysisResponse>({
    queryKey: ["analysis", selectedCompanyId],
    queryFn: () => fetchAnalysis(selectedCompanyId, isSuperadmin),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};

export const useAnalysDetailsQuery = (analysis_id: string) => {
  const { selectedCompanyId, isSuperadmin } = useAuth();

  return useQuery({
    queryKey: ["analysDetails", analysis_id, selectedCompanyId],
    queryFn: () =>
      fetchAnalysDetails(analysis_id, selectedCompanyId, isSuperadmin),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};
