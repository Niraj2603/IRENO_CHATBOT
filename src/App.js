import React from 'react';
import { AppProvider } from './context/AppContext';
import Sidebar from './components/Sidebar/Sidebar';
import Header from './components/Header/Header';
import MainContent from './components/MainContent/MainContent';
import SettingsModal from './components/SettingsModal/SettingsModal';
import NotificationContainer from './components/NotificationContainer/NotificationContainer';

function App() {
  return (
    <AppProvider>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Header />
          <MainContent />
        </div>
        <SettingsModal />
        <NotificationContainer />
      </div>
    </AppProvider>
  );
}

export default App; 