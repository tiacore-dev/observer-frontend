import { createTheme, type ThemeOptions } from "@mui/material/styles";

const getTheme = (mode: "light" | "dark") => {
  const lightTheme: ThemeOptions = {
    palette: {
      mode: "light",
      primary: {
        main: "#6366f1",
        light: "#818cf8",
        dark: "#4f46e5",
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#10b981",
        light: "#34d399",
        dark: "#059669",
        contrastText: "#ffffff",
      },
      background: {
        default: "#efeef5",
        paper: "#ffffff",
      },
      text: {
        primary: "#1e293b",
        secondary: "#64748b",
      },
      grey: {
        50: "#f8fafc",
        100: "#f1f5f9",
        200: "#e2e8f0",
        300: "#cbd5e1",
        400: "#94a3b8",
        500: "#64748b",
        600: "#475569",
        700: "#334155",
        800: "#1e293b",
        900: "#0f172a",
      },
      success: {
        main: "#10b981",
        light: "#34d399",
        dark: "#059669",
      },
      warning: {
        light: "#fbbf24",
        main: "#d97706",
      },
      error: {
        main: "#ef4444",
        light: "#f87171",
        dark: "#dc2626",
      },
      info: {
        main: "#3b82f6",
        light: "#60a5fa",
        dark: "#2563eb",
      },
    },
  };

  const darkTheme: ThemeOptions = {
    palette: {
      mode: "dark",
      primary: {
        main: "#6366f1",
        light: "#818cf8",
        dark: "#4f46e5",
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#34d399",
        light: "#6ee7b7",
        dark: "#10b981",
        contrastText: "#000000",
      },
      background: {
        default: "#0f172a",
        paper: "#1e293b",
      },
      text: {
        primary: "#f1f5f9",
        secondary: "#cbd5e1",
      },
      grey: {
        50: "#0f172a",
        100: "#1e293b",
        200: "#334155",
        300: "#475569",
        400: "#64748b",
        500: "#94a3b8",
        600: "#cbd5e1",
        700: "#e2e8f0",
        800: "#f1f5f9",
        900: "#f8fafc",
      },
      success: {
        main: "#34d399",
        light: "#6ee7b7",
        dark: "#10b981",
      },
      warning: {
        light: "#fbbf24",
        main: "#f59e0b",
      },
      error: {
        main: "#f87171",
        light: "#fca5a5",
        dark: "#ef4444",
      },
      info: {
        main: "#60a5fa",
        light: "#93c5fd",
        dark: "#3b82f6",
      },
      divider: "#334155",
    },
  };

  const baseTheme = mode === "dark" ? darkTheme : lightTheme;

  return createTheme({
    ...baseTheme,
    shape: {
      borderRadius: 8,
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 700,
        fontSize: "2.5rem",
        lineHeight: 1.2,
        color: mode === "dark" ? "#f1f5f9" : "#1e293b",
      },
      h2: {
        fontWeight: 600,
        fontSize: "2rem",
        lineHeight: 1.3,
        color: mode === "dark" ? "#f1f5f9" : "#1e293b",
      },
      h3: {
        fontWeight: 600,
        fontSize: "1.5rem",
        lineHeight: 1.4,
        color: mode === "dark" ? "#f1f5f9" : "#1e293b",
      },
      h4: {
        fontWeight: 600,
        fontSize: "1.25rem",
        lineHeight: 1.4,
        color: mode === "dark" ? "#f1f5f9" : "#1e293b",
      },
      h5: {
        fontWeight: 600,
        fontSize: "1.125rem",
        lineHeight: 1.4,
        color: mode === "dark" ? "#f1f5f9" : "#1e293b",
      },
      h6: {
        fontWeight: 600,
        fontSize: "1rem",
        lineHeight: 1.4,
        color: mode === "dark" ? "#f1f5f9" : "#1e293b",
      },
      body1: {
        fontSize: "1rem",
        lineHeight: 1.6,
        color: mode === "dark" ? "#cbd5e1" : "#475569",
      },
      body2: {
        fontSize: "0.875rem",
        lineHeight: 1.6,
        color: mode === "dark" ? "#94a3b8" : "#64748b",
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 500,
            fontSize: "0.875rem",
            padding: "10px 20px",
            boxShadow: "none",
            "&:hover": {
              boxShadow:
                mode === "dark"
                  ? "0 4px 12px rgba(129, 140, 248, 0.25)"
                  : "0 4px 12px rgba(99, 102, 241, 0.15)",
            },
            "&.Mui-disabled": {
              color:
                mode === "dark"
                  ? "rgba(255, 255, 255, 0.3)"
                  : "rgba(0, 0, 0, 0.6)",
              backgroundColor:
                mode === "dark"
                  ? "rgba(255, 255, 255, 0.08)"
                  : "rgba(0, 0, 0, 0.12)",
            },
          },
          contained: {
            background:
              mode === "dark"
                ? "linear-gradient(135deg, #818cf822 0%, #a78bfa22 100%)"
                : "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
            "&:hover": {
              background:
                mode === "dark"
                  ? "linear-gradient(135deg, #6366f122 0%, #8b5cf622 100%)"
                  : "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
            },
            "&.Mui-disabled": {
              background:
                mode === "dark"
                  ? "rgba(129, 140, 248, 0.12)"
                  : "rgba(99, 102, 241, 0.12)",
            },
          },
          outlined: {
            borderColor: mode === "dark" ? "#334155" : "#e2e8f0",
            color: mode === "dark" ? "#cbd5e1" : "#475569",
            "&:hover": {
              borderColor: mode === "dark" ? "#818cf8" : "#6366f1",
              backgroundColor:
                mode === "dark"
                  ? "rgba(129, 140, 248, 0.08)"
                  : "rgba(99, 102, 241, 0.04)",
            },
            "&.Mui-disabled": {
              borderColor:
                mode === "dark"
                  ? "rgba(255, 255, 255, 0.12)"
                  : "rgba(0, 0, 0, 0.12)",
              color:
                mode === "dark"
                  ? "rgba(255, 255, 255, 0.3)"
                  : "rgba(0, 0, 0, 0.38)",
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: "10px",
            boxShadow:
              mode === "dark"
                ? "0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.4)"
                : "0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)",
            border: mode === "dark" ? "1px solid #334155" : "1px solid #f1f5f9",
            "&:hover": {
              boxShadow:
                mode === "dark"
                  ? "0 4px 12px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.3)"
                  : "0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.06)",
            },
            transition: "box-shadow 0.2s ease-in-out",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: "10px",
            boxShadow:
              mode === "dark"
                ? "0 1px 3px rgba(0, 0, 0, 0.3)"
                : "0 1px 3px rgba(0, 0, 0, 0.05)",
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor:
              mode === "dark"
                ? "rgba(30, 41, 59, 0.95)"
                : "rgba(255, 255, 255, 0.95)",
            color: mode === "dark" ? "#f1f5f9" : "#1e293b",
            boxShadow:
              mode === "dark"
                ? "0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.4)"
                : "0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)",
            borderBottom:
              mode === "dark" ? "1px solid #334155" : "1px solid #f1f5f9",
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: mode === "dark" ? "#1e293b" : "#ffffff",
            borderRight:
              mode === "dark" ? "1px solid #334155" : "1px solid #f1f5f9",
            boxShadow: "none",
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: "8px",
            margin: "2px 8px",
            "&.Mui-selected": {
              backgroundColor:
                mode === "dark"
                  ? "rgba(129, 140, 248, 0.15)"
                  : "rgba(99, 102, 241, 0.08)",
              color: mode === "dark" ? "#a5b4fc" : "#6366f1",
              "&:hover": {
                backgroundColor:
                  mode === "dark"
                    ? "rgba(129, 140, 248, 0.2)"
                    : "rgba(99, 102, 241, 0.12)",
              },
              "& .MuiListItemIcon-root": {
                color: mode === "dark" ? "#a5b4fc" : "#6366f1",
              },
            },
            "&:hover": {
              backgroundColor:
                mode === "dark"
                  ? "rgba(129, 140, 248, 0.08)"
                  : "rgba(99, 102, 241, 0.04)",
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: "8px",
            fontWeight: 500,
          },
          colorSecondary: {
            backgroundColor: mode === "dark" ? "#34d399" : "#10b981",
            color: mode === "dark" ? "#000000" : "#ffffff",
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
              "& fieldset": {
                borderColor: mode === "dark" ? "#334155" : "#e2e8f0",
              },
              "&:hover fieldset": {
                borderColor: mode === "dark" ? "#475569" : "#cbd5e1",
              },
              "&.Mui-focused fieldset": {
                borderColor: mode === "dark" ? "#818cf8" : "#6366f1",
              },
            },
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            backgroundColor: mode === "dark" ? "#1e293b" : "#ffffff",
            "& .MuiTableCell-head": {
              fontWeight: 600,
              color: mode === "dark" ? "#cbd5e1" : "#475569",
              borderBottom:
                mode === "dark" ? "1px solid #334155" : "1px solid #e2e8f0",
            },
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            "&:hover": {
              backgroundColor: mode === "dark" ? "#334155" : "#f8fafc",
            },
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            border:
              mode === "dark" ? "1px solid #475569" : "1px solid #d3d8ddff",
            borderRadius: "10px",
            marginTop: "8px",
            boxShadow:
              mode === "dark"
                ? "0 4px 12px rgba(0, 0, 0, 0.4)"
                : "0 4px 12px rgba(0, 0, 0, 0.1)",
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            "&:hover": {
              backgroundColor:
                mode === "dark"
                  ? "rgba(129, 140, 248, 0.15)"
                  : "rgba(99, 102, 241, 0.08)",
            },
            "&.Mui-selected": {
              backgroundColor:
                mode === "dark"
                  ? "rgba(129, 140, 248, 0.2)"
                  : "rgba(99, 102, 241, 0.12)",
            },
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: mode === "dark" ? "#334155cc" : "#334155cc",
            color: mode === "dark" ? "white" : "white",
            fontSize: "0.75rem",
            padding: "8px 12px",
            borderRadius: "8px",
          },
          arrow: {
            color: mode === "dark" ? "#33415588" : "#33415588",
          },
        },
      },
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarWidth: "thin",
            scrollbarColor:
              mode === "dark" ? "#475569 #334155" : "#cbd5e1 #f1f5f9",
            "&::-webkit-scrollbar": {
              width: "6px",
              height: "6px",
            },
            "&::-webkit-scrollbar-track": {
              background: mode === "dark" ? "#334155" : "#f1f5f9",
              borderRadius: "10px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: mode === "dark" ? "#475569" : "#cbd5e1",
              borderRadius: "10px",
              "&:hover": {
                background: mode === "dark" ? "#64748b" : "#94a3b8",
              },
            },
            "&::-webkit-scrollbar-corner": {
              background: mode === "dark" ? "#334155" : "#f1f5f9",
            },
          },
          "*": {
            scrollbarWidth: "thin",
            scrollbarColor:
              mode === "dark" ? "#475569 #334155" : "#cbd5e1 #f1f5f9",
            "&::-webkit-scrollbar": {
              width: "6px",
              height: "6px",
            },
            "&::-webkit-scrollbar-track": {
              background: mode === "dark" ? "#334155" : "#f1f5f9",
              borderRadius: "10px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: mode === "dark" ? "#475569" : "#cbd5e1",
              borderRadius: "10px",
              "&:hover": {
                background: mode === "dark" ? "#64748b" : "#94a3b8",
              },
            },
          },
        },
      },
    },
  });
};

export default getTheme;
