// src/components/skeleton/selectSkeleton.tsx
import React from "react";
import { Skeleton } from "@mui/material";

export const SelectSkeleton = ({ count = 5 }: { count?: number }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton
          key={index}
          variant="rectangular"
          height={56}
          sx={{ mb: 1, borderRadius: 1 }}
        />
      ))}
    </>
  );
};
