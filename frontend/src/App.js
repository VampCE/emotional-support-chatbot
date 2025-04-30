import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ChatPage from './components/ChatPage';
import InterestsPage from "./components/InterestsPage";
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
