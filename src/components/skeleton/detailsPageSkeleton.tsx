import React from "react";
import { Box, Skeleton } from "@mui/material";

interface DetailsPageSkeletonProps {
  developerMode?: boolean;
}

export const DetailsPageSkeleton: React.FC<DetailsPageSkeletonProps> = ({
  developerMode = false,
}) => {
  return (
    <Box sx={{ p: 3 }}>
      {/* Кнопка "Назад" */}
      <Box sx={{ display: "flex", justifyContent: "start", mb: 2 }}>
        <Skeleton
          variant="rectangular"
          width={120}
          height={36}
          sx={{ borderRadius: 1 }}
        />
      </Box>

      {/* Основной контент */}
      <Box sx={{ p: 3 }}>
        {/* Заголовок */}
        <Skeleton
          variant="text"
          width="40%"
          height={40}
          sx={{ mb: 2, borderRadius: 1 }}
        />

        {/* Основные поля */}
        {[...Array(4)].map((_, i) => (
          <Box key={`field-${i}`} sx={{ mt: 2 }}>
            <Skeleton
              variant="text"
              width="30%"
              height={30}
              sx={{ borderRadius: 1 }}
            />
            <Skeleton
              variant="text"
              width="80%"
              height={24}
              sx={{ borderRadius: 1 }}
            />
          </Box>
        ))}

        {/* Дополнительные поля для developerMode */}
        {developerMode && (
          <>
            {[...Array(5)].map((_, i) => (
              <Box key={`dev-field-${i}`} sx={{ mt: 2 }}>
                <Skeleton
                  variant="text"
                  width="30%"
                  height={30}
                  sx={{ borderRadius: 1 }}
                />
                <Skeleton
                  variant="text"
                  width="80%"
                  height={24}
                  sx={{ borderRadius: 1 }}
                />
              </Box>
            ))}
          </>
        )}
      </Box>
    </Box>
  );
};
