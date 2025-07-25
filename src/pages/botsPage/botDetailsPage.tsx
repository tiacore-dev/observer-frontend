import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useBotDetailsQuery } from "../../hooks/bots/useBotsQuery";
import { useCompanyMap } from "../../hooks/maps/useCompanyMap";
import { DetailsPageSkeleton } from "../../components/skeleton/detailsPageSkeleton";
import {
  Card,
  CardContent,
  Typography as MuiTypography,
  Box as MuiBox,
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

interface BotDetailsPageProps {
  botId: string;
  developerMode: boolean;
}

export const BotDetailsPage: React.FC<BotDetailsPageProps> = ({
  botId,
  developerMode,
}) => {
  const { data: bot, isLoading, error } = useBotDetailsQuery(botId);
  const { companyMap, isLoadingCompanyMap } = useCompanyMap();
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const updateBot = useUpdateBot(botId);
  const queryClient = useQueryClient();
  const selectedCompanyId = localStorage.getItem("selected_company_id");

  if (isLoading || isLoadingCompanyMap) {
    return (
      <DetailsPageSkeleton developerMode={developerMode} buttonCount={2} />
    );
  }

  if (error || !bot) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Typography color="error">
          Ошибка: {(error as Error)?.message || "Бот не найден"}
        </Typography>
      </Box>
    );
  }

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

  const handleSaveDescription = async (newDescription: string) => {
    queryClient.setQueryData(
      ["botDetails", bot.bot_id, selectedCompanyId],
      (oldData: IBot | undefined) => {
        if (!oldData) return oldData;
        return { ...oldData, comment: newDescription };
      }
    );

    try {
      await updateBot.mutateAsync({
        bot_id: bot.bot_id,
        comment: newDescription,
      });

      await queryClient.refetchQueries({
        queryKey: ["botDetails", bot.bot_id, selectedCompanyId],
      });

      setIsEditModalOpen(false);
    } catch (error) {
      queryClient.setQueryData(
        ["botDetails", bot.bot_id, selectedCompanyId],
        (oldData: IBot | undefined) => {
          if (!oldData) return oldData;
          return { ...oldData, comment: bot.comment };
        }
      );
      console.error("Error updating bot description:", error);
    }
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
    <MuiBox sx={{ mb: 1.5, display: "flex", alignItems: "flex-start" }}>
      <MuiBox sx={{ mr: 1, mt: 0.5 }}>{icon}</MuiBox>
      <MuiBox>
        <MuiTypography
          variant="subtitle2"
          color="text.secondary"
          sx={{ fontWeight: 600, fontSize: "0.875rem" }}
        >
          {label}
        </MuiTypography>
        {multiline ? (
          <MuiTypography
            variant="body2"
            sx={{
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {value}
          </MuiTypography>
        ) : (
          <MuiTypography
            variant="body2"
            sx={{
              fontFamily:
                typeof value === "string" && value.match(/^\d+$/)
                  ? "monospace"
                  : "inherit",
            }}
          >
            {value}
          </MuiTypography>
        )}
      </MuiBox>
    </MuiBox>
  );

  return (
    <MuiBox sx={{ pl: 2, pr: 2, mt: -1, maxWidth: 1600, mx: "auto" }}>
      {/* Заголовок с основной информацией */}
      <Paper
        sx={{
          p: 3,
          mb: 1,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <MuiBox
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: "white",
          }}
        >
          <MuiBox sx={{ display: "flex", alignItems: "center" }}>
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
            <MuiBox>
              <MuiTypography
                variant="h4"
                gutterBottom
                sx={{ fontWeight: "bold", color: "white" }}
              >
                {bot.bot_first_name || "Telegram Бот"}
              </MuiTypography>
              <MuiTypography
                variant="h6"
                sx={{ opacity: 0.9, mb: 1, color: "white" }}
              >
                @{bot.bot_username}
              </MuiTypography>
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
            </MuiBox>
          </MuiBox>

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
        </MuiBox>
      </Paper>

      <MuiBox sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Основная информация о боте */}
        <Card>
          <CardContent sx={{ p: 2 }}>
            <MuiTypography
              variant="h6"
              gutterBottom
              sx={{ display: "flex", alignItems: "center" }}
            >
              <SmartToyIcon sx={{ mr: 1, color: "primary.main" }} />
              Основная информация
            </MuiTypography>
            <Divider sx={{ mb: 2 }} />
            <MuiBox
              sx={{
                display: "grid",
                gridTemplateColumns: { sm: "1fr 1fr" },
                gap: 3,
              }}
            >
              <MuiBox sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
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
              </MuiBox>
              <MuiBox sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
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
                    value={companyMap.get(bot.company) || bot.company}
                  />
                )}
              </MuiBox>
            </MuiBox>
          </CardContent>
        </Card>

        {/* Описание бота */}
        <Card>
          <CardContent sx={{ p: 2 }}>
            <MuiBox
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <MuiTypography
                variant="h6"
                sx={{ display: "flex", alignItems: "center" }}
              >
                <CommentIcon sx={{ mr: 1, color: "primary.main" }} />
                Описание бота
              </MuiTypography>
              <Button
                startIcon={<EditIcon />}
                size="small"
                onClick={() => setIsEditModalOpen(true)}
              >
                Редактировать
              </Button>
            </MuiBox>
            <Divider sx={{ mb: 2 }} />
            <MuiTypography
              sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
            >
              {bot.comment || "Описание не добавлено"}
            </MuiTypography>
          </CardContent>
        </Card>
      </MuiBox>

      <EditBotDescriptionModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        description={bot.comment || ""}
        onSave={handleSaveDescription}
        isLoading={updateBot.isPending}
      />
    </MuiBox>
  );
};

// export default BotDetailsPage;
