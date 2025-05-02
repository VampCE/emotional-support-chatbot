import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();

    const response = await fetch(`http://localhost:5001/api/reset-password/${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newPassword }),
    });

    if (response.ok) {
      alert("Password updated successfully!");
      navigate('/');
    } else {
      const errorText = await response.text();
      alert("Error: " + errorText);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Reset Your Password</h2>
        <form onSubmit={handleReset}>
          <label>New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button type="submit">Change Password</button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
