"use client";

import type React from "react";
import { useAuth } from "../../context/authContext";
import PublicHeader from "./publicHeader";
import { AppBarContent } from "../appLayout/appBarContent";
import { useThemeMode } from "../../context/themeContext";
import { useNavigate } from "react-router-dom";
import { useMediaQuery, useTheme } from "@mui/material";
import { getInitials } from "../appLayout/appLayout";

interface ConditionalNavbarProps {
  // Props for authenticated users
  handleDrawerToggle?: () => void;
  handleProfileMenuOpen?: (event: React.MouseEvent<HTMLElement>) => void;
  developerMode?: boolean;
  onToggleDeveloperMode?: () => void;
  companyMap?: Map<string, string>;
  isLoadingCompanyMap?: boolean;
  handleCompanyChange?: (event: any) => void;
  handleAddCompanyClick?: () => void;
}

const ConditionalNavbar: React.FC<ConditionalNavbarProps> = ({
  handleDrawerToggle,
  handleProfileMenuOpen,
  developerMode = false,
  onToggleDeveloperMode,
  companyMap = new Map(),
  isLoadingCompanyMap = false,
  handleCompanyChange,
  handleAddCompanyClick,
}) => {
  const {
    isAuthenticated,
    isSuperadmin,
    user,
    availableCompanies,
    selectedCompanyId,
  } = useAuth();
  const theme = useThemeMode();
  const navigate = useNavigate();
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));

  if (!isAuthenticated) {
    return <PublicHeader handleDrawerToggle={handleDrawerToggle} />;
  }

  const handleLogoClick = () => {
    navigate("/home");
  };

  const defaultHandleDrawerToggle = () => {
    // Default implementation if not provided
    console.log("Drawer toggle");
  };

  const defaultHandleProfileMenuOpen = (
    event: React.MouseEvent<HTMLElement>
  ) => {
    // Default implementation if not provided
    console.log("Profile menu open");
  };

  const defaultHandleCompanyChange = (event: any) => {
    // Default implementation if not provided
    console.log("Company change:", event.target.value);
  };

  const defaultHandleAddCompanyClick = () => {
    // Default implementation if not provided
    console.log("Add company click");
  };

  const defaultOnToggleDeveloperMode = () => {
    // Default implementation if not provided
    console.log("Toggle developer mode");
  };

  return (
    <AppBarContent
      isMobile={isMobile}
      isDarkMode={theme.isDarkMode}
      theme={muiTheme}
      handleDrawerToggle={handleDrawerToggle || defaultHandleDrawerToggle}
      handleLogoClick={handleLogoClick}
      toggleTheme={theme.toggleTheme}
      isSuperadmin={isSuperadmin}
      availableCompanies={availableCompanies}
      isLoadingCompanyMap={isLoadingCompanyMap}
      selectedCompanyId={selectedCompanyId}
      handleCompanyChange={handleCompanyChange || defaultHandleCompanyChange}
      handleAddCompanyClick={
        handleAddCompanyClick || defaultHandleAddCompanyClick
      }
      companyMap={companyMap}
      developerMode={developerMode}
      onToggleDeveloperMode={
        onToggleDeveloperMode || defaultOnToggleDeveloperMode
      }
      user={user}
      handleProfileMenuOpen={
        handleProfileMenuOpen || defaultHandleProfileMenuOpen
      }
      getInitials={getInitials}
    />
  );
};

export default ConditionalNavbar;
