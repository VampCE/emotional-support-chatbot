import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendPasswordResetEmail } from '../services/api';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const result = await sendPasswordResetEmail(email);
      alert(result);
      navigate("/");
    } catch (error) {
      console.error("Reset Error:", error);
  
      if (error.message.includes("User can't find.")) {
        alert("⚠️ E-mail does not match.");
      } else {
        alert("❌ The mail could not be sent. Please try again later.");
      }
    }
  };
  

  return (
    <div className="container">
      <div className="card">
        <h2>Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Send Reset Email</button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
