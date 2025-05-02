import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

const ChangePasswordPage = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const email = localStorage.getItem("email");
  const navigate = useNavigate();

  const handleChange = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5001/api/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, currentPassword, newPassword }),
      });

      const result = await response.text();
      alert(result);
      if (response.ok) navigate("/chat");
    } catch (err) {
      alert("SERVER ERROR");
    }
  };

  return (
    <div className="container">
      <button
        className="back-button"
        onClick={() => navigate("/chat")}
        title="Sohbete geri dön"
      >
        &#8592;
      </button>

      <div className="card">
        <h2>Change Password</h2>
        <form onSubmit={handleChange}>
          <label>Current Password:</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <label>New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button type="submit">Change</button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
