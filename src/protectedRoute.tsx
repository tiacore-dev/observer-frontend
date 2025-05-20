import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Navbar } from "./components/navbar/navbar";

interface ProtectedRouteProps {
  developerMode: boolean;
  onToggleDeveloperMode: () => void;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  developerMode,
  onToggleDeveloperMode,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <>
      <Navbar
        developerMode={developerMode}
        onToggleDeveloperMode={onToggleDeveloperMode}
      />
      <Outlet context={{ developerMode }} />
    </>
  );
};

export default ProtectedRoute;
