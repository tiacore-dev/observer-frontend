import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Skeleton,
  Box,
  Button,
} from "@mui/material";

interface ModalSkeletonProps {
  fieldCount?: number;
  hasActions?: boolean;
}

export const ModalSkeleton: React.FC<ModalSkeletonProps> = ({
  fieldCount = 4,
  hasActions = true,
}) => {
  return (
    <Dialog open maxWidth="sm" fullWidth>
      <DialogTitle>
        <Skeleton variant="text" width="60%" sx={{ borderRadius: 1 }} />
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          {Array.from({ length: fieldCount }).map((_, index) => (
            <Skeleton
              key={`modal-skeleton-field-${index}`}
              variant="rectangular"
              height={56}
              sx={{ borderRadius: 1 }}
            />
          ))}
        </Box>
      </DialogContent>
      {hasActions && (
        <DialogActions>
          <Skeleton
            variant="rectangular"
            width={64}
            height={36}
            sx={{ borderRadius: 1 }}
          />
          <Skeleton
            variant="rectangular"
            width={96}
            height={36}
            sx={{ borderRadius: 1 }}
          />
        </DialogActions>
      )}
    </Dialog>
  );
};
