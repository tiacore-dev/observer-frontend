"use client";

import type React from "react";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { DarkMode, LightMode, Menu } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useThemeMode } from "../../context/themeContext";

interface PublicHeaderProps {
  handleDrawerToggle?: () => void;
}

const PublicHeader: React.FC<PublicHeaderProps> = ({ handleDrawerToggle }) => {
  const navigate = useNavigate();
  const theme = useThemeMode();
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));

  return (
    <Paper
      sx={{
        py: 0,
        px: 2,
        background: theme.isDarkMode
          ? "rgba(30, 41, 59, 0.95)"
          : "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
        borderBottom: 1,
        borderColor: "divider",
        borderRadius: 0,
        position: "sticky",
        top: 0,
        zIndex: 1000,
        height: "70px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {isMobile && handleDrawerToggle && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 1, display: { sm: "none" } }}
          >
            <Menu />
          </IconButton>
        )}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            cursor: "pointer",
            textDecoration: "none",
            color: "inherit",
          }}
          onClick={() => navigate("/")}
        >
          <img
            src="/favicon.ico"
            alt="Observer Logo"
            style={{
              width: 35,
              height: 35,
              borderRadius: "4px",
            }}
          />
          {!isMobile && (
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: theme.isDarkMode ? "#6366f1" : "#6366f1",
              }}
            >
              Observer
            </Typography>
          )}
        </Box>
        <Tooltip title={theme.isDarkMode ? "Светлая тема" : "Темная тема"}>
          <IconButton
            onClick={theme.toggleTheme}
            sx={{
              bgcolor: theme.isDarkMode
                ? "rgba(99, 102, 241, 0.1)"
                : "rgba(99, 102, 241, 0.1)",
              "&:hover": {
                bgcolor: theme.isDarkMode
                  ? "rgba(99, 102, 241, 0.2)"
                  : "rgba(99, 102, 241, 0.2)",
              },
              borderRadius: 4,
            }}
          >
            {theme.isDarkMode ? <LightMode /> : <DarkMode />}
          </IconButton>
        </Tooltip>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Button
          variant="outlined"
          onClick={() => navigate("/login")}
          sx={{
            borderRadius: "8px",
            borderColor: theme.isDarkMode
              ? "rgba(51, 65, 85, 0.5)"
              : "rgba(226, 232, 240, 0.8)",
            color: theme.isDarkMode ? "#cbd5e1" : "#475569",
            fontSize: "0.875rem",
            padding: "6px 16px",
            "&:hover": {
              borderColor: theme.isDarkMode ? "#818cf8" : "#6366f1",
              backgroundColor: theme.isDarkMode
                ? "rgba(129, 140, 248, 0.08)"
                : "rgba(99, 102, 241, 0.04)",
            },
          }}
        >
          Войти
        </Button>
        <Button
          variant="contained"
          onClick={() => navigate("/login")}
          sx={{
            borderRadius: "8px",
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            boxShadow: "0 2px 8px rgba(99, 102, 241, 0.2)",
            fontSize: "0.875rem",
            padding: "6px 20px",
            "&:hover": {
              background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
              boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
            },
          }}
        >
          Регистрация
        </Button>
      </Box>
    </Paper>
  );
};

export default PublicHeader;
