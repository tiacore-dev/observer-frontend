import React from "react";
import { Box, Skeleton, Pagination } from "@mui/material";

interface PageSkeletonProps {
  filterCount?: number; // Количество элементов фильтра
  pagination?: boolean; // Показывать ли пагинацию
  hasAddButton?: boolean; // Показывать ли кнопку добавления
}

export const PageSkeleton: React.FC<PageSkeletonProps> = ({
  filterCount = 3,
  pagination = true,
  hasAddButton = true,
}) => {
  return (
    <Box sx={{ p: 3 }}>
      {/* Скелетоны для фильтров и кнопки добавления */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 3,
          flexWrap: "wrap",
          alignItems: "center",
          width: "100%",
        }}
      >
        {/* Фильтры */}
        {Array.from({ length: filterCount }).map((_, index) => (
          <Skeleton
            key={`filter-skeleton-${index}`}
            variant="rectangular"
            width={200}
            height={40}
          />
        ))}

        {/* Кнопка сброса фильтров */}
        <Skeleton variant="rectangular" width={120} height={40} />

        {/* Гибкий промежуток */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Кнопка добавления (если нужна) */}
        {hasAddButton && (
          <Skeleton variant="rectangular" width={150} height={40} />
        )}
      </Box>

      {/* Скелетон для таблицы */}
      <Skeleton variant="rectangular" width="100%" height={200} />

      {/* Скелетон для пагинации */}
      {pagination && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Skeleton variant="rectangular" width={200} height={32} />
        </Box>
      )}
    </Box>
  );
};
