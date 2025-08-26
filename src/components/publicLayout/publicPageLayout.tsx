"use client";

import type React from "react";
import { Box, Container, Drawer, useMediaQuery, useTheme } from "@mui/material";
import { useState } from "react";
import { useAuth } from "../../context/authContext";
import { useThemeMode } from "../../context/themeContext";
import ConditionalNavbar from "./conditionalNavbar";
import AppLayout from "../appLayout/appLayout";
import { PublicSidebar } from "./publicSidebar";

const DRAWER_WIDTH = 240;

interface PublicPageLayoutProps {
  children: React.ReactNode;
  // Optional props for authenticated users when they need specific functionality
  handleDrawerToggle?: () => void;
  handleProfileMenuOpen?: (event: React.MouseEvent<HTMLElement>) => void;
  developerMode?: boolean;
  onToggleDeveloperMode?: () => void;
  companyMap?: Map<string, string>;
  isLoadingCompanyMap?: boolean;
  handleCompanyChange?: (event: any) => void;
  handleAddCompanyClick?: () => void;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | false;
  disableGutters?: boolean;
}

const PublicPageLayout: React.FC<PublicPageLayoutProps> = ({
  children,
  handleDrawerToggle,
  handleProfileMenuOpen,
  developerMode = false,
  onToggleDeveloperMode,
  companyMap,
  isLoadingCompanyMap,
  handleCompanyChange,
  handleAddCompanyClick,
  maxWidth = "lg",
  disableGutters = false,
}) => {
  const { isAuthenticated } = useAuth();
  const theme = useThemeMode();
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerTogglePublic = () => {
    setMobileOpen(!mobileOpen);
  };

  if (isAuthenticated) {
    return (
      <AppLayout
        developerMode={developerMode}
        onToggleDeveloperMode={onToggleDeveloperMode || (() => {})}
      >
        <Container
          maxWidth={maxWidth}
          disableGutters={disableGutters}
          sx={{
            py: 3,
            px: disableGutters ? 0 : { xs: 2, sm: 3 },
          }}
        >
          {children}
        </Container>
      </AppLayout>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: theme.isDarkMode ? "#0f172a" : "#f8fafc",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <ConditionalNavbar
        handleDrawerToggle={handleDrawerToggle || handleDrawerTogglePublic}
        handleProfileMenuOpen={handleProfileMenuOpen}
        developerMode={developerMode}
        onToggleDeveloperMode={onToggleDeveloperMode}
        companyMap={companyMap}
        isLoadingCompanyMap={isLoadingCompanyMap}
        handleCompanyChange={handleCompanyChange}
        handleAddCompanyClick={handleAddCompanyClick}
      />

      <Box sx={{ display: "flex", flexGrow: 1, pt: "70px" }}>
        <Box
          component="nav"
          sx={{
            width: { sm: DRAWER_WIDTH },
            flexShrink: { sm: 0 },
            display: { xs: "none", sm: "block" },
          }}
        >
          <Drawer
            variant="permanent"
            sx={{
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: DRAWER_WIDTH,
                top: "70px",
                height: "calc(100vh - 70px)",
                borderRight: 1,
                borderColor: "divider",
                backgroundColor: theme.isDarkMode ? "#1e293b" : "#ffffff",
              },
            }}
            open
          >
            <PublicSidebar isMobile={false} />
          </Drawer>
        </Box>

        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerTogglePublic}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: DRAWER_WIDTH,
              backgroundColor: theme.isDarkMode ? "#1e293b" : "#ffffff",
            },
          }}
        >
          <PublicSidebar isMobile={true} onClose={handleDrawerTogglePublic} />
        </Drawer>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
            minHeight: "calc(100vh - 70px)",
          }}
        >
          <Container
            maxWidth={maxWidth}
            disableGutters={disableGutters}
            sx={{
              py: 3,
              px: disableGutters ? 0 : { xs: 2, sm: 3 },
            }}
          >
            {children}
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default PublicPageLayout;
