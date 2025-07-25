// companiesPage.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useCompaniesQuery } from "../../hooks/companies/useCompaniesQuery";
import {
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  Alert,
  Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import BusinessIcon from "@mui/icons-material/Business";
import { AddCompanyModal } from "./addCompanyModal";
import type { PageProps } from "../../App";
import { CompaniesTable } from "./companiesTable";
import { useNavigate, useParams } from "react-router-dom";
import { CompanyDetailsPage } from "./companyDetailsPage";
import { PageSkeleton } from "../../components/skeleton/pageSkeleton";
import { ResetFiltersButton } from "../../components/table/resetFiltersButton";
import { PaginationControls } from "../../components/table/paginationControls";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import {
  setNameFilter,
  setPage,
  setSortField,
  setSortDirection,
  resetFilters,
} from "../../redux/slice/companiesSlice";

export const CompaniesPage: React.FC<PageProps> = ({ developerMode }) => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useCompaniesQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();

  const { nameFilter, page, sortField, sortDirection } = useSelector(
    (state: RootState) => state.companies
  );

  const rowsPerPage = 10;

  const resetAllFilters = () => {
    dispatch(resetFilters());
  };

  const getFilteredAndSortedCompanies = () => {
    if (!data?.companies) return [];

    let filteredCompanies = [...data.companies];

    if (nameFilter) {
      filteredCompanies = filteredCompanies.filter((company) =>
        company.company_name.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }

    filteredCompanies.sort((a, b) => {
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
      dispatch(setSortDirection(sortDirection === "asc" ? "desc" : "asc"));
    } else {
      dispatch(setSortField(field));
      dispatch(setSortDirection("asc"));
    }
  };

  const filteredCompanies = getFilteredAndSortedCompanies();
  const totalPages = Math.ceil(filteredCompanies.length / rowsPerPage);
  const paginatedCompanies = filteredCompanies.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  useEffect(() => {
    dispatch(setPage(1));
  }, [nameFilter, dispatch]);

  if (companyId) {
    return (
      <CompanyDetailsPage companyId={companyId} developerMode={developerMode} />
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Alert severity="error" sx={{ maxWidth: 600 }}>
          <Typography variant="h6" gutterBottom>
            Не удалось загрузить компании
          </Typography>
          <Typography variant="body2">
            Произошла ошибка при загрузке данных: {(error as Error).message}
          </Typography>
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ pl: 2, pr: 2, mt: -1, mb: -1, maxWidth: 1600, mx: "auto" }}>
      {isLoading ? (
        <PageSkeleton filterCount={1} pagination={true} hasAddButton={true} />
      ) : (
        <>
          <Paper
            elevation={1}
            sx={{
              p: 3,
              mb: 1,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <BusinessIcon sx={{ fontSize: 40 }} />
              <Box>
                <Typography
                  variant="h4"
                  component="h1"
                  gutterBottom
                  sx={{ mb: 1, fontWeight: 600 }}
                  color="white"
                >
                  Компании
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }} color="white">
                  Просмотр и управление компаниями. Используйте их, чтобы
                  группировать чаты и отчёты по направлениям бизнеса, отделам
                  или темам. Это поможет быстрее находить нужные данные.
                </Typography>
              </Box>
            </Box>
          </Paper>

          <Paper elevation={1} sx={{ p: 2, mb: 1 }}>
            <Box
              sx={{
                display: "flex",
                gap: 1,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <TextField
                label="Поиск по названию компании"
                variant="outlined"
                size="small"
                value={nameFilter}
                onChange={(e) => dispatch(setNameFilter(e.target.value))}
                placeholder="Например: My Company"
                sx={{ minWidth: 300 }}
              />

              <ResetFiltersButton onClick={resetAllFilters} />

              <Box sx={{ flexGrow: 1 }} />

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setIsModalOpen(true)}
                style={{ backgroundColor: "#7353ae" }}
              >
                Добавить компанию
              </Button>
            </Box>
          </Paper>

          <Paper elevation={1} sx={{ overflow: "hidden" }}>
            <CompaniesTable
              companies={paginatedCompanies}
              developerMode={developerMode}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
            />

            {totalPages > 1 && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mb: 3,
                  mt: 0,
                }}
              >
                <PaginationControls
                  count={totalPages}
                  page={page}
                  onPageChange={(newPage) => dispatch(setPage(newPage))}
                />
              </Box>
            )}
          </Paper>

          {filteredCompanies.length === 0 && !isLoading && (
            <Paper elevation={1} sx={{ p: 1, textAlign: "center", mb: 1 }}>
              <BusinessIcon
                sx={{ fontSize: 64, color: "text.secondary", mt: 2 }}
              />
              <Typography variant="h6" gutterBottom color="text.secondary">
                {nameFilter ? "Компании не найдены" : "Нет доступных компаний"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {nameFilter
                  ? "Попробуйте изменить параметры поиска"
                  : "Добавьте первую компанию, нажав на кнопку выше"}
              </Typography>
            </Paper>
          )}

          <AddCompanyModal
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </>
      )}
    </Box>
  );
};
