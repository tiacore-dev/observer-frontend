"use client";

import type React from "react";
import { Box, Container, Drawer, useMediaQuery, useTheme } from "@mui/material";
import { useState } from "react";
import { useAuth } from "../../context/authContext";
import { useThemeMode } from "../../context/themeContext";
import ConditionalNavbar from "./conditionalNavbar";
import AppLayout from "../appLayout/appLayout";
import { PublicSidebar } from "./publicSidebar";

const DRAWER_WIDTH = 205;
const NAVBAR_HEIGHT = "70px";

interface PublicPageLayoutProps {
  children: React.ReactNode;
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

      <Box sx={{ display: "flex", flexGrow: 1, pt: NAVBAR_HEIGHT }}>
        {!isMobile && (
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
                  borderRight: 1,
                  borderColor: "divider",
                  backgroundColor: theme.isDarkMode ? "#1e293b" : "#ffffff",
                  left: "8px",
                  borderRadius: "16px",
                  top: `calc(${NAVBAR_HEIGHT} + 12px)`,
                  height: `calc(100% - ${NAVBAR_HEIGHT} - 20px)`,
                },
              }}
              open
            >
              <PublicSidebar isMobile={false} />
            </Drawer>
          </Box>
        )}

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
              width: "100%",
              height: "100%",
              border: "none",
              backgroundColor: theme.isDarkMode
                ? muiTheme.palette.background.default
                : muiTheme.palette.background.paper,
              zIndex: (theme) => theme.zIndex.drawer + 5,
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
            minHeight: `calc(100vh - ${NAVBAR_HEIGHT})`,
            backgroundColor: theme.isDarkMode ? "#0f172a" : "#f8fafc",
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
