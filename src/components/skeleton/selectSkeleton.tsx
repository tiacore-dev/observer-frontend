// src/components/skeleton/selectSkeleton.tsx
import React from "react";
import { Skeleton } from "@mui/material";

export const SelectSkeleton = () => {
  return (
    <Skeleton
      variant="rectangular"
      height={56}
      sx={{ width: "100%", borderRadius: 1 }}
    />
  );
};
