import React from 'react';

function MetricCard({ title, value, subtitle, isPrimary = false, progress, stats, icon }) {
  return (
    <div className={`metric-card ${isPrimary ? 'primary' : ''}`}>
      <div className="metric-header">
        <h3>{title}</h3>
        <div className="metric-icon">
          {icon}
        </div>
      </div>
      <div className="metric-content">
        <div className="metric-value">{value}</div>
        <div className="metric-subtitle">{subtitle}</div>
        
        {progress && (
          <div className="metric-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progress.value}%` }}
              ></div>
            </div>
            <span className="progress-text">{progress.label}</span>
          </div>
        )}

        {stats && (
          <div className="metric-stats">
            {stats.map((stat, index) => (
              <div key={index} className={`stat-item ${stat.type}`}>
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MetricCard; 