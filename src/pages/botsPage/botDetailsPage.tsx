// src/pages/botDetailsPage.tsx
import React from "react";
import {
  Box,
  CircularProgress,
  Typography,
  useMediaQuery,
  Theme,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
} from "@mui/material";
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
import DeleteIcon from "@mui/icons-material/Delete";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import type { IBot } from "../../api/botsApi";
import { useNavigate } from "react-router-dom";
import { useUpdateBot, useDeleteBot } from "../../hooks/bots/useBotsMutations";
import { EditBotDescriptionModal } from "./editBotDescriptionModal";
import { useQueryClient } from "@tanstack/react-query";
import { DeleteDialog } from "../../components/deleteDialog";
import {
  useSetWebhookMutation,
  useDeleteWebhookMutation,
} from "../../hooks/webhook/useWebhookMutations";
import { useThemeMode } from "../../context/themeContext";
import { CheckCircle, PauseCircleFilled } from "@mui/icons-material";

interface BotDetailsPageProps {
  botId: string;
  developerMode: boolean;
}

export const BotDetailsPage: React.FC<BotDetailsPageProps> = ({
  botId,
  developerMode,
}) => {
  const theme = useThemeMode();
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );

  const { data: bot, isLoading, error, refetch } = useBotDetailsQuery(botId);
  const { companyMap, isLoadingCompanyMap } = useCompanyMap();
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const updateBot = useUpdateBot(botId);
  const deleteBotMutation = useDeleteBot();
  const queryClient = useQueryClient();
  const selectedCompanyId = localStorage.getItem("selected_company_id");

  const setWebhookMutation = useSetWebhookMutation();
  const deleteWebhookMutation = useDeleteWebhookMutation();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  if (isLoading || isLoadingCompanyMap) {
    return (
      <DetailsPageSkeleton developerMode={developerMode} buttonCount={3} />
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

  const handleDelete = async () => {
    try {
      await deleteBotMutation.mutateAsync(bot.bot_id);
      navigate("/bots");
    } catch (error) {
      console.error("Error deleting bot:", error);
    }
  };

  const handleToggleWebhook = async () => {
    try {
      if (bot.is_active) {
        await deleteWebhookMutation.mutateAsync(bot.bot_id, {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ["botDetails", bot.bot_id],
            });
            refetch();
          },
        });
      } else {
        await setWebhookMutation.mutateAsync(bot.bot_id, {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ["botDetails", bot.bot_id],
            });
            refetch();
          },
        });
      }
    } catch (error) {
      console.error("Error toggling webhook:", error);
    }
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
    <MuiBox
      sx={{
        pl: isMobile ? 1 : 2,
        pr: isMobile ? 1 : 2,
        mt: 1.75,
        mb: -2,
        maxWidth: 1600,
        mx: "auto",
      }}
    >
      {/* Заголовок с основной информацией */}
      <Paper
        sx={{
          p: isMobile ? 2 : 3,
          mb: 1,
          background: theme.isDarkMode
            ? "linear-gradient(135deg, #6366f1aa 0%, #8b5cf6aa 100%)"
            : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          position: "relative",
        }}
      >
        {isMobile && (
          <>
            <IconButton
              onClick={() => navigate(-1)}
              size="small"
              sx={{
                position: "absolute",
                top: 8,
                left: 8,
                zIndex: 1,
                color: "white",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <IconButton
              onClick={handleMenuOpen}
              size="small"
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                zIndex: 1,
                color: "white",
                backgroundColor: "rgba(255,255,255,0.1)",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.2)",
                },
              }}
            >
              <MoreVertIcon />
            </IconButton>
          </>
        )}

        <MuiBox
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "center" : "center",
            justifyContent: "space-between",
            color: "white",
            gap: isMobile ? 2 : 0,
            pt: isMobile ? 4 : 0,
          }}
        >
          <MuiBox
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: isMobile ? "column" : "row",
              textAlign: isMobile ? "center" : "left",
              gap: isMobile ? 2 : 3,
            }}
          >
            <MuiBox sx={{ display: "flex" }}>
              {!isMobile && (
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: "rgba(255,255,255,0.2)",
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    mr: 3,
                    color: "white",
                  }}
                >
                  {getBotInitials(
                    bot.bot_first_name || bot.bot_username || "Bot"
                  )}
                </Avatar>
              )}
              <MuiBox>
                <MuiTypography
                  variant={isMobile ? "h5" : "h4"}
                  gutterBottom
                  sx={{ fontWeight: "bold", color: "white" }}
                >
                  {bot.bot_first_name || "Telegram Бот"}
                  {isMobile && (
                    <MuiTypography
                      component="span"
                      variant="body2"
                      sx={{
                        color: "rgba(255, 255, 255, 0.7)",
                        ml: 0.5,
                        fontWeight: "normal",
                      }}
                    >
                      {" "}
                      @{bot.bot_username}
                    </MuiTypography>
                  )}
                </MuiTypography>
                {!isMobile && (
                  <MuiTypography
                    variant={isMobile ? "body1" : "h6"}
                    sx={{ opacity: 0.9, mb: 1, color: "white" }}
                  >
                    @{bot.bot_username}
                  </MuiTypography>
                )}
                <Chip
                  icon={bot.is_active ? <CheckCircle /> : <PauseCircleFilled />}
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
          </MuiBox>

          {/* Кнопки действий для десктопа */}
          {!isMobile && (
            <Stack direction="row" spacing={1}>
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
              <Button
                startIcon={<PowerSettingsNewIcon />}
                onClick={handleToggleWebhook}
                variant="contained"
                sx={{
                  backgroundColor: "#ffffff",
                  color: bot.is_active ? "#dc2626" : "#059669",
                  "&:hover": {
                    backgroundColor: "#ffffffec",
                    backgroundImage: "none",
                  },
                  "& .MuiSvgIcon-root": {
                    color: bot.is_active ? "#dc2626" : "#059669",
                  },
                  backgroundImage: "none",
                  boxShadow: "none",
                  transition: "background-color 0.2s ease",
                }}
                disabled={
                  setWebhookMutation.isPending ||
                  deleteWebhookMutation.isPending
                }
              >
                {bot.is_active ? "Остановить" : "Запустить"}
                {(setWebhookMutation.isPending ||
                  deleteWebhookMutation.isPending) && (
                  <CircularProgress size={20} sx={{ ml: 1, color: "white" }} />
                )}
              </Button>

              <Button
                startIcon={<DeleteIcon />}
                onClick={() => setIsDeleteDialogOpen(true)}
                variant="contained"
                sx={{
                  backgroundColor: "#ffffff",
                  color: "#dc2626",
                  "&:hover": {
                    backgroundColor: "#ffffffec",
                    backgroundImage: "none",
                  },
                  "& .MuiSvgIcon-root": {
                    color: "#dc2626",
                  },
                  backgroundImage: "none",
                  boxShadow: "none",
                  transition: "background-color 0.2s ease",
                }}
                disabled={deleteBotMutation.isPending}
              >
                Удалить
                {deleteBotMutation.isPending && (
                  <CircularProgress size={20} sx={{ ml: 1, color: "white" }} />
                )}
              </Button>
            </Stack>
          )}
        </MuiBox>
      </Paper>

      {/* Меню для мобильных */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={{
          "& .MuiPaper-root": {
            minWidth: 180,
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.15)",
          },
        }}
      >
        <MenuItem
          onClick={() => {
            handleToggleWebhook();
            handleMenuClose();
          }}
          disabled={
            setWebhookMutation.isPending || deleteWebhookMutation.isPending
          }
        >
          <ListItemIcon>
            <PowerSettingsNewIcon
              fontSize="small"
              color={bot.is_active ? "error" : "success"}
            />
          </ListItemIcon>
          {bot.is_active ? "Остановить" : "Запустить"}
        </MenuItem>
        <MenuItem
          onClick={() => {
            setIsEditModalOpen(true);
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          Редактировать описание
        </MenuItem>
        <MenuItem
          onClick={() => {
            setIsDeleteDialogOpen(true);
            handleMenuClose();
          }}
          sx={{ color: "error.main" }}
          disabled={deleteBotMutation.isPending}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          Удалить
        </MenuItem>
      </Menu>

      <MuiBox sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {/* Основная информация о боте */}
        <Card>
          <CardContent sx={{ p: 2 }}>
            <MuiTypography
              variant={isMobile ? "subtitle1" : "h6"}
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
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
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
                variant={isMobile ? "subtitle1" : "h6"}
                sx={{ display: "flex", alignItems: "center" }}
              >
                <CommentIcon sx={{ mr: 1, color: "primary.main" }} />
                Описание бота
              </MuiTypography>
              {!isMobile && (
                <Button
                  startIcon={<EditIcon />}
                  size="small"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  Редактировать
                </Button>
              )}
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
        isMobile={isMobile}
      />

      <DeleteDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        isDeleting={deleteBotMutation.isPending}
      />
    </MuiBox>
  );
};
