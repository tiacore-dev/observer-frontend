"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useCompaniesQuery } from "../../hooks/companies/useCompaniesQuery";
import {
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  Alert,
  useMediaQuery,
  Theme,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import BusinessIcon from "@mui/icons-material/Business";
import SearchIcon from "@mui/icons-material/Search";
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
  setRowsPerPage,
  setSortField,
  setSortDirection,
  resetFilters,
} from "../../redux/slice/companiesSlice";
import { useThemeMode } from "../../context/themeContext";

export const CompaniesPage: React.FC<PageProps> = ({ developerMode }) => {
  const theme = useThemeMode();
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );

  const { companyId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useCompaniesQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const dispatch = useDispatch();

  const { nameFilter, page, rowsPerPage, sortField, sortDirection } =
    useSelector((state: RootState) => state.companies);

  const resetAllFilters = () => {
    dispatch(resetFilters());
  };

  const filteredCompanies = useMemo(() => {
    if (!data?.companies) return [];

    let filtered = [...data.companies];

    if (nameFilter) {
      filtered = filtered.filter((company) =>
        company.company_name.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }

    return filtered.sort((a, b) => {
      const aValue = a[sortField] ?? "";
      const bValue = b[sortField] ?? "";
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });
  }, [data, nameFilter, sortField, sortDirection]);

  const totalItems = filteredCompanies.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const paginatedCompanies = useMemo(() => {
    return filteredCompanies.slice(
      (currentPage - 1) * rowsPerPage,
      currentPage * rowsPerPage
    );
  }, [filteredCompanies, currentPage, rowsPerPage]);

  useEffect(() => {
    if (page !== currentPage) {
      dispatch(setPage(currentPage));
    }
  }, [page, currentPage, dispatch]);

  const handleSort = (field: "company_name" | "description") => {
    if (sortField === field) {
      dispatch(setSortDirection(sortDirection === "asc" ? "desc" : "asc"));
    } else {
      dispatch(setSortField(field));
      dispatch(setSortDirection("asc"));
    }
  };

  const handlePageChange = (newPage: number) => {
    dispatch(setPage(Math.max(1, Math.min(newPage, totalPages))));
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    const newTotalPages = Math.max(1, Math.ceil(totalItems / newRowsPerPage));
    dispatch(setRowsPerPage(newRowsPerPage));
    dispatch(setPage(Math.min(currentPage, newTotalPages)));
  };

  if (companyId) {
    return (
      <CompanyDetailsPage companyId={companyId} developerMode={developerMode} />
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" mt={-1}>
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
    <Box
      sx={{
        pl: isMobile ? 1 : 2,
        pr: isMobile ? 1 : 2,
        mt: -1,
        mb: -2,
        maxWidth: 1600,
        mx: "auto",
      }}
    >
      {isLoading ? (
        <PageSkeleton filterCount={1} pagination={true} hasAddButton={true} />
      ) : (
        <>
          <Paper
            elevation={1}
            sx={{
              p: isMobile ? 2 : 3,
              mb: 1,
              background: theme.isDarkMode
                ? "linear-gradient(135deg, #6366f1aa 0%, #8b5cf6aa 100%)"
                : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <BusinessIcon sx={{ fontSize: isMobile ? 32 : 40 }} />
              <Box>
                <Typography
                  variant={isMobile ? "h5" : "h4"}
                  component="h1"
                  gutterBottom
                  sx={{ mb: 1, fontWeight: 600 }}
                  color="white"
                >
                  Компании
                </Typography>
                {/* {!isMobile && ( */}
                <Typography variant="body1" sx={{ opacity: 0.9 }} color="white">
                  Просмотр и управление компаниями. Используйте их, чтобы
                  группировать чаты и отчёты по направлениям бизнеса, отделам
                  или темам.
                </Typography>
                {/* )} */}
              </Box>
            </Box>
          </Paper>

          <Paper elevation={1} sx={{ p: isMobile ? 1 : 2, mb: 1 }}>
            <Box
              sx={{
                display: "flex",
                gap: 1,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              {isMobile ? (
                <>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <IconButton onClick={() => setSearchOpen(!searchOpen)}>
                      <SearchIcon />
                    </IconButton>
                    <ResetFiltersButton onClick={resetAllFilters} />
                  </Box>
                  <Box sx={{ flexGrow: 1 }} />
                  <Button
                    variant="contained"
                    onClick={() => setIsModalOpen(true)}
                    startIcon={<AddIcon />}
                    size="small"
                    sx={{
                      whiteSpace: "nowrap",
                      backgroundColor: "#7353ae",
                      "& .MuiButton-startIcon": {
                        // marginRight: 0.5,
                      },
                    }}
                  >
                    Добавить
                  </Button>
                </>
              ) : (
                <>
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
                </>
              )}
            </Box>
            {isMobile && searchOpen && (
              <Paper
                sx={{
                  mt: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  backgroundColor: "background.paper",
                }}
              >
                <TextField
                  fullWidth
                  label="Поиск компании"
                  variant="outlined"
                  size="small"
                  value={nameFilter}
                  onChange={(e) => dispatch(setNameFilter(e.target.value))}
                  placeholder="Введите название"
                />
              </Paper>
            )}
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
              <PaginationControls
                count={totalPages}
                page={currentPage}
                onPageChange={handlePageChange}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleRowsPerPageChange}
                totalItems={totalItems}
              />
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
                  : "Добавьте первую компанию"}
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
