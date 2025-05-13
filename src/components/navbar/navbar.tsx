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
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout"; // Иконка выхода

const menuItems = [
  {
    label: "Боты",
    key: "/bots",
  },
  {
    label: "Промпты",
    key: "/prompts",
  },
  {
    label: "Расписание",
    key: "/schedules",
  },
  {
    label: "Компании",
    key: "/companies",
  },
];

const StyledMenuList = styled(MenuList)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  padding: 0,
  gap: theme.spacing(1),
  flexGrow: 1, // Добавлено для растягивания меню
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

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const onMenuClick = (key: string) => {
    navigate(key);
  };

  const handleLogout = () => {
    // Очищаем localStorage
    localStorage.clear();
    // Перенаправляем на страницу логина
    navigate("/login");
  };

  const getSelectedKey = () => {
    const currentPath = location.pathname;
    const selectedItem = menuItems.find(
      (item) => item.key && currentPath.startsWith(item.key)
    );
    return selectedItem ? selectedItem.key : "";
  };

  return (
    <Box sx={{ px: 2, pt: 1 }}>
      <Paper elevation={0} sx={{ background: "transparent" }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          {/* Логотип с ссылкой на /home */}
          <IconButton
            onClick={() => navigate("/home")}
            sx={{
              p: 1,
              "&:hover": {
                backgroundColor: "transparent", // Убираем эффект при наведении если нужно
              },
            }}
          >
            {/* Вариант 2: Текстовый логотип */}
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

          {/* Кнопка выхода справа */}
          <Button
            variant="outlined"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{
              ml: "auto", // Автоматический отступ слева для выравнивания справа
              color: "text.secondary",
              borderColor: "divider",
              "&:hover": {
                backgroundColor: "action.hover",
                borderColor: "text.secondary",
              },
            }}
          >
            Выйти
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};
