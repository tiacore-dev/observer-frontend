import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Skeleton,
} from "@mui/material";

interface TableSkeletonProps {
  columns: number;
  rows?: number;
  includeHeaders?: boolean;
  developerMode?: boolean;
  additionalColumns?: number;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  columns,
  rows = 5,
  includeHeaders = true,
  developerMode = false,
  additionalColumns = 0,
}) => {
  const totalColumns = developerMode ? columns + additionalColumns : columns;

  return (
    <TableContainer component={Paper}>
      <Table>
        {includeHeaders && (
          <TableHead>
            <TableRow>
              {developerMode && (
                <TableCell>
                  <Skeleton variant="text" />
                </TableCell>
              )}
              {Array.from({ length: columns }).map((_, index) => (
                <TableCell key={`header-${index}`}>
                  <Skeleton variant="text" />
                </TableCell>
              ))}
              {additionalColumns > 0 &&
                Array.from({ length: additionalColumns }).map((_, index) => (
                  <TableCell key={`additional-header-${index}`}>
                    <Skeleton variant="text" />
                  </TableCell>
                ))}
            </TableRow>
          </TableHead>
        )}
        <TableBody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <TableRow key={`row-${rowIndex}`}>
              {developerMode && (
                <TableCell>
                  <Skeleton variant="text" />
                </TableCell>
              )}
              {Array.from({ length: columns }).map((_, colIndex) => (
                <TableCell key={`cell-${rowIndex}-${colIndex}`}>
                  <Skeleton variant="text" />
                </TableCell>
              ))}
              {additionalColumns > 0 &&
                Array.from({ length: additionalColumns }).map((_, colIndex) => (
                  <TableCell key={`additional-cell-${rowIndex}-${colIndex}`}>
                    <Skeleton variant="text" />
                  </TableCell>
                ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
