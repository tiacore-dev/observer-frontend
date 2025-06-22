import React from "react";
import { Box, Skeleton } from "@mui/material";

interface DetailsPageSkeletonProps {
  developerMode?: boolean;
  buttonCount?: number; // Новый пропс для количества кнопок
}

export const DetailsPageSkeleton: React.FC<DetailsPageSkeletonProps> = ({
  developerMode = false,
  buttonCount = 1, // Значение по умолчанию - 1 кнопка
}) => {
  return (
    <Box sx={{ p: 3 }}>
      {/* Кнопка "Назад" */}
      <Box sx={{ display: "flex", justifyContent: "start", mb: 2, gap: 1 }}>
        {[...Array(buttonCount)].map((_, i) => (
          <Skeleton
            key={`button-${i}`}
            variant="rectangular"
            width={120}
            height={36}
            sx={{ borderRadius: 1 }}
          />
        ))}
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
