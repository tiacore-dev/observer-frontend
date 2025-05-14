import { useQuery } from "@tanstack/react-query";
import {
  fetchCompanies,
  fetchCompanyDetails,
  ICompany,
} from "../../api/companiesApi";

export interface ICompaniesResponse {
  total: number;
  companies: ICompany[];
}

export const useCompaniesQuery = () => {
  return useQuery<ICompaniesResponse>({
    queryKey: ["companies"],
    queryFn: () => fetchCompanies(),
  });
};

export const useCompanyDetailsQuery = (company_id: string) => {
  return useQuery({
    queryKey: ["companyDetails", company_id],
    queryFn: () => fetchCompanyDetails(company_id),
    retry: false,
  });
};
