"use client";

// src/components/AppLayout.tsx
import React, { useMemo, useState } from "react";
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  Chip,
  Switch,
  FormControlLabel,
  Tooltip,
  Select,
  FormControl,
  InputLabel,
  Button,
  Skeleton,
  Avatar,
  Badge,
  Divider,
  Paper,
  useTheme,
  alpha,
  Link,
} from "@mui/material";
import {
  Menu as MenuIcon,
  SmartToy,
  Psychology,
  Schedule,
  Analytics,
  Business,
  ExitToApp,
  Person,
  Add,
  Info,
  DeveloperMode,
  DarkMode,
  LightMode,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useThemeMode } from "../context/themeContext";
import { AddCompanyModal } from "../pages/companiesPage/addCompanyModal";
import { logoutUser } from "../api/authApi";
import { useCompanyMap } from "../hooks/maps/useCompanyMap";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import GroupIcon from "@mui/icons-material/Group";

const drawerWidth = 205; // Уменьшил ширину сайдбара
const LOGO_AVATAR_SIZE = 35;
const LOGO_TEXT_VARIANT = "h6";
const LOGO_CONTAINER_GAP = 1.5;
const LOGO_LEFT_PADDING = 2;

interface AppLayoutProps {
  children: React.ReactNode;
  developerMode: boolean;
  onToggleDeveloperMode: () => void;
}

interface AppMenuItem {
  text: string;
  icon?: React.ReactNode;
  path?: string;
  children?: AppMenuItem[];
  badge?: number;
}

const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  developerMode,
  onToggleDeveloperMode,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [addCompanyModalOpen, setAddCompanyModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { isDarkMode, toggleTheme } = useThemeMode();
  const {
    isSuperadmin,
    user,
    logout,
    selectedCompanyId,
    availableCompanies,
    setSelectedCompanyId,
    checkAuth,
  } = useAuth();
  const { companyMap, isLoadingCompanyMap } = useCompanyMap();

  const isHomePage = location.pathname === "/home";

  const menuItems: AppMenuItem[] = useMemo(() => {
    const baseItems: AppMenuItem[] = [
      { text: "Компании", icon: <Business />, path: "/companies" },
      { text: "Результаты анализов", icon: <Analytics />, path: "/analysis" },
      { text: "Расписания", icon: <Schedule />, path: "/schedules" },
      { text: "Промпты", icon: <Psychology />, path: "/prompts" },
      { text: "Telegram Боты", icon: <SmartToy />, path: "/bots" },
      { text: "Telegram аккаунты", icon: <GroupIcon />, path: "/accounts" },
      { text: "Чаты", icon: <QuestionAnswerIcon />, path: "/chats" },
      {
        text: "Справка",
        icon: <Info />,
        path: "/help",
      },
    ];

    if (!isSuperadmin && availableCompanies.length === 0) {
      return [
        { text: "Компании", icon: <Business />, path: "/companies" },
        { text: "Справка", icon: <Info />, path: "/help" },
      ];
    }

    return baseItems;
  }, [isSuperadmin, availableCompanies.length]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logoutUser();
    logout();
    handleProfileMenuClose();
  };

  const handleLogoClick = () => {
    navigate("/home");
  };

  const handleCompanyChange = (event: any) => {
    setSelectedCompanyId(event.target.value as string);
  };

  const handleAddCompanyClick = () => {
    setAddCompanyModalOpen(true);
  };

  const handleCompanyAdded = async () => {
    setAddCompanyModalOpen(false);
    await checkAuth();
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const drawer = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ flexGrow: 1, overflow: "auto", py: 0 }}>
        {/* Уменьшил вертикальный padding */}
        <List sx={{ px: 0 }}>
          {/* Убрал горизонтальный padding */}
          {menuItems.map((item) => (
            <React.Fragment key={item.text}>
              {item.children ? (
                <>
                  <ListItem disablePadding sx={{ mb: 0.25 }}>
                    {/* Уменьшил отступ снизу */}
                    <ListItemButton
                      selected={item.children.some((child) =>
                        location.pathname.startsWith(child.path || "")
                      )}
                      onClick={() =>
                        item.children && navigate(item.children[0].path || "/")
                      }
                      sx={{
                        borderRadius: 1, // Уменьшил радиус скругления
                        mx: 0.5, // Уменьшил горизонтальные отступы
                        py: 0.75, // Уменьшил вертикальные отступы
                        "&.Mui-selected": {
                          backgroundColor: alpha(
                            theme.palette.primary.main,
                            0.1
                          ),
                          "&:hover": {
                            backgroundColor: alpha(
                              theme.palette.primary.main,
                              0.15
                            ),
                          },
                        },
                        "&:hover": {
                          backgroundColor: alpha(
                            theme.palette.primary.main,
                            0.05
                          ),
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          color: theme.palette.text.secondary,
                          minWidth: 32, // Уменьшил минимальную ширину иконки
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.text}
                        primaryTypographyProps={{
                          variant: "body2",
                          fontWeight: 500,
                          fontSize: "0.95rem", // Уменьшил размер шрифта
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                  {item.children.map((child) => (
                    <ListItem key={child.text} disablePadding sx={{ mb: 0.25 }}>
                      {/* Уменьшил отступ снизу */}
                      <ListItemButton
                        selected={location.pathname.startsWith(
                          child.path || ""
                        )}
                        onClick={() => navigate(child.path || "/")}
                        sx={{
                          borderRadius: 0.5,
                          mx: 1, // Уменьшил горизонтальные отступы
                          py: 0.5, // Уменьшил вертикальные отступы
                          "&.Mui-selected": {
                            backgroundColor: alpha(
                              theme.palette.primary.main,
                              0.1
                            ),
                            "&:hover": {
                              backgroundColor: alpha(
                                theme.palette.primary.main,
                                0.15
                              ),
                            },
                          },
                          "&:hover": {
                            backgroundColor: alpha(
                              theme.palette.primary.main,
                              0.05
                            ),
                          },
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 28, // Уменьшил минимальную ширину иконки
                            color: theme.palette.text.secondary,
                          }}
                        >
                          {child.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={child.text}
                          primaryTypographyProps={{
                            variant: "body2",
                            fontSize: "0.95rem", // Уменьшил размер шрифта
                            fontWeight: 400,
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </>
              ) : (
                <ListItem key={item.text} disablePadding sx={{ mb: 0.25 }}>
                  {/* Уменьшил отступ снизу */}
                  <ListItemButton
                    selected={location.pathname.startsWith(item.path || "")}
                    onClick={() => navigate(item.path || "/")}
                    sx={{
                      borderRadius: 0.5,
                      mx: 0.5, // Уменьшил горизонтальные отступы
                      py: 0.75, // Уменьшил вертикальные отступы
                      "&.Mui-selected": {
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        "&:hover": {
                          backgroundColor: alpha(
                            theme.palette.primary.main,
                            0.15
                          ),
                        },
                      },
                      "&:hover": {
                        backgroundColor: alpha(
                          theme.palette.primary.main,
                          0.05
                        ),
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{ color: theme.palette.text.secondary, minWidth: 32 }} // Уменьшил минимальную ширину иконки
                    >
                      {item.badge ? (
                        <Badge badgeContent={item.badge} color="error">
                          {item.icon}
                        </Badge>
                      ) : (
                        item.icon
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        variant: "body2",
                        fontWeight: 500,
                        fontSize: "0.95rem", // Уменьшил размер шрифта
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              )}
            </React.Fragment>
          ))}
        </List>
      </Box>

      {/* Добавленные ссылки внизу сайдбара */}
      <Box sx={{ py: 0.75, px: 1.5 }}>
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
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          width: "100%",
          zIndex: (theme) => theme.zIndex.drawer - 1,
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
          {!isHomePage && (
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
              <Avatar
                sx={{
                  bgcolor: theme.palette.primary.main,
                  width: LOGO_AVATAR_SIZE,
                  height: LOGO_AVATAR_SIZE,
                  fontWeight: "bold",
                  color: "white",
                }}
              >
                O
              </Avatar>
              <Typography
                variant={LOGO_TEXT_VARIANT}
                noWrap
                component="div"
                sx={{ fontWeight: "bold", color: theme.palette.primary.main }}
              >
                Observer
              </Typography>
            </Box>
            <Tooltip title={isDarkMode ? "Светлая тема" : "Темная тема"}>
              <IconButton
                onClick={toggleTheme}
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  "&:hover": {
                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                  },
                  borderRadius: 1,
                }}
              >
                {isDarkMode ? <LightMode /> : <DarkMode />}
              </IconButton>
            </Tooltip>
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
                        // border: 1,
                        border: "none", // Убираем границу полностью

                        borderColor: "divider",
                        borderRadius: 1,
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
                              border: "none", // Основная граница
                            },
                            "&:hover fieldset": {
                              border: "none !important", // Ховер-состояние
                            },
                            "&.Mui-focused fieldset": {
                              border: "none !important", // Фокус-состояние
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
            {/* <Tooltip title={isDarkMode ? "Светлая тема" : "Темная тема"}>
              <IconButton
                onClick={toggleTheme}
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  "&:hover": {
                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                  },
                  borderRadius: 1,
                }}
              >
                {isDarkMode ? <LightMode /> : <DarkMode />}
              </IconButton>
            </Tooltip> */}
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
                  }}
                >
                  {user?.full_name ? getInitials(user.full_name) : "U"}
                </Avatar>
                {/* </IconButton>
            </Tooltip> */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 600, marginLeft: 1 }}
                    >
                      {" "}
                      {user?.full_name || "Пользователь"}
                    </Typography>
                    {/* {isSuperadmin && (
                      <Chip
                        label="Суперадмин"
                        size="small"
                        color="primary"
                        sx={{ height: 20, fontSize: "0.7rem", borderRadius: 1 }}
                      />
                    )} */}
                  </Box>
                </Box>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      <AddCompanyModal
        open={addCompanyModalOpen}
        onClose={() => setAddCompanyModalOpen(false)}
        onSuccess={handleCompanyAdded}
      />

      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        slotProps={{
          paper: {
            elevation: 8,
            sx: {
              mt: 1,
              borderRadius: 1,
              minWidth: 200,
              "& .MuiMenuItem-root": {
                borderRadius: 1,
                mx: 1,
                my: 0.5,
              },
            },
          },
        }}
      >
        <MenuItem
          onClick={() => {
            navigate("/account");
            handleProfileMenuClose();
          }}
        >
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Мой профиль" />
        </MenuItem>

        <Divider sx={{ my: 1 }} />

        <MenuItem
          onClick={handleLogout}
          sx={{ color: theme.palette.error.main }}
        >
          <ListItemIcon>
            <ExitToApp fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText primary="Выйти из системы" />
        </MenuItem>
      </Menu>

      {!isHomePage && (
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
          aria-label="navigation menu"
        >
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
                border: "none",
                boxShadow: theme.shadows[8],
                left: "8px",
                borderRadius: 1,
                top: "82px",
                height: "calc(100% - 90px)",
              },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", sm: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
                border: "none",
                borderRight: 1,
                borderColor: "divider",
                left: "8px",
                borderRadius: "16px",
                top: "82px",
                height: "calc(100% - 90px)",
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: "90px",
          pb: 3,
          width: { sm: isHomePage ? "100%" : `calc(100% - ${drawerWidth}px)` },
          minHeight: "100vh",
          backgroundColor: isDarkMode
            ? alpha(theme.palette.grey[50], 0.3)
            : alpha(theme.palette.grey[50], 0.3),
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default AppLayout;
