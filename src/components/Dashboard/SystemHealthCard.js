import React, { useState } from 'react';

const systemHealthData = [
  { name: 'Grid Operations', uptime: '99.9% uptime', status: 'online' },
  { name: 'AMI System', uptime: '98.8% uptime', status: 'online' },
  { name: 'Data Processing', uptime: '97.2% uptime', status: 'warning' },
  { name: 'API Gateway', uptime: '99.5% uptime', status: 'online' }
];

function SystemHealthCard() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <div className="dashboard-card">
      <div className="card-header">
        <h3>System Health</h3>
        <button 
          className="card-action" 
          onClick={handleRefresh}
          aria-label="Refresh"
          disabled={isRefreshing}
        >
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            style={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }}
          >
            <polyline points="23 4 23 10 17 10"/>
            <polyline points="1 20 1 14 7 14"/>
            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
          </svg>
        </button>
      </div>
      <div className="system-health-list">
        {systemHealthData.map((item, index) => (
          <div key={index} className="health-item">
            <div className={`health-status ${item.status}`}></div>
            <div className="health-info">
              <div className="health-name">{item.name}</div>
              <div className="health-uptime">{item.uptime}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SystemHealthCard; 