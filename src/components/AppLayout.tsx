// src/components/AppLayout.tsx
import React, { useState } from "react";
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
} from "@mui/material";
import {
  Menu as MenuIcon,
  SmartToy,
  Psychology,
  Schedule,
  Analytics,
  Chat,
  AccountCircle,
  Business,
  ExitToApp,
  Person,
  Settings,
  Add,
} from "@mui/icons-material";
import GroupsIcon from "@mui/icons-material/Groups";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { AddCompanyModal } from "../pages/companiesPage/companyAddModal";

const drawerWidth = 240;

interface AppLayoutProps {
  children: React.ReactNode;
  developerMode: boolean;
  onToggleDeveloperMode: () => void;
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
  const {
    isSuperadmin,
    user,
    logout,
    selectedCompanyId,
    availableCompanies,
    setSelectedCompanyId,
    checkAuth,
  } = useAuth();

  const isHomePage = location.pathname === "/home";

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
    // Обновляем токен после добавления компании
    await checkAuth();
  };

  const menuItems = [
    { text: "Боты", icon: <SmartToy />, path: "/bots" },
    { text: "Промпты", icon: <Psychology />, path: "/prompts" },
    { text: "Расписания", icon: <Schedule />, path: "/schedules" },
    { text: "Анализ", icon: <Analytics />, path: "/analysis" },
    { text: "Компании", icon: <Business />, path: "/companies" },
  ];

  const drawer = (
    <div>
      <Toolbar>
        <Typography
          variant="h6"
          noWrap
          component="div"
          onClick={handleLogoClick}
          sx={{ cursor: "pointer" }}
        >
          Observer
        </Typography>
      </Toolbar>
      {!isHomePage && (
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={location.pathname.startsWith(item.path)}
                onClick={() => navigate(item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        color="inherit"
        sx={{
          width: "100%",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          boxShadow: "0px 2px 4px -1px rgba(0,0,0,0.2)",
        }}
      >
        <Toolbar>
          {!isHomePage && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Box
            sx={{ flexGrow: 1, display: "flex", alignItems: "center", gap: 2 }}
          >
            <Typography
              variant="h6"
              noWrap
              component="div"
              onClick={handleLogoClick}
              sx={{ cursor: "pointer" }}
            >
              Observer
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* Блок выбора компании */}
            {!isSuperadmin && (
              <>
                {availableCompanies.length > 0 ? (
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Компания</InputLabel>
                    <Select
                      value={selectedCompanyId || ""}
                      onChange={handleCompanyChange}
                      label="Компания"
                    >
                      {availableCompanies.map((companyId) => (
                        <MenuItem key={companyId} value={companyId}>
                          {companyId}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : (
                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={handleAddCompanyClick}
                    size="small"
                    sx={{
                      color: "black", // Черный текст
                      borderColor: "black", // Черная рамка
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.04)", // Легкий серый фон при наведении
                        borderColor: "black", // Черная рамка при наведении
                      },
                    }}
                  >
                    Добавить компанию
                  </Button>
                )}
              </>
            )}

            <Tooltip title="Режим разработчика">
              <FormControlLabel
                control={
                  <Switch
                    checked={developerMode}
                    onChange={onToggleDeveloperMode}
                    color="secondary"
                  />
                }
                label={<Settings />}
              />
            </Tooltip>

            <Typography variant="body2">{user?.full_name}</Typography>
            {isSuperadmin && (
              <Chip
                label="Суперадмин"
                color="secondary"
                size="small"
                sx={{ color: "white" }}
              />
            )}
            <IconButton
              size="large"
              edge="end"
              aria-controls="primary-search-account-menu"
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Модальное окно добавления компании */}
      <AddCompanyModal
        open={addCompanyModalOpen}
        onClose={() => setAddCompanyModalOpen(false)}
        onSuccess={handleCompanyAdded}
      />

      {/* Остальной код остается без изменений */}
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
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
          Профиль
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <ExitToApp fontSize="small" />
          </ListItemIcon>
          Выйти
        </MenuItem>
      </Menu>

      {!isHomePage && (
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
          aria-label="mailbox folders"
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
          pt: 7,
          pb: 3,
          width: { sm: isHomePage ? "100%" : `calc(100% - ${drawerWidth}px)` },
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default AppLayout;
