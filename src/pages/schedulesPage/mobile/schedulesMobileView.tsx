"use client";

import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import { Schedule as ScheduleIcon } from "@mui/icons-material";
import type { ISchedule } from "../../../api/schedulesApi";
import { ScheduleCard } from "./schedulesMobileCard";
import { useToggleSchedule } from "../../../hooks/schedules/useScheduleMutations";

interface SchedulesMobileViewProps {
  schedules: ISchedule[];
  developerMode: boolean;
  isSuperadmin: boolean;
  isLoading?: boolean;
}

export const SchedulesMobileView: React.FC<SchedulesMobileViewProps> = ({
  schedules,
  developerMode,
  isSuperadmin,
  isLoading = false,
}) => {
  const toggleScheduleMutation = useToggleSchedule();

  const handleToggle = async (scheduleId: string) => {
    try {
      await toggleScheduleMutation.mutateAsync(scheduleId);
    } catch (error) {
      console.error("Error toggling schedule:", error);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {[1, 2, 3].map((i) => (
          <Paper key={i} sx={{ p: 2, borderRadius: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box sx={{ width: "100%" }}>
                <Box
                  sx={{ mb: 2, width: "60%", height: 24, bgcolor: "grey.200" }}
                />
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {[1, 2, 3].map((j) => (
                    <Box
                      key={j}
                      sx={{
                        width: 80,
                        height: 24,
                        bgcolor: "grey.200",
                        borderRadius: 1,
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Box>
          </Paper>
        ))}
      </Box>
    );
  }

  if (schedules.length === 0) {
    return (
      <Paper elevation={1} sx={{ p: 2, textAlign: "center", mb: 1 }}>
        <ScheduleIcon sx={{ fontSize: 64, color: "text.secondary", mt: 2 }} />
        <Typography variant="h6" gutterBottom color="text.secondary">
          Нет доступных расписаний
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Создайте первое расписание
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper style={{ backgroundColor: "#efeef5" }}>
      {schedules.map((schedule) => (
        <ScheduleCard
          key={schedule.schedule_id}
          schedule={schedule}
          developerMode={developerMode}
          isSuperadmin={isSuperadmin}
          onToggle={handleToggle}
        />
      ))}
    </Paper>
  );
};
