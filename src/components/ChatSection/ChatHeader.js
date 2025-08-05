import React from 'react';
import { useApp } from '../../context/AppContext';

function ChatHeader() {
  const { 
    chatMessages, 
    clearChatMessages, 
    toggleSettingsModal,
    addNotification,
    addChatMessage
  } = useApp();

  const exportChat = () => {
    if (chatMessages.length === 0) {
      addNotification({
        message: 'No chat messages to export',
        type: 'warning'
      });
      return;
    }

    const chatData = {
      exportDate: new Date().toISOString(),
      messages: chatMessages
    };

    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `ireno-chat-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    addNotification({
      message: 'Chat exported successfully',
      type: 'success'
    });
  };

  const clearChat = () => {
    if (window.confirm('Are you sure you want to clear all chat messages?')) {
      clearChatMessages();
      
      // Re-add welcome message
      setTimeout(() => {
        addChatMessage({
          type: 'bot',
          text: "Hello! I'm IRENO AI Assistant. I can help you with grid operations, meter readings, alerts, and system monitoring. How can I assist you today?"
        });
      }, 100);
      
      addNotification({
        message: 'Chat cleared',
        type: 'info'
      });
    }
  };

  return (
    <div className="chat-header">
      <div className="chat-title">
        <h2>IRENO AI Assistant</h2>
        <div className="chat-status">
          <div className="status-indicator online"></div>
          <span>Online</span>
        </div>
      </div>
      <div className="chat-actions">
        <button 
          className="chat-action-btn" 
          onClick={exportChat}
          aria-label="Export Chat"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7,10 12,15 17,10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
        </button>
        <button 
          className="chat-action-btn" 
          onClick={clearChat}
          aria-label="Clear Chat"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3,6 5,6 21,6"/>
            <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
          </svg>
        </button>
        <button 
          className="chat-action-btn" 
          onClick={() => toggleSettingsModal(true)}
          aria-label="Chat Settings"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default ChatHeader; 