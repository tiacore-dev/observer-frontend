import React, { useState, useEffect } from "react";
import { useCompaniesQuery } from "../../hooks/companies/useCompaniesQuery";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Box,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Pagination,
  SelectChangeEvent,
  TableSortLabel,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";

export const CompaniesPage: React.FC = () => {
  const { data, isLoading, error } = useCompaniesQuery();
  const navigate = useNavigate();

  // Состояния для пагинации
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const totalPages = data ? Math.ceil(data.total / rowsPerPage) : 0;
  const paginatedCompanies = data?.companies.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

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

  return (
    <Box sx={{ p: 3 }}>
      {/* Фильтры */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/companies/add")}
        >
          Добавить компанию
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="companies table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Название</TableCell>
              <TableCell>Описание</TableCell>
            </TableRow>
          </TableHead>

          {/* <TableBody>
            {paginatedCompanies.map((company) => (
              <TableRow
                key={company.company_id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {company.company_id}
                </TableCell>
                <TableCell>{company.company_name}</TableCell>
                <TableCell>{company.description || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody> */}
        </Table>
      </TableContainer>

      {/* Пагинация */}
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

      {/* Информация о количестве записей */}
      {/* <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
        Показано {paginatedCompanies.length} из {data?.total} записей
      </Typography> */}
    </Box>
  );
};
