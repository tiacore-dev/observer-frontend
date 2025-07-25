import React from "react";
import {
  Box,
  Pagination,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
  Stack,
  SelectChangeEvent,
} from "@mui/material";

interface PaginationControlsProps {
  count: number;
  page: number;
  onPageChange: (page: number) => void;
  rowsPerPage: number;
  onRowsPerPageChange: (rowsPerPage: number) => void;
  totalItems?: number;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  count,
  page,
  onPageChange,
  rowsPerPage,
  onRowsPerPageChange,
  totalItems,
}) => {
  const handleRowsPerPageChange = (event: SelectChangeEvent<number>) => {
    onRowsPerPageChange(Number(event.target.value));
  };

  const getPaginationLabel = () => {
    if (!totalItems) return null;
    const start = (page - 1) * rowsPerPage + 1;
    const end = Math.min(page * rowsPerPage, totalItems);
    return `Показано ${start}-${end} из ${totalItems}`;
  };

  return (
    <Stack
      direction="row"
      spacing={2}
      alignItems="center"
      justifyContent="space-between"
      sx={{
        mt: 3,
        px: 2,
        py: 1,
        backgroundColor: "background.paper",
        borderRadius: 1,
        width: "100%",
      }}
    >
      <Box display="flex" alignItems="center" gap={2}>
        <Typography variant="body2" color="text.secondary">
          Строк на странице:
        </Typography>

        <FormControl size="small" sx={{ minWidth: 80 }}>
          <Select
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            variant="outlined"
            sx={{
              "& .MuiSelect-select": {
                py: 1,
              },
            }}
          >
            {[10, 25, 50, 100].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* {totalItems && (
          <Typography variant="body2" color="text.secondary">
            {getPaginationLabel()}
          </Typography>
        )} */}
      </Box>

      <Pagination
        count={count}
        page={page}
        onChange={(_, value) => onPageChange(value)}
        color="primary"
        shape="rounded"
        showFirstButton
        showLastButton
        sx={{
          "& .MuiPaginationItem-root": {
            fontSize: "0.875rem",
          },
        }}
      />
    </Stack>
  );
};
