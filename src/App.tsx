import React, { useState } from "react";
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

export interface PageProps {
  developerMode: boolean;
}

const queryClient = new QueryClient();
const App: React.FC = () => {
  const [developerMode, setDeveloperMode] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <SnackbarProvider maxSnack={3}>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              element={
                <ProtectedRoute
                  developerMode={developerMode}
                  onToggleDeveloperMode={() => setDeveloperMode(!developerMode)}
                />
              }
            >
              <Route path="/home" element={<HomePage />} />
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
                element={<PromptDetailsPage developerMode={developerMode} />}
              />
              <Route
                path="/analysis"
                element={<AnalysisPage developerMode={developerMode} />}
              />
              <Route
                path="/schedules"
                element={<SchedulesPage developerMode={developerMode} />}
              />
              <Route
                path="/companies"
                element={<CompaniesPage developerMode={developerMode} />}
              />
              <Route
                path="/companies/:companyId"
                element={<CompaniesPage developerMode={developerMode} />}
              />
            </Route>
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </Router>
      </SnackbarProvider>
    </QueryClientProvider>
  );
};

export default App;
