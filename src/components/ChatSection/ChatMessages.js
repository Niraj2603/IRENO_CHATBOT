import React from 'react';

function ChatMessages({ messages }) {
  return (
    <>
      {messages.map((message, index) => (
        <div key={index} className={`message ${message.type}`}>
          <div className="message-avatar">
            <div className={`avatar-${message.type}`}>
              {message.type === 'bot' ? '🤖' : '👤'}
            </div>
          </div>
          <div className="message-content">
            <div className="message-text">{message.text}</div>
            <div className="message-time">{message.timestamp}</div>
          </div>
        </div>
      ))}
    </>
  );
}

export default ChatMessages; 