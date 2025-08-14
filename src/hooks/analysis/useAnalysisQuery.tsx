import { useQuery } from "@tanstack/react-query";
import {
  fetchAnalysDetails,
  fetchAnalysis,
  IAnalys,
} from "../../api/analysisApi";
import { useAuth } from "../../context/authContext";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";

export interface IAnalysisResponse {
  total: number;
  analysis: IAnalys[];
}

export const useAnalysisQuery = () => {
  const { selectedCompanyId, isSuperadmin } = useAuth();
  const user_id = localStorage.getItem("user_id");

  const {
    chatSelectFilter,
    promptSelectFilter,
    companySelectFilter,
    dateFrom,
    dateTo,
    page,
    rowsPerPage,
    sortField,
    sortDirection,
    analysingModel,
  } = useSelector((state: RootState) => state.analysis);

  return useQuery<IAnalysisResponse>({
    queryKey: [
      "analysis",
      selectedCompanyId,
      user_id,
      chatSelectFilter,
      promptSelectFilter,
      companySelectFilter,
      dateFrom,
      dateTo,
      page,
      rowsPerPage,
      sortField,
      sortDirection,
      analysingModel,
    ],
    queryFn: () =>
      fetchAnalysis(selectedCompanyId, isSuperadmin, {
        page,
        page_size: rowsPerPage,
        chat_id: chatSelectFilter || undefined,
        prompt_id: promptSelectFilter || undefined,
        company_id: companySelectFilter || undefined,
        date_from: dateFrom || undefined,
        date_to: dateTo || undefined,
        sort_by: sortField,
        order: sortDirection,
        analysing_model: analysingModel || undefined,
      }),
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
