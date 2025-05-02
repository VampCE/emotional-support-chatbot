import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ChatPage from './components/ChatPage';
import InterestsPage from "./components/InterestsPage";
import ForgotPasswordPage from './components/ForgotPasswordPage';
import ResetPasswordPage from './components/ResetPasswordPage';
import VerifyPage from "./components/VerifyPage";
import VerifyInfoPage from "./components/VerifyInfoPage";
import ChangePasswordPage from "./components/ChangePasswordPage";
import './components/styles.css';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/interests" element={<InterestsPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/verify/:token" element={<VerifyPage />} />
        <Route path="/verify-info" element={<VerifyInfoPage />} />
        <Route path="/change-password" element={<ChangePasswordPage />} />
      </Routes>
    </Router>
  );
}

export default App;
export const saveInterests = async (email, interests) => {
  const response = await fetch("http://localhost:5001/api/interests", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, interests }),
  });

  const result = await response.text();
  if (!response.ok) throw new Error(result);
  return result;
};
