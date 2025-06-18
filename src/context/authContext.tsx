import type React from "react";
import {
  createContext,
  useContext,
  useCallback,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, refreshToken } from "../api/authApi";
import { enqueueSnackbar } from "notistack";
import { fetchUserDetails, type IUser } from "../api/usersApi";
import { isTokenExpired, isTokenValid } from "./tokenUtils";

interface AuthContextType {
  isAuthenticated: boolean;
  isSuperadmin: boolean;
  user: IUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  login: (data: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
  updateUser: (userData: Partial<IUser>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState({
    isAuthenticated: !!localStorage.getItem("access_token"),
    isSuperadmin: localStorage.getItem("is_superadmin") === "true",
    user: JSON.parse(localStorage.getItem("user") || "null"),
    accessToken: localStorage.getItem("access_token"),
    refreshToken: localStorage.getItem("refresh_token"),
  });

  const login = useCallback(
    async (data: { email: string; password: string }) => {
      try {
        const response = await loginUser(data);

        localStorage.setItem("access_token", response.access_token);
        localStorage.setItem("refresh_token", response.refresh_token);
        localStorage.setItem("is_superadmin", String(response.is_superadmin));
        localStorage.setItem("user_id", String(response.user_id));

        const userDetails = await fetchUserDetails();
        localStorage.setItem("user", JSON.stringify(userDetails));

        setAuthState({
          isAuthenticated: true,
          isSuperadmin: response.is_superadmin,
          user: userDetails,
          accessToken: response.access_token,
          refreshToken: response.refresh_token,
        });

        navigate("/home", { replace: true });
      } catch (error) {
        console.error("Login error:", error);
        const errorMessage =
          (error as any).response?.data?.message ||
          (error as any).message ||
          "Ошибка при авторизации";
        enqueueSnackbar(errorMessage, { variant: "error" });
        throw error;
      }
    },
    [navigate]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("is_superadmin");
    localStorage.removeItem("user");

    setAuthState({
      isAuthenticated: false,
      isSuperadmin: false,
      user: null,
      accessToken: null,
      refreshToken: null,
    });

    navigate("/login");
  }, [navigate]);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      return false;
    }

    if (isTokenValid(token)) {
      if (!isTokenExpired(token)) {
        setAuthState((prev) => ({
          ...prev,
          isAuthenticated: true,
          accessToken: token,
        }));
        return true;
      }
    }

    try {
      const newToken = await refreshToken();
      if (newToken) {
        const userDetails = await fetchUserDetails();
        localStorage.setItem("user", JSON.stringify(userDetails));

        setAuthState((prev) => ({
          ...prev,
          isAuthenticated: true,
          accessToken: newToken,
          user: userDetails,
        }));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Auth check failed:", error);
      logout();
      return false;
    }
  }, [logout]);

  const updateUser = useCallback((userData: Partial<IUser>) => {
    setAuthState((prev) => {
      const updatedUser = { ...prev.user, ...userData };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return {
        ...prev,
        user: updatedUser,
      };
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: authState.isAuthenticated,
        isSuperadmin: authState.isSuperadmin,
        user: authState.user,
        accessToken: authState.accessToken,
        refreshToken: authState.refreshToken,
        login,
        logout,
        checkAuth,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
