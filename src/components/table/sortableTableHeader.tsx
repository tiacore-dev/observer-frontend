import React from "react";
import { TableCell, TableSortLabel } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";

interface SortableTableHeaderProps<T extends string> {
  field: T;
  currentSortField: T;
  sortDirection: "asc" | "desc";
  onSort: (field: T) => void;
  label: string;
  defaultDirection?: "asc" | "desc";
}

export function SortableTableHeader<T extends string>({
  field,
  currentSortField,
  sortDirection,
  onSort,
  label,
  defaultDirection = "asc",
}: SortableTableHeaderProps<T>) {
  const getSortIcon = () => {
    if (currentSortField !== field) return <UnfoldMoreIcon fontSize="small" />;
    return sortDirection === "asc" ? (
      <ArrowUpwardIcon fontSize="small" />
    ) : (
      <ArrowDownwardIcon fontSize="small" />
    );
  };

  return (
    <TableCell
      sortDirection={currentSortField === field ? sortDirection : false}
      sx={{
        minWidth: 150, // Установите минимальную ширину для заголовков
        width: "auto", // Или фиксированную ширину
      }}
    >
      <TableSortLabel
        active={currentSortField === field}
        direction={
          currentSortField === field ? sortDirection : defaultDirection
        }
        onClick={() => onSort(field)}
        IconComponent={() => getSortIcon()}
        sx={{
          "& .MuiTableSortLabel-icon": {
            opacity: 1,
          },
        }}
      >
        {label}
      </TableSortLabel>
    </TableCell>
  );
}
