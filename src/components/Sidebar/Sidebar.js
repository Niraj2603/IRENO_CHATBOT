import React from 'react';
import { useApp } from '../../context/AppContext';

const navigationItems = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    icon: (
      <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7"/>
        <rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/>
        <rect x="3" y="14" width="7" height="7"/>
      </svg>
    )
  },
  {
    id: 'chat',
    name: 'AI Assistant',
    icon: (
      <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    )
  },
  {
    id: 'alerts',
    name: 'Alerts',
    icon: (
      <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
    badge: {
      total: 43,
      critical: 3,
      warning: 12,
      info: 28
    }
  },
  {
    id: 'reports',
    name: 'Reports',
    icon: (
      <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14,2 14,8 20,8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10,9 9,9 8,9"/>
      </svg>
    )
  }
];

function Sidebar() {
  const { currentSection, setCurrentSection, sidebarActive, toggleSidebar } = useApp();

  const handleNavClick = (sectionId) => {
    setCurrentSection(sectionId);
  };

  const handleToggle = () => {
    toggleSidebar(false);
  };

  const renderAlertBadge = (badge) => {
    if (!badge) return null;
    
    return (
      <div className="alert-badge-container">
        <span className="badge badge--total">{badge.total}</span>
        <div className="alert-breakdown">
          <div className="alert-breakdown-item">
            <span className="alert-dot alert-dot--critical"></span>
            <span className="alert-count">{badge.critical}</span>
          </div>
          <div className="alert-breakdown-item">
            <span className="alert-dot alert-dot--warning"></span>
            <span className="alert-count">{badge.warning}</span>
          </div>
          <div className="alert-breakdown-item">
            <span className="alert-dot alert-dot--info"></span>
            <span className="alert-count">{badge.info}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <aside className={`sidebar ${sidebarActive ? 'active' : ''}`}>
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">⚡</div>
          <div className="logo-text">
            <h2>IRENO</h2>
            <span>Advisor</span>
          </div>
        </div>
        <button 
          className="sidebar-toggle mobile-only" 
          onClick={handleToggle}
          aria-label="Toggle Sidebar"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {navigationItems.map((item) => (
            <li key={item.id} className="nav-item">
              <button
                className={`nav-link ${currentSection === item.id ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
                title={item.name}
              >
                <div className="nav-link-content">
                  <div className="nav-link-main">
                    {item.icon}
                    <span className="nav-text">{item.name}</span>
                  </div>
                  {item.badge && renderAlertBadge(item.badge)}
                </div>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">
            <div className="avatar-placeholder">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
          </div>
          <div className="user-info">
            <div className="user-name">Grid Operator</div>
            <div className="user-role">Cognizant Intern</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar; 