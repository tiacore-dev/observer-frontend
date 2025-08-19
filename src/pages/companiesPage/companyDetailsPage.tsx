// src/pages/companyDetailsPage.tsx
import React from "react";
import {
  Box,
  CircularProgress,
  Typography,
  useMediaQuery,
  Theme,
} from "@mui/material";
import { useCompanyDetailsQuery } from "../../hooks/companies/useCompaniesQuery";
import { CompanyCard } from "./companyCard";
import { DetailsPageSkeleton } from "../../components/skeleton/detailsPageSkeleton";

interface CompanyDetailsPageProps {
  companyId: string;
  developerMode: boolean;
}

export const CompanyDetailsPage: React.FC<CompanyDetailsPageProps> = ({
  companyId,
  developerMode,
}) => {
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );
  const { data: company, isLoading, error } = useCompanyDetailsQuery(companyId);

  if (isLoading) {
    return (
      <DetailsPageSkeleton developerMode={developerMode} buttonCount={3} />
    );
  }

  if (error || !company) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Typography color="error">
          Ошибка: {(error as Error)?.message || "Компания не найдена"}
        </Typography>
      </Box>
    );
  }

  return (
    <CompanyCard
      company={company}
      developerMode={developerMode}
      isMobile={isMobile}
    />
  );
};
