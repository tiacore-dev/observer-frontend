// Файл: EditScheduleModal.tsx
"use client";

import React from "react";
import { useMediaQuery, useTheme } from "@mui/material";
import { EditScheduleModalMobile } from "./mobile/editScheduleModalMobile";
import { EditScheduleModalDesktop } from "./desktop/editScheduleModalDesktop";
import { ISchedule, IScheduleEdit } from "../../api/schedulesApi";

interface EditScheduleModalProps {
  open: boolean;
  onClose: () => void;
  schedule: ISchedule;
  onUpdate: (data: {
    schedule_id: string;
    updatedData: Partial<IScheduleEdit>;
  }) => Promise<void>;
  isSubmitting: boolean;
}

export const EditScheduleModal: React.FC<EditScheduleModalProps> = (props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return isMobile ? (
    <EditScheduleModalMobile {...props} />
  ) : (
    <EditScheduleModalDesktop {...props} />
  );
};
