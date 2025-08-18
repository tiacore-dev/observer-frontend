"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Alert,
  Link,
  CircularProgress,
  Collapse,
  Tooltip,
  useMediaQuery,
  Theme,
} from "@mui/material";
import {
  SmartToy as BotIcon,
  Info as InfoIcon,
  CheckCircle,
  Warning,
  Business as BusinessIcon,
  ExpandMore,
  ExpandLess,
} from "@mui/icons-material";
import { useCreateBot } from "../../hooks/bots/useBotsMutations";
import { useCompaniesQuery } from "../../hooks/companies/useCompaniesQuery";
import { ModalSkeleton } from "../../components/skeleton/modalSkeleton";
import { useAuth } from "../../context/authContext";
import { InfoCard } from "../../components/infoCard";
import axios from "axios";

interface AddBotModalProps {
  open: boolean;
  onClose: () => void;
}

export const AddBotModal: React.FC<AddBotModalProps> = ({ open, onClose }) => {
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );
  const { isSuperadmin, selectedCompanyId } = useAuth();
  const [botData, setBotData] = useState({
    token: "",
    company_id: "",
    comment: "",
  });
  const [showHelp, setShowHelp] = useState(false);
  const [isValidatingToken, setIsValidatingToken] = useState(false);
  const [apiValidationError, setApiValidationError] = useState("");
  const createBot = useCreateBot();

  useEffect(() => {
    if (!isSuperadmin && selectedCompanyId) {
      setBotData((prev) => ({
        ...prev,
        company_id: selectedCompanyId,
      }));
    }
  }, [isSuperadmin, selectedCompanyId]);

  const { data: companiesData, isLoading, error } = useCompaniesQuery();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBotData((prev) => ({ ...prev, [name]: value }));
    if (name === "token") {
      setApiValidationError("");
    }
  };

  const [errors, setErrors] = useState({
    token: "",
    company_id: "",
  });

  const validateTokenFormat = (token: string): boolean => {
    const tokenRegex = /^\d{9,10}:[a-zA-Z0-9_-]{35}$/;
    return tokenRegex.test(token);
  };

  const validateTokenWithApi = async (token: string): Promise<boolean> => {
    try {
      const response = await axios.get(
        `https://api.telegram.org/bot${token}/getMe`
      );
      return response.data?.ok === true;
    } catch (error) {
      console.error("Token validation error:", error);
      return false;
    }
  };

  const getTokenValidationStatus = (token: string) => {
    if (!token) return { status: "empty", message: "" };
    if (!token.includes(":")) {
      return { status: "error", message: "Токен должен содержать символ ':'" };
    }
    if (!validateTokenFormat(token)) {
      return { status: "error", message: "Неверный формат токена" };
    }
    if (apiValidationError) {
      return { status: "error", message: apiValidationError };
    }
    return { status: "success", message: "Токен выглядит корректно" };
  };

  const tokenStatus = getTokenValidationStatus(botData.token);

  const handleSubmit = async () => {
    const newErrors = {
      token: !botData.token
        ? "Токен обязателен"
        : !validateTokenFormat(botData.token)
        ? "Неверный формат токена"
        : "",
      company_id: !botData.company_id ? "Выберите компанию" : "",
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((e) => e)) return;

    setIsValidatingToken(true);
    try {
      const isValid = await validateTokenWithApi(botData.token);
      if (!isValid) {
        setApiValidationError("Токен недействителен или бот не найден");
        return;
      }

      await createBot.mutateAsync(botData);
      onClose();
      setBotData({ token: "", company_id: "", comment: "" });
      setApiValidationError("");
    } catch (error) {
      console.error("Error creating bot:", error);
      setApiValidationError("Ошибка при создании бота");
    } finally {
      setIsValidatingToken(false);
    }
  };

  if (isLoading) {
    return <ModalSkeleton fieldCount={3} hasActions />;
  }

  if (error) {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <BotIcon color="primary" />
            Добавить Telegram-бота
          </Box>
        </DialogTitle>
        <DialogContent>
          <Alert severity="error">
            <Typography>
              Ошибка при загрузке данных: {(error as Error).message}
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Закрыть</Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
    >
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <BotIcon color="primary" />
          <Typography variant={isMobile ? "h6" : "inherit"}>
            Добавить Telegram-бота
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Button
            variant="text"
            onClick={() => setShowHelp(!showHelp)}
            endIcon={showHelp ? <ExpandLess /> : <ExpandMore />}
            size="small"
          >
            {isMobile ? "Помощь" : "Инструкция по созданию бота"}
          </Button>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Collapse in={showHelp}>
          <Box sx={{ mb: 3 }}>
            <InfoCard
              type="info"
              title="Для создания бота выполните следующие шаги:"
              description=" "
            >
              <Box component="ol" sx={{ pl: 2, mt: 1, mb: 0 }}>
                <li>
                  Откройте Telegram и найдите <strong>@BotFather</strong>
                </li>
                <li>
                  Отправьте команду <code>/newbot</code>
                </li>
                <li>
                  Придумайте имя для бота (например: "Мой Аналитический Бот")
                </li>
                <li>Придумайте username (должен заканчиваться на "bot")</li>
                <li>Скопируйте полученный токен</li>
              </Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, mb: 1, mt: 1, ml: -1, color: "#1e293b" }}
              >
                После создания бота:
              </Typography>
              <Box component="ol" sx={{ pl: 2, mt: 1, mb: 0 }}>
                <li>
                  Добавьте бота в нужные чаты через меню "Добавить участников"
                </li>
                <li>
                  Дайте боту права <strong>администратора</strong> с
                  возможностью отправки сообщений
                </li>
                <li>
                  Убедиться, что после добавления бота в чате есть новые
                  сообщения
                </li>
              </Box>
            </InfoCard>
          </Box>
        </Collapse>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 1 }}>
          {isSuperadmin && (
            <FormControl fullWidth error={!!errors.company_id}>
              <InputLabel>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <BusinessIcon fontSize="small" />
                  Компания
                </Box>
              </InputLabel>
              <Select
                name="company_id"
                value={botData.company_id}
                label="Компания"
                onChange={(e) =>
                  setBotData((prev) => ({
                    ...prev,
                    company_id: e.target.value,
                  }))
                }
              >
                {companiesData?.companies.map((company) => (
                  <MenuItem key={company.company_id} value={company.company_id}>
                    {company.company_name}
                  </MenuItem>
                ))}
              </Select>
              {errors.company_id && (
                <Typography variant="caption" color="error">
                  {errors.company_id}
                </Typography>
              )}
            </FormControl>
          )}

          <TextField
            fullWidth
            label="Токен бота"
            name="token"
            value={botData.token}
            onChange={handleChange}
            error={!!errors.token || !!apiValidationError}
            helperText={
              errors.token ||
              apiValidationError ||
              tokenStatus.message ||
              "Вставьте токен, полученный от @BotFather"
            }
            required
            placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
            InputProps={{
              endAdornment: (
                <>
                  {isValidatingToken ? (
                    <CircularProgress size={24} />
                  ) : tokenStatus.status === "success" ? (
                    <CheckCircle color="success" />
                  ) : tokenStatus.status === "error" ? (
                    <Warning color="error" />
                  ) : null}
                </>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Описание бота (необязательно)"
            name="comment"
            value={botData.comment}
            onChange={handleChange}
            multiline
            rows={isMobile ? 3 : 4}
            helperText="Краткое описание назначения бота"
            placeholder="Например: Бот для отправки еженедельных отчетов по чату поддержки"
          />

          <Alert severity="info" variant="outlined">
            <Box component="div">
              <Typography variant="body2">
                Для корректной работы бота необходимо:
              </Typography>
              <Typography variant="body2">
                • Добавить бота в нужные чаты
              </Typography>
              <Typography variant="body2">
                • Назначить его администратором с правами на отправку сообщений
              </Typography>
              <Typography variant="body2">
                • Убедиться, что после добавления бота в чате есть новые
                сообщения
              </Typography>
            </Box>
          </Alert>
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          p: isMobile ? 2 : 3,
          justifyContent: "space-between",
        }}
      >
        <Button onClick={onClose} fullWidth={isMobile}>
          Отмена
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!botData.token || createBot.isPending}
          startIcon={
            createBot.isPending || isValidatingToken ? (
              <CircularProgress size={16} />
            ) : (
              <BotIcon />
            )
          }
          fullWidth={isMobile}
          sx={isMobile ? { ml: 1 } : {}}
        >
          {createBot.isPending
            ? "Создание..."
            : isValidatingToken
            ? "Проверка..."
            : "Создать"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
