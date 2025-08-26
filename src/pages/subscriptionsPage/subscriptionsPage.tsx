"use client";

import { useState } from "react";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  Typography,
  Stack,
  List,
  ListItem,
  ListItemText,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { useSubscriptionsQuery } from "../../hooks/subscriptions/useSubscriptionsQuery";
import { useSubscriptionDetailsBySubscriptionQuery } from "../../hooks/subscriptionDetails/useSubscriptionDetailsQuery";
import StarIcon from "@mui/icons-material/StarBorder";
import CheckIcon from "@mui/icons-material/Check";
import PublicPageLayout from "../../components/publicLayout/publicPageLayout";

const SubscriptionCard = ({ subscription }: { subscription: any }) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);
  const { data: detailsData, isLoading: isLoadingDetails } =
    useSubscriptionDetailsBySubscriptionQuery(subscription.subscription_id);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.3s, box-shadow 0.3s",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: theme.shadows[6],
        },
      }}
    >
      <CardHeader
        title={subscription.subscription_name}
        titleTypographyProps={{ align: "center", variant: "h5" }}
        subheaderTypographyProps={{ align: "center" }}
        action={subscription.popular ? <StarIcon color="primary" /> : null}
        sx={{
          backgroundColor:
            theme.palette.mode === "light"
              ? theme.palette.grey[200]
              : theme.palette.grey[700],
          py: 3,
        }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "baseline",
            mb: 2,
          }}
        >
          <Typography component="h3" variant="h4" color="text.primary">
            {subscription.price} {"руб. "}
          </Typography>
          <Typography variant="h6" color="text.secondary">
            /месяц
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "baseline",
            mb: 2,
          }}
        >
          <Typography> {`${subscription.description}`} </Typography>
        </Box>
        <List disablePadding>
          <>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ display: "flex", alignItems: "center" }}
            >
              <CheckIcon color="primary" sx={{ mr: 1 }} />
              Что включено:
            </Typography>
            {detailsData?.details && detailsData.details.length > 0 ? (
              <List>
                {detailsData.details.map((detail: any, index: number) => (
                  <ListItem key={index} sx={{ py: 0.5 }}>
                    <ListItemText
                      primary={`${detail.entity_name} (${detail.bd_table})`}
                      secondary={`Ограничение: ${detail.restriction}`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Нет доступных деталей для этой подписки
              </Typography>
            )}
          </>
        </List>
      </CardContent>
      <CardActions
        sx={{ justifyContent: "center", pb: 2, flexDirection: "column" }}
      ></CardActions>
    </Card>
  );
};

export const SubscriptionsPage = () => {
  const { data: subscriptionsData, isLoading } = useSubscriptionsQuery();
  const theme = useTheme();

  if (isLoading) {
    return (
      <PublicPageLayout maxWidth="lg">
        <Box display="flex" justifyContent="center" sx={{ py: 4 }}>
          <CircularProgress />
        </Box>
      </PublicPageLayout>
    );
  }

  const subscriptions = subscriptionsData?.subscriptions || [];

  return (
    <PublicPageLayout maxWidth={false} disableGutters>
      {/* Hero Section */}
      <Box
        sx={{
          pt: 8,
          pb: 6,
          background:
            theme.palette.mode === "dark"
              ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
              : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
        }}
      >
        <Container maxWidth="sm">
          <Typography
            component="h1"
            variant="h2"
            align="center"
            gutterBottom
            sx={{ fontWeight: 700 }}
          >
            Доступные подписки
          </Typography>
          <Typography variant="h5" align="center" sx={{ opacity: 0.9 }}>
            Выберите подходящий тарифный план для вашей компании
          </Typography>
        </Container>
      </Box>

      {/* Subscription Cards */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={4}
          alignItems="stretch"
          justifyContent="center"
        >
          {subscriptions.map((subscription) => (
            <Box
              key={subscription.subscription_id}
              sx={{
                width: { xs: "100%", md: "33%" },
                maxWidth: 400,
                mx: "auto",
              }}
            >
              <SubscriptionCard subscription={subscription} />
            </Box>
          ))}
        </Stack>
      </Container>
    </PublicPageLayout>
  );
};
