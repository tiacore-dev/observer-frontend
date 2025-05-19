import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage";
import HomePage from "./pages/HomePage/HomePage";
import CompaniesPage from "./pages/CompaniesPage/CompaniesPage";
import BotsPage from "./pages/BotsPage/BotsPage";
import "antd/dist/reset.css";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/companies" element={<CompaniesPage />} />
        <Route path="/bots" element={<BotsPage />} />
      </Routes>
    </Router>
  );
};

export default App;
