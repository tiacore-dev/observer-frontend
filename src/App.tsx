import React from "react";
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

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/bots" element={<BotsPage />} />
            <Route path="/prompts" element={<PromptsPage />} />
            <Route path="/schedules" element={<SchedulesPage />} />
            <Route path="/companies" element={<CompaniesPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
