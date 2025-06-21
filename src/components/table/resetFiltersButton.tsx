// src/components/ResetFiltersButton.tsx
import React from "react";
import { Button, Tooltip } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

interface ResetFiltersButtonProps {
  onClick: () => void;
}

export const ResetFiltersButton: React.FC<ResetFiltersButtonProps> = ({
  onClick,
}) => {
  return (
    <Tooltip title="Сбросить все фильтры и сортировку">
      <Button
        onClick={onClick}
        color="primary"
        sx={{
          border: "1px solid rgba(0, 0, 0, 0.23)",
          borderRadius: 1,
          padding: "8px",
          "&:hover": {
            backgroundColor: "action.hover",
          },
        }}
      >
        <ClearIcon />
        Сбросить
      </Button>
    </Tooltip>
  );
};
