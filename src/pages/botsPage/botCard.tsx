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
import EditIcon from "@mui/icons-material/Edit";
import { DeletePromptDialog } from "../../components/deleteDialog";

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

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

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
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "start", mb: 2, gap: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          variant="outlined"
        >
          Назад
        </Button>

        <Button
          startIcon={<DeleteIcon />}
          onClick={() => setIsDeleteDialogOpen(true)}
          variant="contained"
          color="error"
          disabled={isDeletingBot}
        >
          {isDeletingBot ? (
            <>
              <CircularProgress size={24} sx={{ mr: 1 }} />
              Удаление...
            </>
          ) : (
            "Удалить"
          )}
        </Button>
      </Box>

      <Paper sx={{ p: 3 }} elevation={3}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h5" component="h1">
            {bot.bot_username}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {!isWebhookLoading &&
              (webhookData?.result?.url ? (
                <Button
                  startIcon={<DeleteIcon />}
                  variant="outlined"
                  color="error"
                  onClick={handleDeleteWebhook}
                  disabled={isDeletingWebhook}
                  size="small"
                >
                  {isDeletingWebhook ? (
                    <>
                      <CircularProgress size={18} sx={{ mr: 1 }} />
                      Отключить вебхук
                    </>
                  ) : (
                    "Отключить вебхук"
                  )}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleSetWebhook}
                  disabled={isSettingWebhook}
                  size="small"
                >
                  {isSettingWebhook ? (
                    <>
                      <CircularProgress size={18} sx={{ mr: 1 }} />
                      Установить вебхук
                    </>
                  ) : (
                    "Установить вебхук"
                  )}
                </Button>
              ))}

            <Chip
              label={bot.is_active ? "Активен" : "Неактивен"}
              color={bot.is_active ? "success" : "error"}
            />
          </Box>
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
                <strong>Дата создания:</strong>{" "}
                {new Date(bot.created_at).toLocaleString()}
              </Typography>
            </>
          )}
          <Typography>
            <strong>Комментарий:</strong> {bot.comment || "-"}
          </Typography>
        </Box>

        {developerMode && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Информация о вебхуке
              </Typography>

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
                  {webhookData.result.allowed_updates && (
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
              ) : (
                <Typography>Вебхук не установлен</Typography>
              )}
            </Box>
          </>
        )}
      </Paper>

      <DeletePromptDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteBot}
        isDeleting={isDeletingBot}
      />
    </Box>
  );
};
