// "use client"

import type React from "react";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "./context/authContext";
import AppLayout from "./components/AppLayout";
import { CircularProgress, Box } from "@mui/material";

interface ProtectedRouteProps {
  developerMode: boolean;
  onToggleDeveloperMode: () => void;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  developerMode,
  onToggleDeveloperMode,
}) => {
  const navigate = useNavigate();
  const { isAuthenticated, checkAuth } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const isAuth = await checkAuth();
        if (!isAuth) {
          navigate("/login", { replace: true });
        }
      } catch (error) {
        console.error("Auth verification failed:", error);
        navigate("/login", { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    // Проверяем авторизацию только при первой загрузке компонента
    if (isLoading) {
      verifyAuth();
    }
  }, [checkAuth, navigate, isLoading]);

  // Показываем загрузку во время проверки авторизации
  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  // Если не авторизован, не рендерим ничего (произойдет редирект)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <AppLayout
      developerMode={developerMode}
      onToggleDeveloperMode={onToggleDeveloperMode}
    >
      <Outlet context={{ developerMode }} />
    </AppLayout>
  );
};

export default ProtectedRoute;
