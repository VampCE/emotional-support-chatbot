import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

const ChatPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi, how can I help you? 😊" }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMessage = { sender: "user", text: newMessage };
    const botReply = { sender: "bot", text: "how are you today?" };

    setMessages([...messages, userMessage, botReply]);
    setNewMessage('');
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div>
      {/* Üst sağ köşe: Log Out ve Change Password */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', padding: '10px 20px' }}>
        <button className="logout-button" onClick={handleLogout}>
          🚪 Log Out
        </button>
        <button
          className="logout-button"
          onClick={() => navigate("/change-password")}
        >
          🔒 Change Password
        </button>
      </div>

      <div className="container">
        <div className="chat-card">
          <div className="chat-header">
            💬 Your Emotional Support Bot
          </div>

          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
          </div>

          <form className="chat-input" onSubmit={handleSend}>
            <input
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button type="submit">➤</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
