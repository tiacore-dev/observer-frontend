"use client";

import type React from "react";
import { useState } from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  Divider,
  Paper,
  useTheme,
  useMediaQuery,
  Button,
  Card,
  CardContent,
  Stack,
  alpha,
  Fade,
  Container,
} from "@mui/material";
import {
  ExpandMore,
  Telegram,
  ContactSupport,
  ArrowForward,
  Support,
  HelpOutline,
} from "@mui/icons-material";
import PublicPageLayout from "../../components/publicLayout/publicPageLayout";
import { faqItems } from "./faqItems";
import { helpSections } from "./helpSections";

export const HelpPage: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState<string | false>(
    "quick-start"
  );
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleAccordionChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedSection(isExpanded ? panel : false);
    };

  return (
    <PublicPageLayout maxWidth={false} disableGutters>
      {/* <Container maxWidth="lg"> */}
      <Paper
        elevation={isMobile ? 0 : 1}
        sx={{
          p: isMobile ? 1.5 : 3,
          mt: -1.5,
          ml: 2,
          mr: 1,
          borderRadius: 2,
          background: theme.palette.background.paper,
        }}
      >
        {/* Заголовок */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant={isMobile ? "h4" : "h3"}
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              backgroundClip: "text",
              textFillColor: "transparent",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Центр помощи Observer
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 600, mx: "auto" }}
          >
            Все, что нужно знать для эффективной работы с системой
          </Typography>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* Блок поддержки */}
        <Fade in={true} timeout={800}>
          <Card
            sx={{
              mb: 4,
              background: `linear-gradient(135deg, ${alpha(
                theme.palette.primary.main,
                0.1
              )} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              borderRadius: 2,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack
                direction={isMobile ? "column" : "row"}
                spacing={3}
                alignItems="center"
                justifyContent="space-between"
              >
                <Box sx={{ flex: 1 }}>
                  <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                    <ContactSupport color="primary" />
                    <Typography variant="h6" fontWeight={600}>
                      Нужна помощь или хотите поделиться идеей?
                    </Typography>
                  </Stack>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    Прежде чем писать в поддержку, проверьте разделы "Быстрый
                    старт" и "Решение проблем" - там есть ответы на большинство
                    вопросов
                  </Typography>

                  <Button
                    variant="contained"
                    startIcon={<Telegram />}
                    href="https://t.me/tiacore_support_bot"
                    target="_blank"
                    sx={{
                      textTransform: "none",
                      borderRadius: 2,
                      px: 3,
                      py: 1,
                    }}
                  >
                    Написать в поддержку
                  </Button>
                </Box>

                <Box
                  sx={{
                    display: { xs: "none", md: "block" },
                    flexShrink: 0,
                  }}
                >
                  {/* <Support
                      sx={{
                        fontSize: 80,
                        color: alpha(theme.palette.primary.main, 0.3),
                      }}
                    /> */}
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Fade>

        {/* Содержание справки */}
        <Box>
          {helpSections.map((section) => (
            <Accordion
              key={section.id}
              expanded={expandedSection === section.id}
              onChange={handleAccordionChange(section.id)}
              sx={{
                mb: 1,
                borderRadius: "12px !important",
                "&:before": {
                  display: "none",
                },
                "&.Mui-expanded": {
                  margin: "16px 0",
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                sx={{
                  borderRadius: 2,
                  backgroundColor:
                    expandedSection === section.id
                      ? alpha(theme.palette.primary.main, 0.05)
                      : "transparent",
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.03),
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box sx={{ color: theme.palette.primary.main }}>
                    {section.icon}
                  </Box>
                  <Typography variant="h6" fontWeight={600}>
                    {section.title}
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 3 }}>
                {section.content}
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>

        {/* FAQ Section */}
        <Accordion
          expanded={expandedSection === "faq"}
          onChange={handleAccordionChange("faq")}
          sx={{
            mb: 1,
            borderRadius: "12px !important",
            "&:before": {
              display: "none",
            },
            "&.Mui-expanded": {
              margin: "16px 0",
            },
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMore />}
            sx={{
              borderRadius: 2,
              backgroundColor:
                expandedSection === "faq"
                  ? alpha(theme.palette.primary.main, 0.05)
                  : "transparent",
              "&:hover": {
                backgroundColor: alpha(theme.palette.primary.main, 0.03),
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ color: theme.palette.primary.main }}>
                <HelpOutline color="primary" />
              </Box>
              <Typography variant="h6" fontWeight={600}>
                FAQ
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 3 }}>
            <Box>
              {faqItems.map((item, index) => (
                <Accordion key={index} sx={{ mb: 0.5 }}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {item.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ pt: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{ fontSize: isMobile ? "0.8rem" : "inherit" }}
                    >
                      {item.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Дополнительная помощь */}
        {/* <Fade in={true} timeout={1200}> */}
        <Card
          sx={{
            mt: 4,
            p: 3,
            textAlign: "center",
            background: `linear-gradient(135deg, ${alpha(
              theme.palette.success.main,
              0.1
            )} 0%, ${alpha(theme.palette.info.main, 0.1)} 100%)`,
            border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
            borderRadius: 2,
          }}
        >
          <Support color="success" sx={{ fontSize: 48, mb: 2 }} />
          <Typography variant="h6" gutterBottom fontWeight={600}>
            Все еще нужна помощь?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Если вы не нашли ответ в руководстве, наша команда поддержки всегда
            готова помочь вам
          </Typography>
          <Button
            variant="outlined"
            endIcon={<ArrowForward />}
            href="https://t.me/tiacore_support_bot"
            target="_blank"
            sx={{
              textTransform: "none",
              borderRadius: 2,
              borderColor: theme.palette.success.main,
              color: theme.palette.success.main,
              "&:hover": {
                backgroundColor: alpha(theme.palette.success.main, 0.1),
                borderColor: theme.palette.success.dark,
              },
            }}
          >
            Связаться с поддержкой
          </Button>
        </Card>
        {/* </Fade> */}
      </Paper>
      {/* </Container> */}
    </PublicPageLayout>
  );
};
