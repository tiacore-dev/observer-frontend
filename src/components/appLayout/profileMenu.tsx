import React from "react";
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import { Person, ExitToApp } from "@mui/icons-material";

interface ProfileMenuProps {
  anchorEl: HTMLElement | null;
  handleProfileMenuClose: () => void;
  navigate: (path: string) => void;
  handleLogout: () => void;
  theme: any;
}

export const ProfileMenu: React.FC<ProfileMenuProps> = ({
  anchorEl,
  handleProfileMenuClose,
  navigate,
  handleLogout,
  theme,
}) => {
  return (
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

      <MenuItem onClick={handleLogout} sx={{ color: theme.palette.error.main }}>
        <ListItemIcon>
          <ExitToApp fontSize="small" color="error" />
        </ListItemIcon>
        <ListItemText primary="Выйти из системы" />
      </MenuItem>
    </Menu>
  );
};
