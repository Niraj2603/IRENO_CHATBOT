import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import AlertCard from './AlertCard';

const alertsData = [
  {
    id: 1,
    type: 'critical',
    title: 'Transformer T-4 Overload',
    description: 'Brooklyn Substation experiencing overload conditions. Immediate attention required.',
    location: 'Brooklyn Substation',
    timestamp: '08:45 AM',
    status: 'Under Investigation'
  },
  {
    id: 2,
    type: 'warning',
    title: 'Meter Read Failure Rate High',
    description: 'Zone 7 in Manhattan showing higher than normal meter read failure rates.',
    location: 'Manhattan Zone 7',
    timestamp: '08:30 AM',
    status: 'Acknowledged'
  },
  {
    id: 3,
    type: 'info',
    title: 'Scheduled Maintenance Complete',
    description: 'Routine maintenance at Queens Distribution Center has been completed successfully.',
    location: 'Queens Distribution Center',
    timestamp: '08:15 AM',
    status: 'Resolved'
  }
];

function AlertsSection() {
  const { addNotification } = useApp();
  const [alerts, setAlerts] = useState(alertsData);
  const [filter, setFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    addNotification({
      message: `Showing ${newFilter === 'all' ? 'all' : newFilter} alerts`,
      type: 'info'
    });
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      addNotification({
        message: 'Alerts refreshed',
        type: 'success'
      });
    }, 1000);
  };

  const filteredAlerts = filter === 'all' 
    ? alerts 
    : alerts.filter(alert => alert.type === filter);

  return (
    <>
      <div className="section-header">
        <h1>System Alerts</h1>
        <div className="section-actions">
          <div className="filter-group">
            <select 
              className="form-control" 
              value={filter}
              onChange={(e) => handleFilterChange(e.target.value)}
            >
              <option value="all">All Alerts</option>
              <option value="critical">Critical</option>
              <option value="warning">Warning</option>
              <option value="info">Info</option>
            </select>
          </div>
          <button 
            className="btn btn--primary" 
            onClick={handleRefresh}
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
            Refresh
          </button>
        </div>
      </div>

      <div className="alerts-container">
        {filteredAlerts.map((alert) => (
          <AlertCard key={alert.id} alert={alert} />
        ))}
      </div>
    </>
  );
}

export default AlertsSection; 