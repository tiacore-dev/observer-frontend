import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Link,
  Avatar,
  Badge,
  alpha,
} from "@mui/material";
import { Close, DarkMode, LightMode } from "@mui/icons-material";
import { AppMenuItem } from "./appLayout";

interface SidebarContentProps {
  menuItems: AppMenuItem[];
  location: any;
  handleMenuItemClick: (path?: string) => void;
  isDarkMode: boolean;
  theme: any;
  isMobile: boolean;
  toggleTheme: () => void;
}

const LOGO_AVATAR_SIZE = 35;
const LOGO_TEXT_VARIANT = "h6";
const LOGO_CONTAINER_GAP = 1.5;

export const SidebarContent: React.FC<SidebarContentProps> = ({
  menuItems,
  location,
  handleMenuItemClick,
  isDarkMode,
  theme,
  isMobile,
  toggleTheme,
}) => {
  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {isMobile && (
        <Box
          sx={{
            display: { xs: "flex", sm: "none" },
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: LOGO_CONTAINER_GAP,
            }}
          >
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
              sx={{ fontWeight: "bold", color: theme.palette.primary.main }}
            >
              Observer
            </Typography>
          </Box>
          <IconButton
            onClick={() => handleMenuItemClick()}
            sx={{ display: { sm: "none" } }}
          >
            <Close />
          </IconButton>
        </Box>
      )}

      <Box sx={{ flexGrow: 1, overflow: "auto", py: 0 }}>
        <List sx={{ px: 0 }}>
          {menuItems.map((item) => (
            <React.Fragment key={item.text}>
              {item.children ? (
                <>
                  <ListItem disablePadding sx={{ mb: 0.25 }}>
                    <ListItemButton
                      selected={item.children.some((child: any) =>
                        location.pathname.startsWith(child.path || "")
                      )}
                      onClick={() =>
                        item.children &&
                        handleMenuItemClick(item.children[0].path)
                      }
                      sx={{
                        borderRadius: 1,
                        mx: 0.5,
                        py: 0.75,
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
                          minWidth: 32,
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.text}
                        primaryTypographyProps={{
                          variant: "body2",
                          fontWeight: 500,
                          fontSize: "0.95rem",
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                  {item.children.map((child: any) => (
                    <ListItem key={child.text} disablePadding sx={{ mb: 0.25 }}>
                      <ListItemButton
                        selected={location.pathname.startsWith(
                          child.path || ""
                        )}
                        onClick={() => handleMenuItemClick(child.path)}
                        sx={{
                          borderRadius: 0.5,
                          mx: 1,
                          py: 0.5,
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
                            minWidth: 28,
                            color: theme.palette.text.secondary,
                          }}
                        >
                          {child.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={child.text}
                          primaryTypographyProps={{
                            variant: "body2",
                            fontSize: "0.95rem",
                            fontWeight: 400,
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </>
              ) : (
                <ListItem key={item.text} disablePadding sx={{ mb: 0.25 }}>
                  <ListItemButton
                    selected={location.pathname.startsWith(item.path || "")}
                    onClick={() => handleMenuItemClick(item.path)}
                    sx={{
                      borderRadius: 0.5,
                      mx: 0.5,
                      py: 0.75,
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
                      sx={{ color: theme.palette.text.secondary, minWidth: 32 }}
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
                        fontSize: "0.95rem",
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              )}
            </React.Fragment>
          ))}
        </List>
      </Box>

      <Box sx={{ py: 0.75, px: 1.5 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
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

          {isMobile && (
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
          )}
        </Box>
      </Box>
    </Box>
  );
};
