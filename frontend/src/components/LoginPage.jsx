import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api"; // Eğer api.js kullandıysan
import './styles.css'; // Ortak CSS dosyamız

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const result = await loginUser(username, password); // Backend'e istek
      console.log("Backend cevabı:", result);

      alert(result); // Giriş başarılı
      navigate("/chat"); // Sohbet ekranına yönlendir
    } catch (error) {
      console.error("Login  Error:", error);
      alert("Server Error!"); // Hata varsa bildir
    }
  };

  return (
    <div className="container">
      <button 
        className="back-button" 
        onClick={() => navigate('/')} 
        title="Back to Main Page "
      >
        &#8592;
      </button>

      <div className="card">
        <h1>Login </h1>
        <form onSubmit={handleLogin}>
          <label htmlFor="username">E-mail:</label>
          <input
            type="email"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login </button>
        </form>

        <div 
          className="alt-link"
          onClick={() => navigate('/register')}
        >
          Don't you have an account? Sign up!
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
