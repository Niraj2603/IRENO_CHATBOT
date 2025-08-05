import React from 'react';

function TypingIndicator({ isVisible }) {
  if (!isVisible) return null;

  return (
    <div className="typing-indicator">
      <div className="typing-avatar">
        <div className="avatar-bot">🤖</div>
      </div>
      <div className="typing-content">
        <div className="typing-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
}

export default TypingIndicator; 