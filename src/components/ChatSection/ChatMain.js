import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';
import { handleAIResponse } from '../../utils/chatResponses';

function ChatMain() {
  const { chatMessages, addChatMessage, setTyping, isTyping } = useApp();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const message = inputValue.trim();
    setInputValue('');

    // Add user message
    addChatMessage({
      type: 'user',
      text: message
    });

    // Show typing indicator
    setTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      setTyping(false);
      
      // Get AI response
      const response = handleAIResponse(message);
      addChatMessage({
        type: 'bot',
        text: response
      });
    }, 1500 + Math.random() * 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-main">
      <div className="chat-messages">
        <ChatMessages messages={chatMessages} />
        <TypingIndicator isVisible={isTyping} />
        <div ref={messagesEndRef} />
      </div>
      
      <ChatInput
        value={inputValue}
        onChange={setInputValue}
        onSend={sendMessage}
        onKeyPress={handleKeyPress}
        disabled={isTyping}
      />
    </div>
  );
}

export default ChatMain; 