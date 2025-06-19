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
import { validate as isUUID } from "uuid";

interface AuthContextType {
  isAuthenticated: boolean;
  isSuperadmin: boolean;
  user: IUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  selectedCompanyId: string | null;
  availableCompanies: string[];
  login: (data: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
  updateUser: (userData: Partial<IUser>) => void;
  setSelectedCompanyId: (companyId: string) => void;
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
    selectedCompanyId: localStorage.getItem("selected_company_id"),
    availableCompanies: JSON.parse(
      localStorage.getItem("available_companies") || "[]"
    ),
  });

  const getAvailableCompanies = (
    permissions: Record<string, any> | null,
    appId: string
  ): string[] => {
    if (!permissions || !appId) return [];

    const appPermissions = permissions[appId];
    if (!appPermissions) return [];

    return Object.keys(appPermissions).filter((id) => isUUID(id));
  };

  const login = useCallback(
    async (data: { email: string; password: string }) => {
      try {
        const response = await loginUser(data);

        localStorage.setItem("access_token", response.access_token);
        localStorage.setItem("refresh_token", response.refresh_token);
        localStorage.setItem("is_superadmin", String(response.is_superadmin));
        localStorage.setItem("user_id", String(response.user_id));

        const appId = process.env.REACT_APP_ID;
        let selectedCompanyId = null;
        let availableCompanies: string[] = [];

        if (!response.is_superadmin && appId && response.permissions) {
          availableCompanies = getAvailableCompanies(
            response.permissions,
            appId
          );
          console.log("Available companies:", availableCompanies);

          localStorage.setItem(
            "available_companies",
            JSON.stringify(availableCompanies)
          );

          if (availableCompanies.length > 0) {
            selectedCompanyId = availableCompanies[0];
            if (!isUUID(selectedCompanyId)) {
              throw new Error("Invalid company ID format");
            }
            localStorage.setItem("selected_company_id", selectedCompanyId);
          }
        }

        let userDetails: IUser | null = null;
        // if (!response.is_superadmin && selectedCompanyId) {
        //   userDetails = await fetchUserDetails(selectedCompanyId);
        // } else {
        //   userDetails = await fetchUserDetails();
        // }

        // localStorage.setItem("user", JSON.stringify(userDetails));

        setAuthState({
          isAuthenticated: true,
          isSuperadmin: response.is_superadmin,
          user: userDetails,
          accessToken: response.access_token,
          refreshToken: response.refresh_token,
          selectedCompanyId,
          availableCompanies,
        });

        navigate("/home", { replace: true });
      } catch (error) {
        console.error("Login error:", error);
        const errorMessage =
          (error as any).response?.data?.message ||
          (error as any).message ||
          "Ошибка при авторизации";
        // enqueueSnackbar(errorMessage, { variant: "error" });
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
    localStorage.removeItem("user_id");
    localStorage.removeItem("selected_company_id");
    localStorage.removeItem("available_companies");

    setAuthState({
      isAuthenticated: false,
      isSuperadmin: false,
      user: null,
      accessToken: null,
      refreshToken: null,
      selectedCompanyId: null,
      availableCompanies: [],
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
        const appId = process.env.REACT_APP_ID;
        const isSuperadmin = localStorage.getItem("is_superadmin") === "true";
        const selectedCompanyId = localStorage.getItem("selected_company_id");

        // let userDetails: IUser | null = null;
        // if (!isSuperadmin && selectedCompanyId && isUUID(selectedCompanyId)) {
        //   userDetails = await fetchUserDetails(selectedCompanyId);
        // } else {
        //   userDetails = await fetchUserDetails();
        // }

        // localStorage.setItem("user", JSON.stringify(userDetails));

        setAuthState((prev) => ({
          ...prev,
          isAuthenticated: true,
          accessToken: newToken,
          // user: userDetails,
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
    // setAuthState((prev) => {
    // const updatedUser = { ...prev.user, ...userData };
    //   localStorage.setItem("user", JSON.stringify(updatedUser));
    //   return {
    //     ...prev,
    //     user: updatedUser,
    //   };
    // });
  }, []);

  const setSelectedCompanyId = useCallback((companyId: string) => {
    if (!isUUID(companyId)) {
      console.error("Attempt to set invalid company ID:", companyId);
      return;
    }
    localStorage.setItem("selected_company_id", companyId);
    setAuthState((prev) => ({
      ...prev,
      selectedCompanyId: companyId,
    }));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: authState.isAuthenticated,
        isSuperadmin: authState.isSuperadmin,
        user: authState.user,
        accessToken: authState.accessToken,
        refreshToken: authState.refreshToken,
        selectedCompanyId: authState.selectedCompanyId,
        availableCompanies: authState.availableCompanies,
        login,
        logout,
        checkAuth,
        updateUser,
        setSelectedCompanyId,
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
