import React from 'react';
import { useApp } from '../../context/AppContext';
import ChatHeader from './ChatHeader';
import ChatMain from './ChatMain';
import QuickActions from './QuickActions';

function ChatSection() {
  const { quickActionsActive } = useApp();

  return (
    <div className="chat-container">
      <ChatHeader />
      <div className={`chat-layout ${quickActionsActive ? 'quick-actions-active' : ''}`}>
        <ChatMain />
        <QuickActions />
      </div>
    </div>
  );
}

export default ChatSection; 