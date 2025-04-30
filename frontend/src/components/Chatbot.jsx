import React from "react";
import './styles.css';

const Chatbot = () => {
  return (
    <div className="chatbot">
      <header>
        <h2>Chatbot</h2>
      </header>
      <div className="chatbox">
        <div className="chat incoming">
          <span>🤖</span>
          <p>Hi there 👋 How can I help you today?</p>
        </div>
      </div>
      <div className="chat-input">
        <textarea placeholder="Enter a message..."></textarea>
        <span>➤</span>
      </div>
    </div>
  );
};

export default Chatbot;
