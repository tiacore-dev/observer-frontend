"use client";

import type React from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Add, PlayArrow, Info } from "@mui/icons-material";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionText: string;
  onAction: () => void;
  tips?: string[];
  secondaryAction?: {
    text: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
  tips,
  secondaryAction,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 400,
        textAlign: "center",
        p: 4,
      }}
    >
      <Box sx={{ mb: 3, color: "primary.main", opacity: 0.7 }}>{icon}</Box>

      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ fontWeight: "bold" }}
      >
        {title}
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ mb: 4, maxWidth: 500 }}
      >
        {description}
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={onAction}
          size="large"
        >
          {actionText}
        </Button>
        {secondaryAction && (
          <Button
            variant="outlined"
            startIcon={<Info />}
            onClick={secondaryAction.onClick}
            size="large"
          >
            {secondaryAction.text}
          </Button>
        )}
      </Box>

      {tips && tips.length > 0 && (
        <Card sx={{ maxWidth: 600, width: "100%" }}>
          <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <Info color="primary" />
              Полезные советы
            </Typography>
            <List dense>
              {tips.map((tip, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <PlayArrow color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={tip} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};
