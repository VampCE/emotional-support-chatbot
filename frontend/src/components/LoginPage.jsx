import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, fetchUserInterests } from "../services/api";
import './styles.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const result = await loginUser(username, password);
      alert(result); // Giriş başarılı

      // ✅ E-postayı localStorage'a kaydet
      localStorage.setItem("email", username);

      // ✅ İlgi alanı var mı kontrol et
      const interests = await fetchUserInterests(username);
      if (interests.hasInterests) {
        navigate("/chat");
      } else {
        navigate("/interests");
      }

    } catch (error) {
      console.error("Login Error:", error);

      if (error.message.includes("kullanıcı bulunamadı")) {
        alert("⚠️ Böyle bir kullanıcı bulunamadı.");
      } else if (error.message.includes("Şifre hatalı")) {
        alert("🔑 Şifre hatalı!");
      } else if (error.message.includes("doğrulayın")) {
        alert("📧 Lütfen önce e-posta adresinizi doğrulayın.");
      } else {
        alert("❌ Sunucu hatası.");
      }
    }
  };

  return (
    <div className="container">
      <button className="back-button" onClick={() => navigate('/')}>
        &#8592;
      </button>

      <div className="card">
        <h1>Login</h1>
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
          <button type="submit">Login</button>
        </form>

        <div className="alt-link" onClick={() => navigate('/forgot-password')}>
          Forgot your password?
        </div>

        <div className="alt-link" onClick={() => navigate('/register')}>
          Don't you have an account? Sign up!
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
