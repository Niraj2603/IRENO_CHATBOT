import React from 'react';
import { useApp } from '../../context/AppContext';

const sectionNames = {
  dashboard: 'Dashboard',
  chat: 'AI Assistant',
  alerts: 'Alerts',
  reports: 'Reports'
};

const themeIcons = {
  auto: (
    <svg className="theme-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="5"/>
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
    </svg>
  ),
  light: (
    <svg className="theme-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="5"/>
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
    </svg>
  ),
  dark: (
    <svg className="theme-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  )
};

function Header() {
  const { currentSection, theme, setTheme, toggleSidebar, addNotification } = useApp();

  const cycleTheme = () => {
    const themes = ['auto', 'light', 'dark'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    const nextTheme = themes[nextIndex];
    
    setTheme(nextTheme);
    addNotification({
      message: `Theme switched to ${nextTheme}`,
      type: 'info'
    });
  };

  const handleSidebarToggle = () => {
    toggleSidebar();
  };

  return (
    <header className="header">
      <div className="header-left">
        <button 
          className="sidebar-toggle desktop-hidden" 
          onClick={handleSidebarToggle}
          aria-label="Toggle Sidebar"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
        <div className="breadcrumb">
          <span className="breadcrumb-item active">
            {sectionNames[currentSection] || currentSection}
          </span>
        </div>
      </div>
      
      <div className="header-right">
        <div className="system-status">
          <div className="status-indicator online"></div>
          <span>System Online</span>
        </div>
        <button 
          className="header-btn" 
          onClick={cycleTheme}
          aria-label="Toggle Theme"
        >
          {themeIcons[theme] || themeIcons.auto}
        </button>
      </div>
    </header>
  );
}

export default Header; 