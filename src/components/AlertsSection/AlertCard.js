import React from 'react';
import { useApp } from '../../context/AppContext';

function AlertCard({ alert }) {
  const { addNotification } = useApp();

  const handleAcknowledge = () => {
    addNotification({
      message: `Alert "${alert.title}" acknowledged`,
      type: 'success'
    });
  };

  const handleInvestigate = () => {
    addNotification({
      message: `Investigation started for "${alert.title}"`,
      type: 'info'
    });
  };

  const handleArchive = () => {
    addNotification({
      message: `Alert "${alert.title}" archived`,
      type: 'info'
    });
  };

  const getStatusClass = (type) => {
    switch (type) {
      case 'critical':
        return 'status--error';
      case 'warning':
        return 'status--warning';
      case 'info':
        return 'status--info';
      default:
        return 'status--info';
    }
  };

  const getActionButtons = (type) => {
    if (type === 'critical') {
      return (
        <>
          <button className="btn btn--sm btn--outline" onClick={handleAcknowledge}>
            Acknowledge
          </button>
          <button className="btn btn--sm btn--primary" onClick={handleInvestigate}>
            Investigate
          </button>
        </>
      );
    } else if (type === 'warning') {
      return (
        <>
          <button className="btn btn--sm btn--outline" onClick={handleAcknowledge}>
            Acknowledge
          </button>
          <button className="btn btn--sm btn--secondary" onClick={handleInvestigate}>
            Review
          </button>
        </>
      );
    } else {
      return (
        <button className="btn btn--sm btn--outline" onClick={handleArchive}>
          Archive
        </button>
      );
    }
  };

  return (
    <div className={`alert-card ${alert.type}`}>
      <div className="alert-header">
        <div className="alert-priority">
          <span className={`status ${getStatusClass(alert.type)}`}>
            {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}
          </span>
        </div>
        <div className="alert-actions">
          {getActionButtons(alert.type)}
        </div>
      </div>
      <div className="alert-body">
        <h3>{alert.title}</h3>
        <p>{alert.description}</p>
        <div className="alert-meta">
          <div className="alert-location">📍 {alert.location}</div>
          <div className="alert-timestamp">🕐 {alert.timestamp}</div>
          <div className="alert-status-text">{alert.status}</div>
        </div>
      </div>
    </div>
  );
}

export default AlertCard; 