import React from 'react';
import { useApp } from '../../context/AppContext';

const quickActionButtons = [
  {
    id: 'critical-alerts',
    text: 'Critical Alerts Today',
    icon: '🚨',
    color: 'critical',
    action: 'Show me today\'s critical alerts',
    tooltip: 'View all critical system alerts that require immediate attention'
  },
  {
    id: 'brooklyn-status',
    text: 'Brooklyn Grid Status',
    icon: '🏢',
    color: 'info',
    action: 'What\'s the grid status in Brooklyn?',
    tooltip: 'Check current operational status and metrics for Brooklyn grid'
  },
  {
    id: 'ami-report',
    text: 'AMI System Report',
    icon: '📊',
    color: 'success',
    action: 'Generate AMI system report',
    tooltip: 'Generate comprehensive AMI system performance report'
  },
  {
    id: 'meter-success',
    text: 'Meter Success Rate',
    icon: '📈',
    color: 'success',
    action: 'Check meter read success rate',
    tooltip: 'View meter read success rates across all zones'
  },
  {
    id: 'manhattan-outages',
    text: 'Manhattan Outages',
    icon: '⚡',
    color: 'warning',
    action: 'Show outages in Manhattan',
    tooltip: 'Display current and planned outages in Manhattan area'
  },
  {
    id: 'energy-trends',
    text: 'Energy Trends',
    icon: '📉',
    color: 'info',
    action: 'Display energy consumption trends',
    tooltip: 'Analyze energy consumption patterns and forecasting data'
  }
];

function QuickActions() {
  const { 
    quickActionsActive, 
    toggleQuickActions, 
    addChatMessage, 
    setTyping 
  } = useApp();

  const { handleAIResponse } = require('../../utils/chatResponses');

  const handleQuickAction = (action) => {
    // Add user message
    addChatMessage({
      type: 'user',
      text: action
    });

    // Show typing indicator
    setTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      setTyping(false);
      
      // Get AI response
      const response = handleAIResponse(action);
      addChatMessage({
        type: 'bot',
        text: response
      });
    }, 1500 + Math.random() * 1000);

    // Close quick actions on mobile
    if (window.innerWidth <= 1024) {
      toggleQuickActions(false);
    }
  };

  return (
    <div className={`quick-actions ${quickActionsActive ? 'active' : ''}`}>
      <div className="quick-actions-header">
        <h3>Quick Actions</h3>
        <button
          className="quick-actions-toggle"
          onClick={() => toggleQuickActions()}
          aria-label="Toggle Quick Actions"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6,9 12,15 18,9"/>
          </svg>
        </button>
      </div>
      <div className="quick-actions-content">
        {quickActionButtons.map((button) => (
          <button
            key={button.id}
            className={`quick-action-btn quick-action-btn--${button.color}`}
            onClick={() => handleQuickAction(button.action)}
            title={button.tooltip}
            aria-label={button.tooltip}
          >
            <div className="quick-action-icon">{button.icon}</div>
            <div className="quick-action-text">{button.text}</div>
            <div className="quick-action-indicator"></div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuickActions; 