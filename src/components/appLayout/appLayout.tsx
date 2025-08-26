"use client";

import React, { useMemo, useState } from "react";
import {
  Box,
  CssBaseline,
  Drawer,
  useTheme,
  alpha,
  useMediaQuery,
  type Theme,
  Avatar,
  Typography,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { useThemeMode } from "../../context/themeContext";
import { AddCompanyModal } from "../../pages/companiesPage/addCompanyModal";
import { logoutUser } from "../../api/authApi";
import { useCompanyMap } from "../../hooks/maps/useCompanyMap";
import { FloatingHelpButton } from "../floatingHelpButton";
import { AppBarContent } from "./appBarContent";
import { SidebarContent } from "./sidebarContent";
import { ProfileMenu } from "./profileMenu";
import {
  Business,
  Analytics,
  Schedule,
  Psychology,
  SmartToy,
  Info,
  Group as GroupIcon,
  QuestionAnswer as QuestionAnswerIcon,
  HotelClass as HotelClassIcon,
} from "@mui/icons-material";

const drawerWidth = 205;
const LOGO_AVATAR_SIZE = 35;
const LOGO_TEXT_VARIANT = "h6";
const LOGO_CONTAINER_GAP = 1.5;
const LOGO_LEFT_PADDING = 2;

interface AppLayoutProps {
  children: React.ReactNode;
  developerMode: boolean;
  onToggleDeveloperMode: () => void;
}

export interface AppMenuItem {
  text: string;
  icon?: React.ReactNode;
  path?: string;
  children?: AppMenuItem[];
  badge?: number;
}

export const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

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
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );

  const menuItems: AppMenuItem[] = useMemo(() => {
    const baseItems: AppMenuItem[] = [
      ...(isMobile
        ? [
            {
              text: " Главная",
              icon: (
                <img
                  src="/favicon.ico"
                  alt="Observer Logo"
                  style={{
                    width: LOGO_AVATAR_SIZE - 10,
                    height: LOGO_AVATAR_SIZE - 10,
                    borderRadius: "4px",
                  }}
                />
              ),
              path: "/home",
            },
          ]
        : []),
      { text: "Компании", icon: <Business />, path: "/companies" },
      { text: "Результаты анализов", icon: <Analytics />, path: "/analysis" },
      { text: "Расписания", icon: <Schedule />, path: "/schedules" },
      { text: "Промпты", icon: <Psychology />, path: "/prompts" },
      { text: "Telegram Боты", icon: <SmartToy />, path: "/bots" },
      { text: "Telegram аккаунты", icon: <GroupIcon />, path: "/accounts" },
      { text: "Чаты", icon: <QuestionAnswerIcon />, path: "/chats" },
      { text: "Подписки", icon: <HotelClassIcon />, path: "/subscriptions" },
      {
        text: "Справка",
        icon: <Info />,
        path: "/help",
      },
    ];

    if (!isSuperadmin && availableCompanies.length === 0) {
      return [
        ...(isMobile
          ? [
              {
                text: " Главная",
                icon: (
                  <Avatar
                    sizes="small"
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      width: LOGO_AVATAR_SIZE - 10,
                      height: LOGO_AVATAR_SIZE - 10,
                      fontWeight: "bold",
                      fontSize: 12,
                      color: "white",
                    }}
                  >
                    O
                  </Avatar>
                ),
                path: "/home",
              },
            ]
          : []),
        { text: "Компании", icon: <Business />, path: "/companies" },
        { text: "Справка", icon: <Info />, path: "/help" },
      ];
    }

    return baseItems;
  }, [isSuperadmin, availableCompanies.length, isMobile, theme]);

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

  const handleMenuItemClick = (path?: string) => {
    if (path) {
      navigate(path);
    }
    setMobileOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <AppBarContent
        isMobile={isMobile}
        isDarkMode={isDarkMode}
        theme={theme}
        handleDrawerToggle={handleDrawerToggle}
        handleLogoClick={handleLogoClick}
        toggleTheme={toggleTheme}
        isSuperadmin={isSuperadmin}
        availableCompanies={availableCompanies}
        isLoadingCompanyMap={isLoadingCompanyMap}
        selectedCompanyId={selectedCompanyId}
        handleCompanyChange={handleCompanyChange}
        handleAddCompanyClick={handleAddCompanyClick}
        companyMap={companyMap}
        developerMode={developerMode}
        onToggleDeveloperMode={onToggleDeveloperMode}
        user={user}
        handleProfileMenuOpen={handleProfileMenuOpen}
        getInitials={getInitials}
      />

      <AddCompanyModal
        open={addCompanyModalOpen}
        onClose={() => setAddCompanyModalOpen(false)}
        onSuccess={handleCompanyAdded}
      />

      <ProfileMenu
        anchorEl={anchorEl}
        handleProfileMenuClose={handleProfileMenuClose}
        navigate={navigate}
        handleLogout={handleLogout}
        theme={theme}
      />

      {((!isHomePage && !isMobile) || isMobile) && (
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
                width: "100%",
                height: "100%",
                border: "none",
                backgroundColor: isDarkMode
                  ? theme.palette.background.default
                  : theme.palette.background.paper,
                zIndex: (theme) => theme.zIndex.drawer + 5,
              },
            }}
          >
            <SidebarContent
              menuItems={menuItems}
              location={location}
              handleMenuItemClick={handleMenuItemClick}
              isDarkMode={isDarkMode}
              theme={theme}
              isMobile={isMobile}
              toggleTheme={toggleTheme}
            />
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
            <SidebarContent
              menuItems={menuItems}
              location={location}
              handleMenuItemClick={handleMenuItemClick}
              isDarkMode={isDarkMode}
              theme={theme}
              isMobile={isMobile}
              toggleTheme={toggleTheme}
            />
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
        <FloatingHelpButton />
      </Box>
    </Box>
  );
};

export default AppLayout;
