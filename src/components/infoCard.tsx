import type React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { Info, Warning, CheckCircle } from "@mui/icons-material";

interface InfoCardProps {
  type: "info" | "warning" | "success";
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const InfoCard: React.FC<InfoCardProps> = ({
  type,
  title,
  description,
  action,
}) => {
  const getIcon = () => {
    switch (type) {
      case "info":
        return <Info sx={{ color: "#3b82f6" }} />;
      case "warning":
        return <Warning sx={{ color: "#f59e0b" }} />;
      case "success":
        return <CheckCircle sx={{ color: "#10b981" }} />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case "info":
        return {
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59, 130, 246, 0.04)",
          iconBg: "rgba(59, 130, 246, 0.1)",
        };
      case "warning":
        return {
          borderColor: "#f59e0b",
          backgroundColor: "rgba(245, 158, 11, 0.04)",
          iconBg: "rgba(245, 158, 11, 0.1)",
        };
      case "success":
        return {
          borderColor: "#10b981",
          backgroundColor: "rgba(16, 185, 129, 0.04)",
          iconBg: "rgba(16, 185, 129, 0.1)",
        };
    }
  };

  const styles = getStyles();

  return (
    <Card
      sx={{
        mb: 2,
        borderLeft: 4,
        borderLeftColor: styles.borderColor,
        backgroundColor: styles.backgroundColor,
        border: "1px solid",
        borderColor: `${styles.borderColor}20`,
        "&:hover": {
          boxShadow: `0 4px 12px ${styles.borderColor}15`,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              borderRadius: "10px",
              backgroundColor: styles.iconBg,
              flexShrink: 0,
            }}
          >
            {getIcon()}
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, mb: 1, color: "#1e293b" }}
            >
              {title}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#64748b", lineHeight: 1.6 }}
            >
              {description}
            </Typography>
            {action && <Box sx={{ mt: 2 }}>{action}</Box>}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
