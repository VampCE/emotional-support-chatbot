import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './styles.css'; 

const RegisterPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5001/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: username, password }),
      });

      const result = await response.text();
      console.log("Backend cevabı:", result);

      if (response.ok) {
        alert(result); // Başarılı kayıt
        navigate("/interests"); // ✨ İLGİ ALANLARI SAYFASINA GÖNDER
      } else {
        alert("register unsuccesful: " + result); // Kayıt hatası
      }
    } catch (error) {
      console.error("Kayıt hatası:", error);
      alert("Sunucu hatası!"); // Sunucu hatası
    }
  };

  return (
    <div className="container">
      <button 
        className="back-button" 
        onClick={() => navigate('/')} 
        title="Anasayfaya Dön"
      >
        &#8592;
      </button>

      <div className="card">
        <h1>Sign Up</h1>
        <form onSubmit={handleRegister}>
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
          <button type="submit">Sign Up</button>
        </form>

        <div 
          className="alt-link"
          onClick={() => navigate('/login')}
        >
          You have already an account? Sign in!
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
