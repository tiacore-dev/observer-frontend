// src/hooks/useCompanyMap.ts
import { useCompaniesQuery } from "../companies/useCompaniesQuery";
import { useMemo } from "react";

export const useCompanyMap = () => {
  const { data: companiesData } = useCompaniesQuery();

  const companyMap = useMemo(() => {
    const map = new Map<string, string>();
    companiesData?.companies?.forEach((company) => {
      map.set(company.company_id, company.company_name);
    });
    return map;
  }, [companiesData]);

  return companyMap;
};
