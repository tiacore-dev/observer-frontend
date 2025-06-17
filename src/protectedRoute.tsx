// src/components/ProtectedRoute.tsx
import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "./context/authContext";
import AppLayout from "./components/AppLayout";

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

  useEffect(() => {
    const verifyAuth = async () => {
      const isAuth = await checkAuth();
      if (!isAuth) {
        // navigate("/login");
      }
    };

    verifyAuth();
  }, [checkAuth, navigate]);

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
