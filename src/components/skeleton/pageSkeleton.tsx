import React from "react";
import { Box, Skeleton, Pagination } from "@mui/material";

interface PageSkeletonProps {
  filterCount?: number; // Количество элементов фильтра
  tableHeight?: number | string; // Высота таблицы
  pagination?: boolean; // Показывать ли пагинацию
}

export const PageSkeleton: React.FC<PageSkeletonProps> = ({
  filterCount = 3,
  tableHeight = 200,
  pagination = true,
}) => {
  return (
    <Box sx={{ p: 3 }}>
      {/* Скелетоны для фильтров */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 3,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {Array.from({ length: filterCount }).map((_, index) => (
          <Skeleton
            key={`filter-skeleton-${index}`}
            variant="rectangular"
            width={200}
            height={40}
          />
        ))}
      </Box>

      {/* Скелетон для таблицы */}
      <Skeleton variant="rectangular" width="100%" height={tableHeight} />

      {/* Скелетон для пагинации */}
      {pagination && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Skeleton variant="rectangular" width={200} height={32} />
        </Box>
      )}
    </Box>
  );
};
