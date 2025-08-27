"use client";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  useTheme,
  CircularProgress,
  Button,
  Chip,
  Paper,
  useMediaQuery,
} from "@mui/material";
import { useSubscriptionsQuery } from "../../hooks/subscriptions/useSubscriptionsQuery";
import { useSubscriptionDetailsBySubscriptionQuery } from "../../hooks/subscriptionDetails/useSubscriptionDetailsQuery";
import CheckIcon from "@mui/icons-material/Check";
import PublicPageLayout from "../../components/publicLayout/publicPageLayout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";

const SubscriptionCard = ({
  subscription,
  isPopular,
}: {
  subscription: any;
  isPopular?: boolean;
}) => {
  const theme = useTheme();
  const { data: detailsData, isLoading: isLoadingDetails } =
    useSubscriptionDetailsBySubscriptionQuery(subscription.subscription_id);
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const formatNumber = (value: any) => {
    if (typeof value === "number") {
      return value.toLocaleString("ru-RU");
    }
    return value;
  };

  const getPriceDisplay = () => {
    if (subscription.price === 0) {
      return { price: "Бесплатно", period: "" };
    }
    if (subscription.price === -1) {
      return { price: "По запросу", period: "" };
    }
    return {
      price: `${subscription.price.toLocaleString()} ₽`,
      period: "/месяц",
    };
  };

  const { price, period } = getPriceDisplay();
  const isCustom = subscription.price === -1;
  const isFree = subscription.price === 0;
  const { isAuthenticated } = useAuth();

  return (
    <Card
      sx={{
        minHeight: isMobile ? "auto" : "450px",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        border: isPopular
          ? `2px solid ${theme.palette.primary.main}`
          : `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        backgroundColor: theme.palette.background.paper,
        width: isMobile ? "100%" : "auto", // Изменено: на мобильных занимает всю ширину
        flexShrink: 0,
      }}
    >
      {isPopular && (
        <Box
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            zIndex: 1,
          }}
        >
          <Chip
            label="Популярное"
            size="small"
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: "white",
              fontWeight: 600,
              fontSize: "0.7rem",
            }}
          />
        </Box>
      )}

      <CardContent sx={{ flexGrow: 1, p: isMobile ? 2 : 2.5 }}>
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              mb: 1,
              color: theme.palette.text.primary,
              fontSize: isMobile ? "1.1rem" : "1.25rem",
            }}
          >
            {subscription.subscription_name}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "baseline", mb: 1.5 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: theme.palette.text.primary,
                mr: 0.5,
                fontSize: isMobile ? "1.8rem" : "2rem",
              }}
            >
              {price}
            </Typography>
            {period && (
              <Typography variant="body2" color="text.secondary">
                {period}
              </Typography>
            )}
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              fontSize: "0.875rem",
              lineHeight: 1.5,
            }}
          >
            {subscription.description}
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          {isLoadingDetails ? (
            <Box display="flex" justifyContent="center" py={1}>
              <CircularProgress size={16} />
            </Box>
          ) : detailsData?.details && detailsData.details.length > 0 ? (
            <List disablePadding sx={{ mb: 1, flexGrow: 1 }}>
              {detailsData.details.map((detail: any, index: number) => (
                <ListItem
                  key={index}
                  sx={{ py: 0.3, px: 0, alignItems: "flex-start" }}
                >
                  <CheckIcon
                    sx={{
                      mr: 1,
                      fontSize: 16,
                      flexShrink: 0,
                      mt: 0.2,
                      color: theme.palette.primary.main,
                    }}
                  />
                  <ListItemText
                    primary={
                      <Typography
                        variant="body2"
                        component="span"
                        sx={{ fontSize: "0.85rem", lineHeight: 1.4 }}
                      >
                        <Box
                          component="span"
                          sx={{
                            fontWeight: 600,
                            color: theme.palette.text.primary,
                          }}
                        >
                          {formatNumber(detail.restriction)}
                        </Box>
                        {detail.description && (
                          <Box
                            component="span"
                            sx={{
                              color: theme.palette.text.secondary,
                              ml: 0.5,
                            }}
                          >
                            {" "}
                            {detail.description}
                          </Box>
                        )}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Box sx={{ mb: 2, flexGrow: 1 }}>
              {isCustom ? (
                <Box sx={{ textAlign: "left" }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1, fontSize: "0.85rem" }}
                  >
                    ✓ Подберем функционал под ваши потребности.
                  </Typography>
                </Box>
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: "0.85rem" }}
                >
                  Свяжитесь с нами, чтобы узнать подробности тарифа.
                </Typography>
              )}
            </Box>
          )}
        </Box>
      </CardContent>

      <CardActions sx={{ p: isMobile ? 2 : 2.5, pt: 0 }}>
        {isCustom ? (
          <Button
            href="https://t.me/tiacore_support_bot"
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              py: 0.75,
              fontWeight: 500,
              textTransform: "none",
              borderRadius: 1.5,
              fontSize: "0.875rem",
            }}
          >
            Связаться с нами
          </Button>
        ) : isFree ? (
          <Button
            onClick={() => navigate("/login")}
            variant={!isAuthenticated ? "contained" : "outlined"}
            color="primary"
            fullWidth
            sx={{
              py: 0.75,
              fontWeight: 500,
              textTransform: "none",
              borderRadius: 1.5,
              fontSize: "0.875rem",
            }}
          >
            {!isAuthenticated ? "Начать бесплатно" : "Текущий тариф"}
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              py: 0.75,
              fontWeight: 500,
              textTransform: "none",
              borderRadius: 1.5,
              fontSize: "0.875rem",
            }}
          >
            Выбрать тариф
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export const SubscriptionsPage = () => {
  const { data: subscriptionsData, isLoading } = useSubscriptionsQuery();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (isLoading) {
    return (
      <PublicPageLayout maxWidth="lg">
        <Box display="flex" justifyContent="center" sx={{ py: 8 }}>
          <CircularProgress size={48} />
        </Box>
      </PublicPageLayout>
    );
  }

  const subscriptions = subscriptionsData?.subscriptions || [];
  const reorderedSubscriptions = [...subscriptions.slice(1), subscriptions[0]];

  const popularPlanIndex = Math.floor(reorderedSubscriptions.length / 2);

  return (
    <PublicPageLayout maxWidth={false} disableGutters>
      <Box sx={{ mt: -1.25 }}>
        <Paper
          elevation={1}
          sx={{
            p: isMobile ? 1.5 : 2.5,
            mb: 2,
            mr: 1,
            ml: isMobile ? 1 : 2,
            background:
              theme.palette.mode === "dark"
                ? "linear-gradient(135deg, #6366f1aa 0%, #8b5cf6aa 100%)"
                : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
          }}
        >
          <Typography
            component="h1"
            variant="h2"
            align="center"
            gutterBottom
            sx={{
              fontWeight: 700,
              mb: 1.5,
              mt: 1,
              fontSize: { xs: "1.75rem", md: "2.25rem" },
              color: "white",
            }}
          >
            Тарифные планы
          </Typography>
          <Typography
            variant="h6"
            align="center"
            sx={{
              fontWeight: 400,
              lineHeight: 1.4,
              maxWidth: 600,
              mx: "auto",
              mb: 2,
              color: "white",
              fontSize: { xs: "0.95rem", md: "1.1rem" },
            }}
          >
            Вы можете начать бесплатно уже сейчас. Переходите на более высокий
            тариф, чтобы получить больше возможностей использования и совместной
            работы.
          </Typography>
        </Paper>
      </Box>

      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            gap: isMobile ? 1 : 2,
            flexWrap: "wrap",
            justifyContent: "center",
            alignContent: "stretch",
          }}
        >
          {reorderedSubscriptions.map((subscription, index) => (
            <Box
              key={subscription.subscription_id}
              sx={{
                flex: "1 1 0",
                minWidth: isMobile ? "100%" : "360px", // Изменено: на мобильных занимает всю ширину
                maxWidth: isMobile ? "100%" : "360px", // Изменено: на мобильных занимает всю ширину
              }}
            >
              <SubscriptionCard
                subscription={subscription}
                isPopular={index === popularPlanIndex}
              />
            </Box>
          ))}
        </Box>
      </Container>
    </PublicPageLayout>
  );
};
