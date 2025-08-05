# IRENO Advisor Chatbot

**IRENO (Intuitive Response-Enabled Network Optimizer)** is a specialized digital accelerator tailored for the utilities sector, helping address modern challenges in grid management, sustainability, and resilience.

## 🚀 Overview

This React-based chatbot application serves as a virtual assistant for utility companies, providing:
- AI-powered grid operations support
- Real-time monitoring and analytics
- Smart meter management
- Alert and reporting systems
- Sustainability tracking

## 🛠️ Technology Stack

- **Frontend**: React 18.2.0
- **Styling**: Custom CSS with CSS Variables (Design System)
- **State Management**: React Context + useReducer
- **Build Tool**: Create React App
- **Icons**: SVG Icons (Feather-style)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ireno-advisor-chatbot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🏗️ Project Structure

```
src/
├── components/           # React components
│   ├── AlertsSection/   # Alerts management
│   ├── ChatSection/     # AI assistant chat
│   ├── Dashboard/       # Main dashboard
│   ├── Header/          # Top navigation
│   ├── MainContent/     # Content router
│   ├── NotificationContainer/ # Toast notifications
│   ├── ReportsSection/  # Report generation
│   ├── SettingsModal/   # App settings
│   └── Sidebar/         # Side navigation
├── context/             # React Context
│   └── AppContext.js    # Global state management
├── utils/              # Utility functions
│   └── chatResponses.js # AI response logic
├── App.js              # Main app component
├── index.js            # App entry point
└── index.css           # Global styles
```

## 🎨 Features

### Dashboard
- **Real-time Metrics**: Grid status, smart meters, alerts, energy consumption
- **System Health**: Monitor component uptime and performance
- **Recent Alerts**: Quick overview of system issues

### AI Assistant Chat
- **Natural Language Processing**: Ask questions about grid operations
- **Quick Actions**: Pre-defined queries for common tasks
- **Export/Import**: Save chat history as JSON
- **Typing Indicators**: Real-time conversation feedback

### Alerts Management
- **Alert Filtering**: View by priority (Critical, Warning, Info)
- **Action Buttons**: Acknowledge, investigate, or archive alerts
- **Real-time Updates**: Auto-refresh capabilities

### Reports & Analytics
- **Grid Performance**: Comprehensive operational reports
- **AMI Analysis**: Smart meter performance metrics
- **Energy Trends**: Consumption patterns and forecasting
- **Sustainability**: Renewable energy integration tracking

### Settings & Preferences
- **Theme Support**: Light, Dark, and Auto modes
- **Notifications**: Configurable alert preferences
- **Data Refresh**: Customizable update intervals

## 🎯 Core Capabilities

| Feature | Description |
|---------|-------------|
| **AI & ML Optimizer** | Generative AI + machine learning for predictive analytics |
| **Grid Modernization** | Real-time insights for grid disruption adaptation |
| **Sustainability Focus** | Clean energy integration and efficiency tracking |
| **Predictive Analytics** | Forecast network stress, outages, and maintenance |
| **Prescriptive Engine** | Actionable recommendations for power routing and repairs |
| **Weather Response** | Vulnerability identification for extreme weather events |

## 🌱 Strategic Benefits

| Area | Benefit |
|------|---------|
| **Cost Efficiency** | Reduced downtime through automation and early detection |
| **Regulatory Compliance** | Adherence to sustainability and reliability standards |
| **Customer Experience** | Enhanced service reliability and satisfaction |
| **Sustainability Leadership** | Renewable energy integration and public trust |

## 🎨 Design System

The application uses a comprehensive design system with:
- **CSS Custom Properties** for theming
- **Semantic color tokens** for consistency
- **Typography scale** for hierarchy
- **Spacing system** for layout consistency
- **Component-based architecture** for reusability

### Theme Support
- **Light Mode**: Clean, professional interface
- **Dark Mode**: Reduced eye strain for extended use
- **Auto Mode**: Follows system preferences

## 🔧 Development Scripts

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Eject from Create React App (irreversible)
npm run eject
```

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full sidebar navigation and dual-pane chat
- **Tablet**: Collapsible sidebar and optimized layouts
- **Mobile**: Touch-friendly interface with drawer navigation

## 🚀 Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy the `build` folder** to your preferred hosting service:
   - Netlify
   - Vercel
   - AWS S3 + CloudFront
   - GitHub Pages

## 🤖 AI Assistant Capabilities

The chatbot can help with:
- **System Monitoring**: Real-time grid status and alerts
- **Meter Management**: AMI system reports and success rates
- **Outage Information**: Location-specific outage status
- **Energy Analytics**: Consumption trends and forecasting
- **Maintenance Scheduling**: Predictive maintenance recommendations

### Example Queries
- "Show me today's critical alerts"
- "What's the grid status in Brooklyn?"
- "Generate AMI system report"
- "Check meter read success rate"
- "Display energy consumption trends"

## 🔮 Future Enhancements

- **Real API Integration**: Connect to actual utility APIs (AMS, HES, MDMS)
- **Advanced AI**: Integration with Azure OpenAI for enhanced responses
- **Real-time Data**: WebSocket connections for live updates
- **Data Visualization**: Interactive charts and graphs
- **Role-based Access**: Different permissions for various user types
- **Mobile App**: React Native version for field workers

## 👥 Contributing

This project was developed by Cognizant interns as part of the IRENO platform initiative. For contributions:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🙏 Acknowledgments

- **Cognizant**: For the internship opportunity and project guidance
- **IRENO Platform**: For the vision and requirements
- **Utilities Sector**: For the real-world use cases and challenges

---

**Built with ❤️ by Cognizant Interns** 