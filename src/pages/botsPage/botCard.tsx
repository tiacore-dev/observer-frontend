import type React from "react";
import { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Avatar,
  Divider,
  Paper,
  Button,
  Stack,
} from "@mui/material";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import BusinessIcon from "@mui/icons-material/Business";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CommentIcon from "@mui/icons-material/Comment";
import PersonIcon from "@mui/icons-material/Person";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import type { IBot } from "../../api/botsApi";
import { useNavigate } from "react-router-dom";
import { useUpdateBot } from "../../hooks/bots/useBotsMutations";
import { EditBotDescriptionModal } from "./editBotDescriptionModal";
import { useQueryClient } from "@tanstack/react-query";

interface BotCardProps {
  bot: IBot;
  companyName: string;
  developerMode: boolean;
}

export const BotCard: React.FC<BotCardProps> = ({
  bot,
  companyName,
  developerMode,
}) => {
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const updateBot = useUpdateBot();

  const getBotInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const CompactDetailItem = ({
    icon,
    label,
    value,
    multiline = false,
  }: {
    icon: React.ReactNode;
    label: string;
    value: string | React.ReactNode;
    multiline?: boolean;
  }) => (
    <Box sx={{ mb: 1.5, display: "flex", alignItems: "flex-start" }}>
      <Box sx={{ mr: 1, mt: 0.5 }}>{icon}</Box>
      <Box>
        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{ fontWeight: 600, fontSize: "0.875rem" }}
        >
          {label}
        </Typography>
        {multiline ? (
          <Typography
            variant="body2"
            sx={{
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {value}
          </Typography>
        ) : (
          <Typography
            variant="body2"
            sx={{
              fontFamily:
                typeof value === "string" && value.match(/^\d+$/)
                  ? "monospace"
                  : "inherit",
            }}
          >
            {value}
          </Typography>
        )}
      </Box>
    </Box>
  );
  const queryClient = useQueryClient();
  const selectedCompanyId = localStorage.getItem("selected_company_id");

  const handleSaveDescription = async (newDescription: string) => {
    // 1. Оптимистичное обновление (UI изменится мгновенно)
    queryClient.setQueryData(
      ["botDetails", bot.bot_id, selectedCompanyId],
      (oldData: IBot | undefined) => {
        if (!oldData) return oldData;
        return { ...oldData, comment: newDescription };
      }
    );

    try {
      // 2. Отправляем запрос на сервер
      await updateBot.mutateAsync({
        bot_id: bot.bot_id,
        comment: newDescription,
      });

      // 3. Принудительно перезапрашиваем данные (на случай, если API не возвращает обновлённый объект)
      await queryClient.refetchQueries({
        queryKey: ["botDetails", bot.bot_id, selectedCompanyId],
      });

      setIsEditModalOpen(false);
    } catch (error) {
      // 4. Откатываем изменения при ошибке
      queryClient.setQueryData(
        ["botDetails", bot.bot_id, selectedCompanyId],
        (oldData: IBot | undefined) => {
          if (!oldData) return oldData;
          return { ...oldData, comment: bot.comment }; // Возвращаем старое значение
        }
      );
      console.error("Error updating bot description:", error);
    }
  };

  return (
    <Box sx={{ pl: 2, pr: 2, mt: -1, maxWidth: 1600, mx: "auto" }}>
      {/* Заголовок с основной информацией */}
      <Paper
        sx={{
          p: 3,
          mb: 1,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: "white",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: "rgba(255,255,255,0.2)",
                fontSize: "1.5rem",
                fontWeight: "bold",
                mr: 3,
              }}
            >
              {getBotInitials(bot.bot_first_name || bot.bot_username || "Bot")}
            </Avatar>
            <Box>
              <Typography
                variant="h4"
                gutterBottom
                sx={{ fontWeight: "bold", color: "white" }}
              >
                {bot.bot_first_name || "Telegram Бот"}
              </Typography>
              <Typography
                variant="h6"
                sx={{ opacity: 0.9, mb: 1, color: "white" }}
              >
                @{bot.bot_username}
              </Typography>
              <Chip
                icon={bot.is_active ? <CheckCircleIcon /> : <ErrorIcon />}
                label={bot.is_active ? "Активен" : "Неактивен"}
                sx={{
                  bgcolor: "rgba(255,255,255,0.9)",
                  color: bot.is_active ? "#059669" : "#dc2626",
                  fontWeight: "bold",
                  "& .MuiSvgIcon-root": {
                    color: bot.is_active ? "#059669" : "#dc2626",
                  },
                }}
              />
            </Box>
          </Box>

          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            variant="contained"
            sx={{
              backgroundColor: "white",
              color: "#764ba2",
              "&:hover": {
                backgroundColor: "#ffffffec",
                backgroundImage: "none",
              },
              "& .MuiSvgIcon-root": {
                color: "#764ba2",
              },
              backgroundImage: "none",
              boxShadow: "none",
              transition: "background-color 0.2s ease",
            }}
          >
            Назад
          </Button>
        </Box>
      </Paper>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Основная информация о боте */}
        <Card>
          <CardContent sx={{ p: 2 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: "flex", alignItems: "center" }}
            >
              <SmartToyIcon sx={{ mr: 1, color: "primary.main" }} />
              Основная информация
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { sm: "1fr 1fr" },
                gap: 3,
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <CompactDetailItem
                  icon={<PersonIcon color="primary" fontSize="small" />}
                  label="Название"
                  value={bot.bot_first_name || "Не указано"}
                />
                <CompactDetailItem
                  icon={<PersonIcon color="primary" fontSize="small" />}
                  label="Бот"
                  value={`@${bot.bot_username}`}
                />
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <CompactDetailItem
                  icon={<FingerprintIcon color="primary" fontSize="small" />}
                  label="ID бота"
                  value={bot.bot_id}
                />
                <CompactDetailItem
                  icon={<CalendarTodayIcon color="primary" fontSize="small" />}
                  label="Дата регистрации"
                  value={formatDate(bot.created_at)}
                />
                {developerMode && (
                  <CompactDetailItem
                    icon={<BusinessIcon color="primary" fontSize="small" />}
                    label="Компания"
                    value={companyName}
                  />
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Описание бота */}
        <Card>
          <CardContent sx={{ p: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography
                variant="h6"
                sx={{ display: "flex", alignItems: "center" }}
              >
                <CommentIcon sx={{ mr: 1, color: "primary.main" }} />
                Описание бота
              </Typography>
              <Button
                startIcon={<EditIcon />}
                size="small"
                onClick={() => setIsEditModalOpen(true)}
              >
                Редактировать
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Typography
              sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
            >
              {bot.comment || "Описание не добавлено"}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <EditBotDescriptionModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        description={bot.comment || ""}
        onSave={handleSaveDescription}
        isLoading={updateBot.isPending}
      />
    </Box>
  );
};
