import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  MenuItem,
  MenuList,
  Paper,
  styled,
  Typography,
  Stack,
  IconButton,
  Button,
  Switch,
  FormControlLabel,
  Tooltip,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";

const menuItems = [
  { label: "Боты", key: "/bots" },
  { label: "Промпты", key: "/prompts" },
  { label: "Расписание", key: "/schedules" },
  { label: "Компании", key: "/companies" },
];

const StyledMenuList = styled(MenuList)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  padding: 0,
  gap: theme.spacing(1),
  flexGrow: 1,
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  padding: theme.spacing(1, 2),
  borderRadius: theme.shape.borderRadius,
  "&.Mui-selected": {
    backgroundColor: theme.palette.action.selected,
    "&:hover": {
      backgroundColor: theme.palette.action.selected,
    },
  },
}));

interface NavbarProps {
  developerMode: boolean;
  onToggleDeveloperMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  developerMode,
  onToggleDeveloperMode,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const onMenuClick = (key: string) => navigate(key);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const getSelectedKey = () => {
    const currentPath = location.pathname;
    return (
      menuItems.find((item) => item.key && currentPath.startsWith(item.key))
        ?.key || ""
    );
  };

  return (
    <Box sx={{ px: 2, pt: 1 }}>
      <Paper elevation={0} sx={{ background: "transparent" }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <IconButton onClick={() => navigate("/home")} sx={{ p: 1 }}>
            <Typography
              variant="h6"
              component="div"
              sx={{ fontWeight: "bold" }}
            >
              Observer | Tiacore
            </Typography>
          </IconButton>

          <StyledMenuList>
            {menuItems.map((item) => (
              <StyledMenuItem
                key={item.key}
                selected={getSelectedKey() === item.key}
                onClick={() => onMenuClick(item.key)}
              >
                <Typography variant="body1">{item.label}</Typography>
              </StyledMenuItem>
            ))}
          </StyledMenuList>

          <Box sx={{ display: "flex", alignItems: "center", ml: "auto" }}>
            <Tooltip title="Режим разработчика">
              <FormControlLabel
                control={
                  <Switch
                    checked={developerMode}
                    onChange={onToggleDeveloperMode}
                    color="secondary"
                  />
                }
                label={
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <SettingsIcon sx={{ mr: 1 }} />
                  </Box>
                }
                sx={{ mr: 1 }}
              />
            </Tooltip>

            <Button
              variant="outlined"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{
                color: "text.secondary",
                borderColor: "divider",
              }}
            >
              Выйти
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};
