"use client";

import React from "react";
import { SchedulesTableDesktop } from "./desktop/schedulesTableDesktop";
import { SchedulesMobileView } from "./mobile/schedulesMobileView";
import { useMediaQuery } from "@mui/material";
import type { ISchedule } from "../../api/schedulesApi";

type SortField =
  | "bot_id"
  | "enabled"
  | "company_id"
  | "created_at"
  | "last_run_at"
  | "schedule_strategy"
  | "schedule_type";

interface SchedulesTableProps {
  schedules: ISchedule[];
  developerMode: boolean;
  isSuperadmin: boolean;
  sortField: SortField;
  sortDirection: "asc" | "desc";
  onSort: (field: SortField) => void;
  isLoading?: boolean;
}

export const SchedulesTable: React.FC<SchedulesTableProps> = (props) => {
  const isMobile = useMediaQuery("(max-width:600px)");

  if (isMobile) {
    return <SchedulesMobileView {...props} />;
  }

  return <SchedulesTableDesktop {...props} />;
};
