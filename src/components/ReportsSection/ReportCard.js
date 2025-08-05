import React, { useState } from 'react';

function ReportCard({ report, onGenerate }) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      setIsGenerating(false);
      onGenerate();
    }, 2000);
  };

  return (
    <div className="report-card">
      <div className="report-icon">{report.icon}</div>
      <h3>{report.title}</h3>
      <p>{report.description}</p>
      <button 
        className="btn btn--primary btn--full-width" 
        onClick={handleGenerate}
        disabled={isGenerating}
      >
        {isGenerating ? 'Generating...' : 'Generate Report'}
      </button>
    </div>
  );
}

export default ReportCard; 