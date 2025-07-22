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
      title: "Добро пожаловать в Observer! 🎉",
      content:
        "Давайте проведем быстрый тур по системе. Это займет всего 2-3 минуты и поможет вам быстро освоиться.",
    },
    {
      title: "Шаг 1: Создание компании",
      content:
        "Компания - это ваше рабочее пространство. Здесь вы будете управлять ботами, промптами и расписаниями. Начнем с создания первой компании.",
      route: "/companies",
      actionText: "Перейти к компаниям",
    },
    {
      title: "Шаг 2: Добавление бота",
      content:
        "Telegram-боты - это основа системы. Они отправляют сообщения по расписанию. Сначала создайте бота через @BotFather в Telegram.",
      route: "/bots",
      actionText: "Управление ботами",
    },
    {
      title: "Шаг 3: Создание промптов",
      content:
        "Промпты - это шаблоны сообщений. Вы можете использовать переменные типа {date}, {time} и форматирование Markdown.",
      route: "/prompts",
      actionText: "Создать промпт",
    },
    {
      title: "Шаг 4: Настройка расписаний",
      content:
        "Расписания связывают ботов, промпты и чаты. Здесь вы настраиваете, когда и куда отправлять сообщения.",
      route: "/schedules",
      actionText: "Настроить расписание",
    },
    {
      title: "Готово! 🚀",
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
          borderRadius: 3,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
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
          <Typography variant="h5" component="h2" sx={{ fontWeight: "bold" }}>
            {tourSteps[activeStep].title}
          </Typography>
          <IconButton onClick={onClose} sx={{ color: "white" }}>
            <Close />
          </IconButton>
        </Box>

        <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
          {tourSteps.map((step, index) => (
            <Step key={index}>
              <StepLabel
                sx={{
                  "& .MuiStepLabel-label": { color: "rgba(255,255,255,0.7)" },
                  "& .MuiStepLabel-label.Mui-active": { color: "white" },
                  "& .MuiStepIcon-root": { color: "rgba(255,255,255,0.5)" },
                  "& .MuiStepIcon-root.Mui-active": { color: "white" },
                }}
              />
            </Step>
          ))}
        </Stepper>

        <Paper
          sx={{
            p: 3,
            mb: 3,
            backgroundColor: "rgba(255,255,255,0.1)",
            color: "white",
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
              backgroundColor: "rgba(255,255,255,0.2)",
              color: "white",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.3)" },
            }}
            fullWidth
          >
            {tourSteps[activeStep].actionText}
          </Button>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={onClose} sx={{ color: "rgba(255,255,255,0.7)" }}>
          Пропустить тур
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          onClick={handleBack}
          disabled={activeStep === 0}
          startIcon={<NavigateBefore />}
          sx={{ color: "white" }}
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
            backgroundColor: "white",
            color: "#667eea",
            "&:hover": { backgroundColor: "rgba(255,255,255,0.9)" },
          }}
        >
          {activeStep === tourSteps.length - 1 ? "Завершить" : "Далее"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
