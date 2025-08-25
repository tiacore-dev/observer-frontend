"use client";

import type React from "react";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { LoginPage } from "./pages/loginPage/loginPage";
import ProtectedRoute from "./protectedRoute";
import { HomePage } from "./pages/homePage/homePage";
import { BotsPage } from "./pages/botsPage/botsPage";
import { PromptsPage } from "./pages/promptsPage/promptsPage";
import { SchedulesPage } from "./pages/schedulesPage/schedulesPage";
import { CompaniesPage } from "./pages/companiesPage/companiesPage";
import { SnackbarProvider } from "notistack";
import { ChatsPage } from "./pages/chats/chatsPage";
import { PromptDetailsPage } from "./pages/promptsPage/promptDetailsPage";
import { AccountsPage } from "./pages/accountsPage/accountsPage";
import { AnalysisPage } from "./pages/analysisPage/analysisPage";
import { AuthProvider } from "./context/authContext";
import { AccountPage } from "./pages/accountPage/AccountPage";
import getTheme from "./themeConfig/theme";
import { ThemeProvider } from "@mui/material/styles";
import { AnalysisDetailsPage } from "./pages/analysisPage/analysisDetailsPage";
import { ScheduleDetailsPage } from "./pages/schedulesPage/scheduleDetailsPage";
import { HelpPage } from "./pages/helpPage/helpPage";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { ThemeModeProvider, useThemeMode } from "./context/themeContext";
import { PrivacyPage } from "./pages/privacyPage/privacyPage";
import { TermsPage } from "./pages/termsPage/termsPage";
import { ResetPasswordPage } from "./pages/loginPage/resetPasswordPage";
import { AcceptInvitePage } from "./pages/acceptInvitePage/acceptInvitePage";
import { InviteRegistrationPage } from "./hooks/invite/inviteRegistrationPage";
import { SubscriptionsPage } from "./pages/subscriptionsPage/subscriptionsPage";
import { LandingPage } from "./pages/landingPage";

export interface PageProps {
  developerMode: boolean;
}

const queryClient = new QueryClient();

const AppContent: React.FC = () => {
  const [developerMode, setDeveloperMode] = useState(false);
  const { isDarkMode } = useThemeMode();
  const theme = getTheme(isDarkMode ? "dark" : "light");

  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <SnackbarProvider maxSnack={3}>
          <Router>
            <AuthProvider>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/accept-invite" element={<AcceptInvitePage />} />
                <Route path="/invite" element={<InviteRegistrationPage />} />

                <Route
                  element={
                    <ProtectedRoute
                      developerMode={developerMode}
                      onToggleDeveloperMode={() =>
                        setDeveloperMode(!developerMode)
                      }
                    />
                  }
                >
                  <Route path="/account" element={<AccountPage />} />
                  <Route
                    path="/bots"
                    element={<BotsPage developerMode={developerMode} />}
                  />
                  <Route
                    path="/bots/:botId"
                    element={<BotsPage developerMode={developerMode} />}
                  />
                  <Route
                    path="/accounts"
                    element={<AccountsPage developerMode={developerMode} />}
                  />
                  <Route
                    path="/chats"
                    element={<ChatsPage developerMode={developerMode} />}
                  />
                  <Route
                    path="/prompts"
                    element={<PromptsPage developerMode={developerMode} />}
                  />
                  <Route
                    path="/prompts/:promptId"
                    element={
                      <PromptDetailsPage developerMode={developerMode} />
                    }
                  />
                  <Route
                    path="/analysis"
                    element={<AnalysisPage developerMode={developerMode} />}
                  />
                  <Route
                    path="/analysis/:analysisId"
                    element={
                      <AnalysisDetailsPage developerMode={developerMode} />
                    }
                  />
                  <Route
                    path="/schedules"
                    element={<SchedulesPage developerMode={developerMode} />}
                  />
                  <Route
                    path="/schedules/:scheduleId"
                    element={
                      <ScheduleDetailsPage developerMode={developerMode} />
                    }
                  />
                  <Route
                    path="/companies"
                    element={<CompaniesPage developerMode={developerMode} />}
                  />
                  <Route
                    path="/companies/:companyId"
                    element={<CompaniesPage developerMode={developerMode} />}
                  />
                  <Route
                    path="/subscriptions"
                    element={<SubscriptionsPage />}
                  />

                  <Route path="/help" element={<HelpPage />} />
                  <Route path="/home" element={<HomePage />} />
                  <Route path="*" element={<Navigate to="/home" />} />
                </Route>
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </AuthProvider>
          </Router>
        </SnackbarProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeModeProvider>
        <AppContent />
      </ThemeModeProvider>
    </Provider>
  );
};

export default App;
