import React from 'react';
import { useApp } from '../../context/AppContext';
import ReportCard from './ReportCard';

const reportsData = [
  {
    id: 'grid-performance',
    title: 'Grid Performance Report',
    description: 'Comprehensive analysis of grid operations, load distribution, and efficiency metrics.',
    icon: '📊'
  },
  {
    id: 'ami-analysis',
    title: 'AMI System Analysis',
    description: 'Smart meter performance, read success rates, and communication health metrics.',
    icon: '📈'
  },
  {
    id: 'energy-trends',
    title: 'Energy Consumption Trends',
    description: 'Detailed analysis of energy usage patterns, peak demand, and forecasting.',
    icon: '⚡'
  },
  {
    id: 'sustainability',
    title: 'Sustainability Metrics',
    description: 'Renewable energy integration, carbon footprint, and environmental impact analysis.',
    icon: '🌱'
  },
  {
    id: 'alert-summary',
    title: 'Alert Summary',
    description: 'Historical alert trends, resolution times, and system reliability metrics.',
    icon: '⚠️'
  },
  {
    id: 'maintenance',
    title: 'Maintenance Schedule',
    description: 'Predictive maintenance recommendations and equipment lifecycle analysis.',
    icon: '🔧'
  }
];

function ReportsSection() {
  const { addNotification } = useApp();

  const handleGenerateReport = (reportTitle) => {
    addNotification({
      message: `${reportTitle} generated successfully`,
      type: 'success'
    });
  };

  return (
    <>
      <div className="section-header">
        <h1>Reports & Analytics</h1>
        <p className="section-subtitle">Generate comprehensive reports for grid performance and compliance</p>
      </div>

      <div className="reports-grid">
        {reportsData.map((report) => (
          <ReportCard 
            key={report.id} 
            report={report} 
            onGenerate={() => handleGenerateReport(report.title)}
          />
        ))}
      </div>
    </>
  );
}

export default ReportsSection; 