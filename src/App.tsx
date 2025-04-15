import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './context/LoginForm';

const HomePage: React.FC = () => {
  return <div>Добро пожаловать на главную страницу!</div>;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        {/* Другие маршруты */}
      </Routes>
    </Router>
  );
};

export default App;
