import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

const ChatPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi , how can I help you? 😊" }
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

  return (
    <div className="container">
      <button
        className="back-button"
        onClick={() => navigate('/')}
        title="Anasayfaya dön"
      >
        &#8592;
      </button>

      <div className="chat-card">
        <div className="chat-header">
          💬 Duygusal Destek Botu
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
            placeholder="Mesajınızı yazın..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button type="submit">➤</button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
