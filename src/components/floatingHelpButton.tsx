"use client";

import type React from "react";
import { useState } from "react";
import {
  Fab,
  Popover,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Button,
  useTheme,
  alpha,
  useMediaQuery,
} from "@mui/material";
import {
  Help,
  MenuBook,
  Telegram,
  Email,
  QuestionAnswer,
  Close,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export const FloatingHelpButton: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigateToHelp = () => {
    navigate("/help");
    handleClose();
  };

  const open = Boolean(anchorEl);

  const quickHelpItems = [
    {
      text: "Справочная система",
      icon: <MenuBook />,
      action: handleNavigateToHelp,
    },
    {
      text: "FAQ",
      icon: <QuestionAnswer />,
      action: () => {
        navigate("/help");
        handleClose();
      },
    },
  ];

  return (
    <>
      <Fab
        color="primary"
        onClick={handleClick}
        sx={{
          position: "fixed",
          bottom: isMobile ? 16 : 20,
          right: isMobile ? 16 : 20,
          zIndex: 1000,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          "&:hover": {
            background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
            transform: "scale(1.05)",
          },
          transition: "all 0.2s ease-in-out",
          boxShadow: `0 4px 8px ${alpha(theme.palette.primary.main, 0.4)}`,
        }}
      >
        {open ? <Close /> : <Help />}
      </Fab>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        slotProps={{
          paper: {
            sx: {
              width: 280,
              borderRadius: 2,
              boxShadow: `0 8px 32px ${alpha(
                theme.palette.common.black,
                0.12
              )}`,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            },
          },
        }}
      >
        <Paper sx={{ p: 0 }}>
          <Box sx={{ p: 2, pb: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
              Чем могу помочь?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Выберите способ получения помощи
            </Typography>
          </Box>

          <List dense sx={{ py: 0 }}>
            {quickHelpItems.map((item, index) => (
              <ListItem key={index} disablePadding sx={{ mx: 1 }}>
                <ListItemButton
                  onClick={item.action}
                  sx={{
                    borderRadius: 1,
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.primary.main, 0.08),
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{ variant: "body2" }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 1 }} />

          <Box sx={{ p: 2, pt: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Нужна помощь или хотите поделиться идеей?{" "}
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="contained"
                size="small"
                startIcon={<Telegram />}
                href="https://t.me/tiacore_support_bot"
                target="_blank"
                sx={{
                  flex: 1,
                  textTransform: "none",
                  fontSize: "0.75rem",
                }}
              >
                Telegram
              </Button>
            </Box>
          </Box>
        </Paper>
      </Popover>
    </>
  );
};
