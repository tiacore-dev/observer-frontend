"use client";

import type React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  Paper,
  IconButton,
} from "@mui/material";
import {
  Close,
  NavigateNext,
  NavigateBefore,
  PlayArrow,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

interface TourStep {
  title: string;
  content: string;
  target?: string;
  action?: () => void;
  actionText?: string;
  route?: string;
}

interface GuidedTourProps {
  open: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const GuidedTour: React.FC<GuidedTourProps> = ({
  open,
  onClose,
  onComplete,
}) => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  const tourSteps: TourStep[] = [
    {
      title: "Добро пожаловать в Observer!",
      content:
        "Давайте проведем быстрый тур по системе. Это займет всего 2-3 минуты и поможет вам быстро освоиться.",
    },
    {
      title: "Шаг 1: Создание компании",
      content:
        "Компания - это ваше рабочее пространство. Здесь вы будете управлять ботами, промптами и расписаниями. Начните с создания первой компании.",
      // route: "/companies",
      // actionText: "Перейти к компаниям",
    },
    {
      title: "Шаг 2: Добавление бота",
      content:
        "Telegram-боты - это основа системы. Они отправляют сообщения по расписанию. Создайте бота через @BotFather в Telegram и не забудьте добавить его в необходимые чаты.",
      // route: "/bots",
      // actionText: "Управление ботами",
    },
    {
      title: "Шаг 3: Создание промптов",
      content:
        "Промпт — это инструкция для ИИ, которая объясняет, как анализировать сообщения, какие данные искать. Чем точнее инструкция, тем лучше результат анализа.",
      // route: "/prompts",
      // actionText: "Создать промпт",
    },
    {
      title: "Шаг 4: Настройка расписаний",
      content:
        "Расписания связывают ботов, промпты и чаты. Здесь вы настраиваете, когда и куда отправлять результаты анализов чатов или напоминания.",
      // route: "/schedules",
      // actionText: "Настроить расписание",
    },
    {
      title: "Готово!",
      content:
        "Теперь вы знаете основы работы с Observer. Используйте раздел 'Справка' для получения подробной информации. Удачи!",
      route: "/help",
      actionText: "Открыть справку",
    },
  ];

  const handleNext = () => {
    if (activeStep < tourSteps.length - 1) {
      setActiveStep(activeStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleComplete = () => {
    onComplete();
    onClose();
  };

  const handleStepAction = () => {
    const currentStep = tourSteps[activeStep];
    if (currentStep.route) {
      navigate(currentStep.route);
      onClose();
    }
    if (currentStep.action) {
      currentStep.action();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 1,
          backgroundColor: "white",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <DialogContent sx={{ p: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 3,
          }}
        >
          <Typography
            variant="h5"
            component="h2"
            sx={{ fontWeight: "bold", color: "text.primary" }}
          >
            {tourSteps[activeStep].title}
          </Typography>
          <IconButton onClick={onClose} sx={{ color: "text.secondary" }}>
            <Close />
          </IconButton>
        </Box>

        <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
          {tourSteps.map((step, index) => (
            <Step key={index}>
              <StepLabel
                sx={{
                  "& .MuiStepLabel-label": { color: "text.secondary" },
                  "& .MuiStepLabel-label.Mui-active": { color: "text.primary" },
                  "& .MuiStepIcon-root": { color: "action.disabled" },
                  "& .MuiStepIcon-root.Mui-active": { color: "primary.main" },
                }}
              />
            </Step>
          ))}
        </Stepper>

        <Paper
          sx={{
            p: 3,
            mb: 3,
            backgroundColor: "background.paper",
            color: "text.primary",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
            {tourSteps[activeStep].content}
          </Typography>
        </Paper>

        {tourSteps[activeStep].actionText && (
          <Button
            variant="contained"
            startIcon={<PlayArrow />}
            onClick={handleStepAction}
            sx={{
              mb: 2,
              backgroundColor: "primary.main",
              color: "primary.contrastText",
              "&:hover": { backgroundColor: "primary.dark" },
            }}
            fullWidth
          >
            {tourSteps[activeStep].actionText}
          </Button>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={onClose} sx={{ color: "text.secondary" }}>
          Пропустить тур
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          onClick={handleBack}
          disabled={activeStep === 0}
          startIcon={<NavigateBefore />}
          sx={{ color: "text.secondary" }}
        >
          Назад
        </Button>
        <Button
          onClick={handleNext}
          variant="contained"
          endIcon={
            activeStep === tourSteps.length - 1 ? undefined : <NavigateNext />
          }
          sx={{
            backgroundColor: "primary.main",
            color: "primary.contrastText",
            "&:hover": { backgroundColor: "primary.dark" },
          }}
        >
          {activeStep === tourSteps.length - 1 ? "Завершить" : "Далее"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
