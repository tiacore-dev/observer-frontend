"use client";

import type React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Link,
  alpha,
} from "@mui/material";
import {
  Close,
  DarkMode,
  LightMode,
  CreditCard,
  Help,
} from "@mui/icons-material";
import { useThemeMode } from "../../context/themeContext";

interface PublicSidebarProps {
  isMobile: boolean;
  onClose?: () => void;
}

const LOGO_AVATAR_SIZE = 35;
const LOGO_TEXT_VARIANT = "h6";
const LOGO_CONTAINER_GAP = 1.5;

export const PublicSidebar: React.FC<PublicSidebarProps> = ({
  isMobile,
  onClose,
}) => {
  const { isDarkMode, toggleTheme } = useThemeMode();

  const publicMenuItems = [
    {
      text: "Тарифы",
      icon: <CreditCard />,
      path: "/subscriptions",
    },
    {
      text: "Справка",
      icon: <Help />,
      path: "/help",
    },
  ];

  const handleMenuItemClick = (path?: string) => {
    if (path) {
      window.location.href = path;
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {isMobile && (
        <Box
          sx={{
            display: { xs: "flex", sm: "none" },
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: LOGO_CONTAINER_GAP,
            }}
          >
            <img
              src="/favicon.ico"
              alt="Observer Logo"
              style={{
                width: LOGO_AVATAR_SIZE,
                height: LOGO_AVATAR_SIZE,
                borderRadius: "4px",
              }}
            />
            <Typography
              variant={LOGO_TEXT_VARIANT}
              noWrap
              component="div"
              sx={{ fontWeight: "bold", color: "primary.main" }}
            >
              Observer
            </Typography>
          </Box>
          <IconButton onClick={onClose} sx={{ display: { sm: "none" } }}>
            <Close />
          </IconButton>
        </Box>
      )}

      <Box sx={{ flexGrow: 1, overflow: "auto", py: 0 }}>
        <List sx={{ px: 0 }}>
          {publicMenuItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.25 }}>
              <ListItemButton
                selected={window.location.pathname === item.path}
                onClick={() => handleMenuItemClick(item.path)}
                sx={{
                  borderRadius: 0.5,
                  mx: 0.5,
                  py: 0.75,
                  "&.Mui-selected": {
                    backgroundColor: alpha("#1976d2", 0.1),
                    "&:hover": {
                      backgroundColor: alpha("#1976d2", 0.15),
                    },
                  },
                  "&:hover": {
                    backgroundColor: alpha("#1976d2", 0.05),
                  },
                }}
              >
                <ListItemIcon sx={{ color: "text.secondary", minWidth: 32 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    variant: "body2",
                    fontWeight: 500,
                    fontSize: "0.95rem",
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      <Box sx={{ py: 0.75, px: 1.5 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Link
              href="/privacy"
              variant="body2"
              color="grey.400"
              sx={{
                fontSize: "12px",
                textDecoration: "none",
                "&:hover": {
                  color: "primary.main",
                  textDecoration: "underline",
                },
              }}
            >
              Политика конфиденциальности
            </Link>
            <Link
              href="/terms"
              variant="body2"
              color="grey.400"
              sx={{
                fontSize: "12px",
                textDecoration: "none",
                "&:hover": {
                  color: "primary.main",
                  textDecoration: "underline",
                },
              }}
            >
              Пользовательское соглашение
            </Link>
          </Box>

          {isMobile && (
            <IconButton
              onClick={toggleTheme}
              sx={{
                bgcolor: alpha("#1976d2", 0.1),
                "&:hover": {
                  bgcolor: alpha("#1976d2", 0.2),
                },
                borderRadius: 2,
                padding: 0.8,
              }}
            >
              {isDarkMode ? <LightMode /> : <DarkMode />}
            </IconButton>
          )}
        </Box>
      </Box>
    </Box>
  );
};
