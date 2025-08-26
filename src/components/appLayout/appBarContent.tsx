import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Typography,
  Tooltip,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Button,
  Skeleton,
  Avatar,
  FormControlLabel,
  Switch,
  alpha,
} from "@mui/material";
import {
  Menu as MenuIcon,
  DeveloperMode,
  DarkMode,
  LightMode,
  Add,
} from "@mui/icons-material";
import { getInitials } from "./appLayout";

interface AppBarContentProps {
  isMobile: boolean;
  isDarkMode: boolean;
  theme: any;
  handleDrawerToggle: () => void;
  handleLogoClick: () => void;
  toggleTheme: () => void;
  isSuperadmin: boolean;
  availableCompanies: string[];
  isLoadingCompanyMap: boolean;
  selectedCompanyId: string | null;
  handleCompanyChange: (event: any) => void;
  handleAddCompanyClick: () => void;
  companyMap: Map<string, string>;
  developerMode: boolean;
  onToggleDeveloperMode: () => void;
  user: any;
  handleProfileMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
  getInitials: (name: string) => string;
}

const LOGO_AVATAR_SIZE = 35;
const LOGO_TEXT_VARIANT = "h6";
const LOGO_CONTAINER_GAP = 1.5;
const LOGO_LEFT_PADDING = 2;

export const AppBarContent: React.FC<AppBarContentProps> = ({
  isMobile,
  isDarkMode,
  theme,
  handleDrawerToggle,
  handleLogoClick,
  toggleTheme,
  isSuperadmin,
  availableCompanies,
  isLoadingCompanyMap,
  selectedCompanyId,
  handleCompanyChange,
  handleAddCompanyClick,
  companyMap,
  developerMode,
  onToggleDeveloperMode,
  user,
  handleProfileMenuOpen,
  getInitials,
}) => {
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
        backgroundColor: isDarkMode
          ? "rgba(30, 41, 59, 0.95)"
          : "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
        borderRadius: 0,
      }}
    >
      <Toolbar sx={{ minHeight: "70px !important" }}>
        {isMobile && (
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              mr: 2,
              display: { sm: "none" },
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              "&:hover": {
                bgcolor: alpha(theme.palette.primary.main, 0.2),
              },
            }}
          >
            <MenuIcon />
          </IconButton>
        )}

        <Box
          sx={{ flexGrow: 1, display: "flex", alignItems: "center", gap: 2 }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: LOGO_CONTAINER_GAP,
              cursor: "pointer",
              ml: LOGO_LEFT_PADDING - 2,
            }}
            onClick={handleLogoClick}
          >
            {!isMobile && (
              <>
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
                  sx={{
                    fontWeight: "bold",
                    color: theme.palette.primary.main,
                  }}
                >
                  Observer
                </Typography>
              </>
            )}
          </Box>
          {!isMobile && (
            <Tooltip title={isDarkMode ? "Светлая тема" : "Темная тема"}>
              <IconButton
                onClick={toggleTheme}
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  "&:hover": {
                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                  },
                  borderRadius: 2,
                  padding: 0.8,
                }}
              >
                {isDarkMode ? <LightMode /> : <DarkMode />}
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {!isSuperadmin && (
            <>
              {availableCompanies.length > 0 ? (
                isLoadingCompanyMap ? (
                  <Skeleton
                    variant="rectangular"
                    width={140}
                    height={40}
                    sx={{ borderRadius: 1 }}
                  />
                ) : (
                  <Paper
                    elevation={0}
                    sx={{
                      border: "none",
                    }}
                  >
                    <FormControl size="small" sx={{ minWidth: 140 }}>
                      <InputLabel>Компания</InputLabel>
                      <Select
                        value={selectedCompanyId || ""}
                        onChange={handleCompanyChange}
                        label="Компания"
                        sx={{
                          borderRadius: 1,
                          "& fieldset": {
                            border: "none",
                          },
                          "&:hover fieldset": {
                            border: "none !important",
                          },
                          "&.Mui-focused fieldset": {
                            border: "none !important",
                          },
                        }}
                      >
                        {availableCompanies.map((companyId) => (
                          <MenuItem key={companyId} value={companyId}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Avatar
                                sx={{
                                  width: 24,
                                  height: 24,
                                  fontSize: "0.7rem",
                                  bgcolor: theme.palette.primary.main,
                                  color: "white",
                                }}
                              >
                                {companyMap.get(companyId)
                                  ? getInitials(companyMap.get(companyId)!)
                                  : "O"}
                              </Avatar>
                              {companyMap.get(companyId) || companyId}
                            </Box>
                          </MenuItem>
                        ))}
                        <Divider />
                        <MenuItem
                          onClick={handleAddCompanyClick}
                          sx={{ color: theme.palette.primary.main }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Add fontSize="small" />
                            Добавить компанию
                          </Box>
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Paper>
                )
              ) : (
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={handleAddCompanyClick}
                  size="small"
                  sx={{
                    borderRadius: 1,
                    textTransform: "none",
                    fontWeight: 500,
                  }}
                >
                  Добавить компанию
                </Button>
              )}
            </>
          )}
          {isSuperadmin && (
            <Tooltip
              title={
                developerMode
                  ? "Отключить режим разработчика"
                  : "Включить режим разработчика"
              }
            >
              <Paper
                elevation={0}
                sx={{
                  border: 1,
                  borderColor: developerMode
                    ? theme.palette.warning.main
                    : "divider",
                  borderRadius: 1,
                  bgcolor: developerMode
                    ? alpha(theme.palette.warning.main, 0.1)
                    : "transparent",
                }}
              >
                <FormControlLabel
                  control={
                    <Switch
                      checked={developerMode}
                      onChange={onToggleDeveloperMode}
                      color="warning"
                      size="small"
                    />
                  }
                  label={
                    <DeveloperMode
                      color={developerMode ? "warning" : "disabled"}
                    />
                  }
                  sx={{ m: 0.5, mr: 1 }}
                />
              </Paper>
            </Tooltip>
          )}
          <Tooltip title="Профиль">
            <IconButton
              size="large"
              edge="end"
              onClick={handleProfileMenuOpen}
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                "&:hover": {
                  bgcolor: alpha(theme.palette.primary.main, 0.2),
                },
                borderRadius: 4,
              }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: theme.palette.primary.main,
                  fontSize: "0.8rem",
                  color: "white",
                }}
              >
                {user?.full_name ? getInitials(user.full_name) : "U"}
              </Avatar>
              {!isMobile && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 600, marginLeft: 1 }}
                    >
                      {" "}
                      {user?.full_name || "Пользователь"}
                    </Typography>
                  </Box>
                </Box>
              )}
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
