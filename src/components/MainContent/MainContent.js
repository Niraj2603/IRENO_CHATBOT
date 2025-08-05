import React from 'react';
import { useApp } from '../../context/AppContext';
import Dashboard from '../Dashboard/Dashboard';
import ChatSection from '../ChatSection/ChatSection';
import AlertsSection from '../AlertsSection/AlertsSection';
import ReportsSection from '../ReportsSection/ReportsSection';

function MainContent() {
  const { currentSection } = useApp();

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'chat':
        return <ChatSection />;
      case 'alerts':
        return <AlertsSection />;
      case 'reports':
        return <ReportsSection />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="content-wrapper">
      <div className={`content-section ${currentSection === currentSection ? 'active' : ''}`}>
        {renderCurrentSection()}
      </div>
    </div>
  );
}

export default MainContent; 