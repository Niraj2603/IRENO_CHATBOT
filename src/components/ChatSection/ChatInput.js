import React from 'react';

function ChatInput({ value, onChange, onSend, onKeyPress, disabled }) {
  return (
    <div className="chat-input-container">
      <div className="chat-input-wrapper">
        <input
          type="text"
          className="chat-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={onKeyPress}
          placeholder="Ask about grid status, alerts, meters, or system health..."
          disabled={disabled}
          autoComplete="off"
        />
        <button
          className="send-btn"
          onClick={onSend}
          disabled={disabled || !value.trim()}
          aria-label="Send Message"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22,2 15,22 11,13 2,9 22,2"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default ChatInput; 