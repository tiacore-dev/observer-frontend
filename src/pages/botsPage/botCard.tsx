import React from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Divider,
  Chip,
  CircularProgress,
  ListItem,
  List,
  Stack,
} from "@mui/material";
import { IBot } from "../../api/botsApi";
import { useNavigate } from "react-router-dom";
import { useWebhookQuery } from "../../hooks/webhook/useWebhooksQuery";
import {
  useSetWebhookMutation,
  useDeleteWebhookMutation,
} from "../../hooks/webhook/useWebhookMutations";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDeleteBot } from "../../hooks/bots/useBotsMutations";

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
  const {
    data: webhookData,
    isLoading: isWebhookLoading,
    refetch,
  } = useWebhookQuery(bot.bot_id.toString());

  const { mutate: setWebhook, isPending: isSettingWebhook } =
    useSetWebhookMutation();
  const { mutate: deleteWebhook, isPending: isDeletingWebhook } =
    useDeleteWebhookMutation();
  const { mutate: deleteBotMutation, isPending: isDeletingBot } =
    useDeleteBot();

  const handleSetWebhook = () => {
    setWebhook(bot.bot_id.toString(), {
      onSuccess: () => {
        refetch();
      },
    });
  };

  const handleDeleteWebhook = () => {
    deleteWebhook(bot.bot_id.toString(), {
      onSuccess: () => {
        refetch();
      },
    });
  };

  const handleDeleteBot = () => {
    deleteBotMutation(bot.bot_id.toString(), {
      onSuccess: () => {
        navigate("/bots");
      },
    });
  };

  return (
    <Box sx={{ width: "100%", mt: 2, position: "relative" }}>
      <Box sx={{ p: 2, position: "absolute", left: 0 }}>
        <Button
          variant="outlined"
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
          startIcon={<ArrowBackIcon />}
        >
          Назад
        </Button>
      </Box>
      <Box sx={{ p: 2, position: "absolute", right: 0 }}>
        <Button
          variant="contained"
          color="error"
          onClick={handleDeleteBot}
          disabled={isDeletingBot}
          startIcon={<DeleteIcon />}
        >
          {isDeletingBot ? (
            <>
              <CircularProgress size={24} sx={{ mr: 1 }} />
              Удаление...
            </>
          ) : (
            "Удалить бота"
          )}
        </Button>
      </Box>
      <Box
        sx={{
          p: 2,
          maxWidth: 800,
          margin: "0 auto",
        }}
      >
        <Paper sx={{ p: 3 }} elevation={3}>
          {/* Остальной код компонента остается без изменений */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h5" component="h1">
              {bot.bot_username}
            </Typography>
            <Chip
              label={bot.is_active ? "Активен" : "Неактивен"}
              color={bot.is_active ? "success" : "error"}
            />
          </Box>

          <Divider sx={{ my: 2 }} />
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Основная информация
            </Typography>
            <Typography>
              <strong>ID:</strong> {bot.bot_id}
            </Typography>
            <Typography>
              <strong>Имя:</strong> {bot.bot_first_name}
            </Typography>
            {developerMode && (
              <>
                <Typography>
                  <strong>Токен:</strong> {bot.bot_token}
                </Typography>
                <Typography>
                  <strong>Компания:</strong> {companyName}
                </Typography>
                <Typography>
                  <strong>Дата создания:</strong>{" "}
                  {new Date(bot.created_at).toLocaleString()}
                </Typography>
              </>
            )}
            <Typography>
              <strong>Комментарий:</strong> {bot.comment || "-"}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ mb: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              {webhookData?.result?.url ? (
                <Typography variant="subtitle1">Вебхук</Typography>
              ) : (
                <Typography variant="subtitle1">
                  Вебхук не установлен
                </Typography>
              )}
              {!isWebhookLoading &&
                (webhookData?.result?.url ? (
                  <Button
                    startIcon={<DeleteIcon />}
                    variant="outlined"
                    color="error"
                    onClick={handleDeleteWebhook}
                    disabled={isDeletingWebhook}
                  >
                    {isDeletingWebhook ? (
                      <>
                        <CircularProgress size={24} sx={{ mr: 1 }} />
                        Удаление...
                      </>
                    ) : (
                      "Удалить вебхук"
                    )}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleSetWebhook}
                    disabled={isSettingWebhook}
                  >
                    {isSettingWebhook ? (
                      <>
                        <CircularProgress size={24} sx={{ mr: 1 }} />
                        Установка...
                      </>
                    ) : (
                      "Установить вебхук"
                    )}
                  </Button>
                ))}
            </Box>

            {isWebhookLoading ? (
              <CircularProgress size={24} />
            ) : webhookData?.result?.url ? (
              <Box>
                <Typography>
                  <strong>URL:</strong> {webhookData.result.url}
                </Typography>
                <Typography>
                  <strong>IP адрес:</strong>{" "}
                  {webhookData.result.ip_address || "Неизвестно"}
                </Typography>
                <Typography>
                  <strong>Ожидающих обновлений:</strong>{" "}
                  {webhookData.result.pending_update_count}
                </Typography>
                <Typography>
                  <strong>Макс. соединений:</strong>{" "}
                  {webhookData.result.max_connections}
                </Typography>
                <Typography>
                  <strong>Сертификат:</strong>{" "}
                  {webhookData.result.has_custom_certificate
                    ? "Кастомный"
                    : "Стандартный"}
                </Typography>
                {developerMode && webhookData.result.allowed_updates && (
                  <Box>
                    <Typography>
                      <strong>Доступные обновления:</strong>
                    </Typography>
                    <List dense sx={{ listStyleType: "disc", pl: 2 }}>
                      {webhookData.result.allowed_updates.map(
                        (update, index) => (
                          <ListItem
                            key={index}
                            sx={{ display: "list-item", py: 0 }}
                          >
                            {update}
                          </ListItem>
                        )
                      )}
                    </List>
                  </Box>
                )}
              </Box>
            ) : null}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};
