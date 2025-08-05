import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import MetricCard from './MetricCard';
import SystemHealthCard from './SystemHealthCard';
import RecentAlertsCard from './RecentAlertsCard';

function Dashboard() {
  const { setCurrentSection } = useApp();
  const [metrics, setMetrics] = useState({
    gridLoad: 2847,
    gridCapacity: 3200,
    efficiency: 89,
    activeMeters: 125430,
    onlineMeters: 123891,
    offlineMeters: 1539,
    totalAlerts: 43,
    criticalAlerts: 3,
    warningAlerts: 12,
    infoAlerts: 28,
    energyConsumed: 67234,
    energyGenerated: 71567,
    renewablePercent: 34
  });

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        gridLoad: Math.floor(2800 + Math.random() * 100),
        efficiency: Math.floor(85 + Math.random() * 10),
        onlineMeters: Math.floor(123800 + Math.random() * 200),
        offlineMeters: Math.floor(1500 + Math.random() * 100)
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleViewAllAlerts = () => {
    setCurrentSection('alerts');
  };

  return (
    <>
      <div className="section-header">
        <h1>Grid Operations Dashboard</h1>
        <p className="section-subtitle">Real-time monitoring and analytics for utility grid management</p>
      </div>

      <div className="metrics-grid">
        <MetricCard
          title="Grid Status"
          value="Operational"
          subtitle={`${metrics.gridLoad.toLocaleString()} MW / ${metrics.gridCapacity.toLocaleString()} MW`}
          isPrimary={true}
          progress={{
            value: metrics.efficiency,
            label: `${metrics.efficiency}% Efficiency`
          }}
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 1v6M12 17v6M5.64 5.64l4.24 4.24M14.12 14.12l4.24 4.24M1 12h6M17 12h6M5.64 18.36l4.24-4.24M14.12 9.88l4.24-4.24"/>
            </svg>
          }
        />

        <MetricCard
          title="Smart Meters"
          value={metrics.activeMeters.toLocaleString()}
          subtitle="Active Meters"
          stats={[
            { value: metrics.onlineMeters.toLocaleString(), label: 'Online', type: 'success' },
            { value: metrics.offlineMeters.toLocaleString(), label: 'Offline', type: 'warning' }
          ]}
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="4" width="20" height="16" rx="2"/>
              <path d="M7 15h0M17 15h0M7 11h8M7 7h3"/>
            </svg>
          }
        />

        <MetricCard
          title="System Alerts"
          value={metrics.totalAlerts}
          subtitle="Total Alerts"
          stats={[
            { value: metrics.criticalAlerts.toString(), label: 'Critical', type: 'error' },
            { value: metrics.warningAlerts.toString(), label: 'Warning', type: 'warning' },
            { value: metrics.infoAlerts.toString(), label: 'Info', type: 'info' }
          ]}
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          }
        />

        <MetricCard
          title="Energy Today"
          value={metrics.energyConsumed.toLocaleString()}
          subtitle="MWh Consumed"
          stats={[
            { value: `${metrics.energyGenerated.toLocaleString()} MWh`, label: 'Generated', type: 'success' },
            { value: `${metrics.renewablePercent}%`, label: 'Renewable', type: 'info' }
          ]}
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
          }
        />
      </div>

      <div className="dashboard-grid">
        <SystemHealthCard />
        <RecentAlertsCard onViewAll={handleViewAllAlerts} />
      </div>
    </>
  );
}

export default Dashboard; 