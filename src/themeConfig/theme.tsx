import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  shape: {
    borderRadius: 8, // Увеличьте это значение по вашему вкусу (стандартное - 4)
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px", // Переопределение для кнопок, если нужно
        },
      },
    },
    // Добавьте другие компоненты по необходимости
  },
});

export default theme;
