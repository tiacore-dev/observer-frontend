import React, { useEffect, useState } from "react";
import { useCompaniesQuery } from "../../hooks/companies/useCompaniesQuery";
import {
  Paper,
  CircularProgress,
  Typography,
  Box,
  Button,
  Pagination,
  Tooltip,
  Autocomplete,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import { AddCompanyModal } from "./addCompanyModal";
import { PageProps } from "../../App";
import { CompaniesTable } from "./companiesTable";
import { useNavigate, useParams } from "react-router-dom";
import { CompanyDetailsPage } from "./companyDetailsPage";
import { PageSkeleton } from "../../components/skeleton/pageSkeleton";
import { ResetFiltersButton } from "../../components/table/resetFiltersButton";
import { PaginationControls } from "../../components/table/paginationControls";

export const CompaniesPage: React.FC<PageProps> = ({ developerMode }) => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useCompaniesQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [companyFilter, setCompanyFilter] = useState("");
  const [companySelectFilter, setCompanySelectFilter] = useState("");
  const [sortField, setSortField] = useState<"company_name" | "description">(
    "company_name"
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const rowsPerPage = 10;

  const resetAllFilters = () => {
    setCompanyFilter("");
    setCompanySelectFilter("");
    setSortField("company_name");
    setSortDirection("asc");
    setPage(1);
  };

  const companyNames = Array.from(
    new Set(data?.companies?.map((company) => company.company_name) || [])
  );

  const getFilteredAndSortedCompanies = () => {
    if (!data?.companies) return [];

    let filteredCompanies = [...data.companies];

    if (companyFilter || companySelectFilter) {
      const companyFilterValue = companySelectFilter || companyFilter;
      filteredCompanies = filteredCompanies.filter((company) =>
        company.company_name
          .toLowerCase()
          .includes(companyFilterValue.toLowerCase())
      );
    }

    filteredCompanies.sort((a, b) => {
      // Используем нулевой coalescing оператор для обработки возможных undefined значений
      const aValue = a[sortField] ?? "";
      const bValue = b[sortField] ?? "";

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return filteredCompanies;
  };

  const handleSort = (field: "company_name" | "description") => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredCompanies = getFilteredAndSortedCompanies();
  const totalPages = Math.ceil(filteredCompanies.length / rowsPerPage);
  const paginatedCompanies = filteredCompanies.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  useEffect(() => {
    setPage(1);
  }, [companyFilter, companySelectFilter, sortField, sortDirection]);

  if (companyId) {
    return (
      <CompanyDetailsPage companyId={companyId} developerMode={developerMode} />
    );
  }

  if (isLoading) {
    return <PageSkeleton filterCount={1} pagination hasAddButton={true} />;
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

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 3,
          flexWrap: "wrap",
          width: "100%", // Добавлено для полной ширины
        }}
      >
        <Autocomplete
          freeSolo
          options={companyNames}
          value={companySelectFilter || companyFilter}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Поиск по компании"
              variant="outlined"
              size="small"
              onChange={(e) => {
                setCompanyFilter(e.target.value);
                setCompanySelectFilter("");
              }}
            />
          )}
          onChange={(_, value) => {
            setCompanySelectFilter(value || "");
            setCompanyFilter("");
          }}
          sx={{ width: 250 }}
        />

        <ResetFiltersButton onClick={resetAllFilters} />
        <Box sx={{ flexGrow: 1 }} />

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
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
        onRowClick={(companyId) => navigate(`/companies/${companyId}`)}
      />

      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <PaginationControls
          count={totalPages}
          page={page}
          onPageChange={setPage}
        />
      </Box>

      <AddCompanyModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </Box>
  );
};
