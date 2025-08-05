import React from 'react';

const recentAlertsData = [
  {
    icon: '⚠️',
    title: 'Transformer T-4 Overload',
    description: 'Brooklyn Substation - Under investigation',
    time: '08:45 AM',
    type: 'critical'
  },
  {
    icon: '⚡',
    title: 'Meter Read Failure Rate High',
    description: 'Zone 7 - Manhattan - Acknowledged',
    time: '08:30 AM',
    type: 'warning'
  },
  {
    icon: '✅',
    title: 'Scheduled Maintenance Complete',
    description: 'Queens Distribution Center - Resolved',
    time: '08:15 AM',
    type: 'info'
  }
];

function RecentAlertsCard({ onViewAll }) {
  return (
    <div className="dashboard-card">
      <div className="card-header">
        <h3>Recent Alerts</h3>
        <button 
          className="card-action-link" 
          onClick={onViewAll}
        >
          View All
        </button>
      </div>
      <div className="recent-alerts">
        {recentAlertsData.map((alert, index) => (
          <div key={index} className={`alert-item ${alert.type}`}>
            <div className="alert-icon">{alert.icon}</div>
            <div className="alert-content">
              <div className="alert-title">{alert.title}</div>
              <div className="alert-description">{alert.description}</div>
              <div className="alert-time">{alert.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentAlertsCard; 