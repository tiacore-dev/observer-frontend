// companiesPage.tsx
import React, { useState } from "react";
import {
  useCompaniesQuery,
  useCompanyDetailsQuery,
} from "../../hooks/companies/useCompaniesQuery";
import {
  Paper,
  CircularProgress,
  Typography,
  Box,
  Button,
  Pagination,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { AddCompanyModal } from "./companyAddModel";
import { PageProps } from "../../App";
import { CompaniesTable } from "./companiesTable";
import { useNavigate, useParams } from "react-router-dom";
import { CompanyCard } from "./companyCard";

const CompanyDetailsPage: React.FC<{
  companyId: string;
  developerMode: boolean;
}> = ({ companyId, developerMode }) => {
  const { data: company, isLoading, error } = useCompanyDetailsQuery(companyId);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
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

  return <CompanyCard company={company} developerMode={developerMode} />;
};

export const CompaniesPage: React.FC<PageProps> = ({ developerMode }) => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useCompaniesQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  if (companyId) {
    return (
      <CompanyDetailsPage companyId={companyId} developerMode={developerMode} />
    );
  }

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Typography color="error">
          Ошибка при загрузке данных: {(error as Error).message}
        </Typography>
      </Box>
    );
  }

  if (!data?.companies) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Typography>Нет данных о компаниях</Typography>
      </Box>
    );
  }

  const totalPages = Math.ceil(data.total / rowsPerPage);
  const paginatedCompanies = data.companies.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsModalOpen(true)}
        >
          Добавить компанию
        </Button>
      </Box>

      <CompaniesTable
        companies={paginatedCompanies}
        developerMode={developerMode}
        onRowClick={(companyId) => navigate(`/companies/${companyId}`)}
      />

      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
          showFirstButton
          showLastButton
        />
      </Box>

      <AddCompanyModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </Box>
  );
};
