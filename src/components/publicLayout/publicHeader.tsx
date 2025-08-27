"use client";

import type React from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
  alpha,
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
    <AppBar
      position="fixed"
      color="inherit"
      elevation={0}
      sx={{
        width: "100%",
        zIndex: (theme) => theme.zIndex.drawer + 1,
        borderBottom: 1,
        borderColor: "divider",
        backgroundColor: theme.isDarkMode
          ? "rgba(30, 41, 59, 0.95)"
          : "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
        borderRadius: 0,
      }}
    >
      <Toolbar sx={{ minHeight: "70px !important" }}>
        {isMobile && handleDrawerToggle && (
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              mr: 2,
              display: { sm: "none" },
              bgcolor: alpha(muiTheme.palette.primary.main, 0.1),
              "&:hover": {
                bgcolor: alpha(muiTheme.palette.primary.main, 0.2),
              },
            }}
          >
            <Menu />
          </IconButton>
        )}

        <Box
          sx={{ flexGrow: 1, display: "flex", alignItems: "center", gap: 2 }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              cursor: "pointer",
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
                  color: muiTheme.palette.primary.main,
                }}
              >
                Observer
              </Typography>
            )}
          </Box>
          <IconButton
            onClick={theme.toggleTheme}
            sx={{
              bgcolor: alpha(muiTheme.palette.primary.main, 0.1),
              "&:hover": {
                bgcolor: alpha(muiTheme.palette.primary.main, 0.2),
              },
              borderRadius: 2,
              padding: 0.8,
            }}
          >
            {theme.isDarkMode ? <LightMode /> : <DarkMode />}
          </IconButton>
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
                borderColor: muiTheme.palette.primary.main,
                backgroundColor: alpha(muiTheme.palette.primary.main, 0.04),
              },
            }}
          >
            Войти
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate("/register")}
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
      </Toolbar>
    </AppBar>
  );
};

export default PublicHeader;
