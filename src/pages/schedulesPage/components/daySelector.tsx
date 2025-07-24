import type React from "react";
import { Typography, Chip, Stack, Tooltip } from "@mui/material";
import { daysOfWeek } from "../helpers/scheduleUtils";

interface DaySelectorProps {
  selectedDays: number[];
  onToggleDay: (dayId: number) => void;
  disabled?: boolean;
  error?: string;
  tooltipMessage?: string;
}

export const DaySelector: React.FC<DaySelectorProps> = ({
  selectedDays,
  onToggleDay,
  disabled = false,
  error,
  tooltipMessage,
}) => {
  return (
    <>
      <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
        {daysOfWeek.map((day) => (
          <Tooltip
            key={day.id}
            title={disabled && tooltipMessage ? tooltipMessage : ""}
          >
            <span>
              <Chip
                label={day.name}
                color={selectedDays.includes(day.id) ? "primary" : "default"}
                onClick={() => !disabled && onToggleDay(day.id)}
                variant={selectedDays.includes(day.id) ? "filled" : "outlined"}
                disabled={disabled}
              />
            </span>
          </Tooltip>
        ))}
      </Stack>
      {error && (
        <Typography variant="caption" color="error">
          {error}
        </Typography>
      )}
    </>
  );
};
