import React from "react";
import { Box, Pagination } from "@mui/material";

interface PaginationControlsProps {
  count: number;
  page: number;
  onPageChange: (page: number) => void;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  count,
  page,
  onPageChange,
}) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
      <Pagination
        count={count}
        page={page}
        onChange={(_, value) => onPageChange(value)}
        color="primary"
        showFirstButton
        showLastButton
      />
    </Box>
  );
};
