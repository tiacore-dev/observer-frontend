"use client";

import type React from "react";
import {
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Button,
} from "@mui/material";
import {
  CheckCircle,
  RadioButtonUnchecked,
  PlayArrow,
} from "@mui/icons-material";

interface SetupStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  action: () => void | Promise<void>;
  actionText: string;
}

interface SetupProgressProps {
  steps: SetupStep[];
  title?: string;
}

export const SetupProgress: React.FC<SetupProgressProps> = ({
  steps,
  title = "Прогресс настройки",
}) => {
  const completedSteps = steps.filter((step) => step.completed).length;
  const progress = (completedSteps / steps.length) * 100;

  const nextStep = steps.find((step) => !step.completed);

  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6" component="h2">
            {title}
          </Typography>
          <Chip
            label={`${completedSteps}/${steps.length}`}
            color={progress === 100 ? "success" : "primary"}
            variant={progress === 100 ? "filled" : "outlined"}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Завершено {Math.round(progress)}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {completedSteps} из {steps.length} шагов
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: "grey.200",
              "& .MuiLinearProgress-bar": {
                borderRadius: 4,
              },
            }}
          />
        </Box>

        <List dense>
          {steps.map((step) => (
            <ListItem
              key={step.id}
              sx={{
                border: 1,
                borderColor: step.completed ? "success.light" : "grey.300",
                borderRadius: 1,
                mb: 1,
                backgroundColor: step.completed
                  ? "success.50"
                  : "background.paper",
              }}
            >
              <ListItemIcon>
                {step.completed ? (
                  <CheckCircle color="success" />
                ) : (
                  <RadioButtonUnchecked
                    color={nextStep?.id === step.id ? "primary" : "disabled"}
                  />
                )}
              </ListItemIcon>
              <ListItemText
                primary={step.title}
                secondary={step.description}
                sx={{
                  "& .MuiListItemText-primary": {
                    fontWeight: step.completed ? "bold" : "normal",
                    color: step.completed ? "success.main" : "text.primary",
                  },
                }}
              />
              {!step.completed && nextStep?.id === step.id && (
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<PlayArrow />}
                  onClick={step.action}
                  sx={{ ml: 2 }}
                >
                  {step.actionText}
                </Button>
              )}
            </ListItem>
          ))}
        </List>

        {progress === 100 && (
          <Box
            sx={{
              mt: 2,
              p: 2,
              backgroundColor: "success.50",
              borderRadius: 1,
              textAlign: "center",
            }}
          >
            <Typography
              variant="body1"
              sx={{ fontWeight: "bold", color: "success.main" }}
            >
              🎉 Поздравляем! Настройка завершена
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ваша система готова к работе. Теперь вы можете создавать
              расписания и отправлять сообщения.
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
