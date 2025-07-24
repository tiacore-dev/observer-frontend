import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
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
      default: "#ebeaf2ff",
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
      main: "#f59e0b",
      light: "#fbbf24",
      dark: "#d97706",
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
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: "2.5rem",
      lineHeight: 1.2,
      color: "#1e293b",
    },
    h2: {
      fontWeight: 600,
      fontSize: "2rem",
      lineHeight: 1.3,
      color: "#1e293b",
    },
    h3: {
      fontWeight: 600,
      fontSize: "1.5rem",
      lineHeight: 1.4,
      color: "#1e293b",
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.25rem",
      lineHeight: 1.4,
      color: "#1e293b",
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.125rem",
      lineHeight: 1.4,
      color: "#1e293b",
    },
    h6: {
      fontWeight: 600,
      fontSize: "1rem",
      lineHeight: 1.4,
      color: "#1e293b",
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
      color: "#475569",
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.6,
      color: "#64748b",
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
            boxShadow: "0 4px 12px rgba(99, 102, 241, 0.15)",
          },
          "&.Mui-disabled": {
            color: "rgba(0, 0, 0, 0.6)", // Более темный серый цвет для текста
            backgroundColor: "rgba(0, 0, 0, 0.12)", // Фон для disabled кнопки
          },
        },
        contained: {
          background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
          "&:hover": {
            background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
          },
          "&.Mui-disabled": {
            background: "rgba(99, 102, 241, 0.12)", // Соответствующий оттенок для primary кнопки
          },
        },
        outlined: {
          borderColor: "#e2e8f0",
          color: "#475569",
          "&:hover": {
            borderColor: "#6366f1",
            backgroundColor: "rgba(99, 102, 241, 0.04)",
          },
          "&.Mui-disabled": {
            borderColor: "rgba(0, 0, 0, 0.12)",
            color: "rgba(0, 0, 0, 0.38)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          boxShadow:
            "0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)",
          border: "1px solid #f1f5f9",
          "&:hover": {
            boxShadow:
              "0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.06)",
          },
          transition: "box-shadow 0.2s ease-in-out",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
          color: "#1e293b",
          boxShadow:
            "0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)",
          borderBottom: "1px solid #f1f5f9",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#ffffff",
          borderRight: "1px solid #f1f5f9",
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
            backgroundColor: "rgba(99, 102, 241, 0.08)",
            color: "#6366f1",
            "&:hover": {
              backgroundColor: "rgba(99, 102, 241, 0.12)",
            },
            "& .MuiListItemIcon-root": {
              color: "#6366f1",
            },
          },
          "&:hover": {
            backgroundColor: "rgba(99, 102, 241, 0.04)",
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
          backgroundColor: "#10b981",
          color: "#ffffff",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "10px",
            "& fieldset": {
              borderColor: "#e2e8f0",
            },
            "&:hover fieldset": {
              borderColor: "#cbd5e1",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#6366f1",
            },
          },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
          "& .MuiTableCell-head": {
            fontWeight: 600,
            color: "#475569",
            borderBottom: "1px solid #e2e8f0",
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "#f8fafc",
          },
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          border: "1px solid #d3d8ddff", // Граница для выпадающего списка
          borderRadius: "10px", // Скругление углов
          marginTop: "8px", // Отступ от поля ввода
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", // Тень (опционально)
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "rgba(99, 102, 241, 0.08)", // Цвет при наведении
          },
          "&.Mui-selected": {
            backgroundColor: "rgba(99, 102, 241, 0.12)", // Цвет выбранного пункта
          },
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: "thin",
          scrollbarColor: "#cbd5e1 #f1f5f9",
          "&::-webkit-scrollbar": {
            width: "6px",
            height: "6px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#f1f5f9",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#cbd5e1",
            borderRadius: "10px",
            "&:hover": {
              background: "#94a3b8",
            },
          },
          "&::-webkit-scrollbar-corner": {
            background: "#f1f5f9",
          },
        },
        "*": {
          scrollbarWidth: "thin",
          scrollbarColor: "#cbd5e1 #f1f5f9",
          "&::-webkit-scrollbar": {
            width: "6px",
            height: "6px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#f1f5f9",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#cbd5e1",
            borderRadius: "10px",
            "&:hover": {
              background: "#94a3b8",
            },
          },
        },
      },
    },
  },
});

export default theme;
