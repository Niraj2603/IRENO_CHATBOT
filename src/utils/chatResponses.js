export function handleAIResponse(userMessage) {
  const message = userMessage.toLowerCase();
  
  if (message.includes('critical') || message.includes('alert')) {
    return "I found 3 critical alerts currently active:\n\n• Transformer T-4 Overload at Brooklyn Substation (08:45 AM)\n• High voltage detected at Zone 12 Manhattan (08:32 AM)\n• Communication failure with Queens Distribution Center (08:28 AM)\n\nWould you like me to provide more details on any specific alert?";
  } 
  
  if (message.includes('brooklyn')) {
    return "Brooklyn grid status:\n\n✅ Overall Status: Operational with warnings\n⚡ Current Load: 892 MW / 1,200 MW capacity\n📊 Efficiency: 87%\n⚠️ Active Issues: 1 critical (Transformer T-4 overload)\n🔧 Maintenance: 2 scheduled for next week\n\nThe transformer overload requires immediate attention. Should I escalate this to the maintenance team?";
  } 
  
  if (message.includes('report') || message.includes('ami')) {
    return "AMI System Report generated:\n\n📈 Meter Performance:\n• Total meters: 125,430\n• Online: 123,891 (98.8%)\n• Offline: 1,539 (1.2%)\n• Read success rate: 98.8%\n\n📊 Data Quality:\n• Valid readings: 99.2%\n• Communication health: 97.8%\n• Peak performance time: 02:00-06:00 AM\n\nWould you like me to export this report or drill down into specific zones?";
  } 
  
  if (message.includes('meter') || message.includes('success')) {
    return "Current meter read success rate: 98.8%\n\n🎯 Performance by zone:\n• Manhattan: 99.1% (excellent)\n• Brooklyn: 98.5% (good)\n• Queens: 98.7% (good)\n• Bronx: 97.9% (needs attention)\n\nThe Bronx zone is slightly below target. Common causes include communication interference and scheduled maintenance. Should I schedule a diagnostic check?";
  } 
  
  if (message.includes('outage') || message.includes('manhattan')) {
    return "Manhattan outage status:\n\n✅ No major outages currently reported\n🔄 Planned maintenance: 3 locations tonight (11 PM - 5 AM)\n⚠️ Minor issues: 2 isolated incidents affecting <50 customers each\n\n📍 Affected areas:\n• East Village: 23 customers (restored ETA: 30 minutes)\n• Upper West Side: 41 customers (crew dispatched)\n\nAll critical infrastructure remains fully operational.";
  } 
  
  if (message.includes('energy') || message.includes('trend') || message.includes('consumption')) {
    return "Energy consumption trends for today:\n\n📊 Current consumption: 67,234 MWh\n📈 Peak demand: 2,847 MW (achieved at 2 PM)\n🌱 Renewable contribution: 34% (24,340 MWh)\n\n📉 Trends vs. yesterday:\n• Total consumption: +2.3%\n• Peak demand: +1.8%\n• Renewable share: +5.2%\n\n🎯 Forecast for evening peak (6 PM): 2,920 MW\nSystem capacity is adequate. No load shedding expected.";
  } 
  
  if (message.includes('hello') || message.includes('hi') || message.includes('help')) {
    return "Hello! I can help you with:\n\n🔍 System monitoring and alerts\n📊 Grid performance metrics\n⚡ Outage information and status\n📈 AMI system reports\n🌍 Energy consumption analysis\n🔧 Maintenance scheduling\n\nJust ask me about any grid operations topic, or use the quick actions on the right for common requests. What would you like to know?";
  } 
  
  return "I understand you're asking about grid operations. Let me search our systems for relevant information...\n\n🔍 Based on current data:\n• Grid status: Operational\n• Active alerts: 43 total (3 critical)\n• System performance: 89% efficiency\n• All major components: Online\n\nCould you be more specific about what you'd like to know? I can help with alerts, outages, meter readings, energy consumption, or system reports.";
} 