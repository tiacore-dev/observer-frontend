import React from "react";
import {
  Box,
  Pagination,
  MenuItem,
  Select,
  FormControl,
  Typography,
  Stack,
  SelectChangeEvent,
  useMediaQuery,
  Theme,
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
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );

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
      direction={isMobile ? "column" : "row"}
      spacing={isMobile ? 1 : 2}
      alignItems="center"
      justifyContent="space-between"
      sx={{
        mt: 2,
        px: isMobile ? 1 : 2,
        py: 1,
        backgroundColor: "background.paper",
        borderRadius: 1,
        width: "100%",
      }}
    >
      {!isMobile && (
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
        </Box>
      )}

      <Pagination
        count={count}
        page={page}
        onChange={(_, value) => onPageChange(value)}
        color="primary"
        shape="rounded"
        showFirstButton={!isMobile}
        showLastButton={!isMobile}
        siblingCount={isMobile ? 0 : 1}
        boundaryCount={isMobile ? 1 : 2}
        size={isMobile ? "small" : "medium"}
        sx={{
          "& .MuiPaginationItem-root": {
            fontSize: "0.875rem",
          },
        }}
      />

      {isMobile && (
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
                {option} на странице
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </Stack>
  );
};
