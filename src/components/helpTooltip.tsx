import type React from "react";
import { Tooltip, IconButton } from "@mui/material";
import { Help } from "@mui/icons-material";

interface HelpTooltipProps {
  title: string;
  placement?: "top" | "bottom" | "left" | "right";
  size?: "small" | "medium";
}

export const HelpTooltip: React.FC<HelpTooltipProps> = ({
  title,
  placement = "top",
  size = "small",
}) => {
  return (
    <Tooltip title={title} placement={placement} arrow>
      <IconButton size={size} sx={{ ml: 0.5, color: "text.secondary" }}>
        <Help fontSize="small" />
      </IconButton>
    </Tooltip>
  );
};
