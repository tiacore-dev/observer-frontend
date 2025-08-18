// Файл: addScheduleModal.tsx
"use client";

import React from "react";
import { useMediaQuery, Theme } from "@mui/material";
import { AddScheduleModalDesktop } from "./desktop/addScheduleModalDesktop";
import { AddScheduleModalMobile } from "./mobile/addScheduleModalMobile";

interface AddScheduleModalProps {
  open: boolean;
  onClose: () => void;
}

export const AddScheduleModal: React.FC<AddScheduleModalProps> = (props) => {
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );

  return isMobile ? (
    <AddScheduleModalMobile {...props} />
  ) : (
    <AddScheduleModalDesktop {...props} />
  );
};
