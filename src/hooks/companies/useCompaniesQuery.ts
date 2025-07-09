import { useQuery } from "@tanstack/react-query";
import {
  fetchCompanies,
  fetchCompanyDetails,
  ICompany,
} from "../../api/companiesApi";
import { useAuth } from "../../context/authContext";

export interface ICompaniesResponse {
  total: number;
  companies: ICompany[];
}

export const useCompaniesQuery = () => {
  const { selectedCompanyId } = useAuth();
  const user_id = localStorage.getItem("user_id");
  return useQuery<ICompaniesResponse>({
    queryKey: ["companies", selectedCompanyId, user_id],
    queryFn: () => fetchCompanies(),
    staleTime: 5 * 60 * 1000,
    retry: false, // Отключает повторные попытки
  });
};

export const useCompanyDetailsQuery = (company_id: string) => {
  const { selectedCompanyId } = useAuth();

  return useQuery({
    queryKey: ["companyDetails", company_id, selectedCompanyId],
    queryFn: () => fetchCompanyDetails(company_id),
    staleTime: 5 * 60 * 1000,
    retry: false, // Отключает повторные попытки
  });
};
