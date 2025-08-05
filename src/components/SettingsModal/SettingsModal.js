import React from 'react';
import { useApp } from '../../context/AppContext';

function SettingsModal() {
  const { 
    settingsModalOpen, 
    toggleSettingsModal, 
    settings, 
    updateSettings, 
    setTheme,
    addNotification 
  } = useApp();

  if (!settingsModalOpen) return null;

  const handleThemeChange = (theme) => {
    setTheme(theme);
  };

  const handleSettingChange = (setting, value) => {
    updateSettings({ [setting]: value });
  };

  const handleSave = () => {
    toggleSettingsModal(false);
    addNotification({
      message: 'Settings saved successfully',
      type: 'success'
    });
  };

  const handleReset = () => {
    const defaultSettings = {
      theme: 'auto',
      alertNotifications: true,
      systemNotifications: true,
      refreshInterval: 60
    };
    
    updateSettings(defaultSettings);
    setTheme('auto');
    addNotification({
      message: 'Settings reset to default',
      type: 'info'
    });
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      toggleSettingsModal(false);
    }
  };

  return (
    <div className="modal">
      <div className="modal-backdrop" onClick={handleBackdropClick}></div>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Settings</h2>
          <button 
            className="modal-close" 
            onClick={() => toggleSettingsModal(false)}
            aria-label="Close Settings"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        <div className="modal-body">
          <div className="setting-group">
            <label className="setting-label">Display Preferences</label>
            <div className="theme-selector">
              <div className="theme-option">
                <input 
                  type="radio" 
                  id="themeLight" 
                  name="theme" 
                  value="light"
                  checked={settings.theme === 'light'}
                  onChange={(e) => handleThemeChange(e.target.value)}
                />
                <label htmlFor="themeLight" className="theme-option-label">
                  <div className="theme-preview light"></div>
                  <span>Light</span>
                </label>
              </div>
              <div className="theme-option">
                <input 
                  type="radio" 
                  id="themeDark" 
                  name="theme" 
                  value="dark"
                  checked={settings.theme === 'dark'}
                  onChange={(e) => handleThemeChange(e.target.value)}
                />
                <label htmlFor="themeDark" className="theme-option-label">
                  <div className="theme-preview dark"></div>
                  <span>Dark</span>
                </label>
              </div>
              <div className="theme-option">
                <input 
                  type="radio" 
                  id="themeAuto" 
                  name="theme" 
                  value="auto"
                  checked={settings.theme === 'auto'}
                  onChange={(e) => handleThemeChange(e.target.value)}
                />
                <label htmlFor="themeAuto" className="theme-option-label">
                  <div className="theme-preview auto"></div>
                  <span>Auto</span>
                </label>
              </div>
            </div>
          </div>
          
          <div className="setting-group">
            <label className="setting-label">Notifications</label>
            <div className="setting-toggle">
              <input 
                type="checkbox" 
                id="alertNotifications"
                checked={settings.alertNotifications}
                onChange={(e) => handleSettingChange('alertNotifications', e.target.checked)}
              />
              <label htmlFor="alertNotifications">Critical Alert Notifications</label>
            </div>
            <div className="setting-toggle">
              <input 
                type="checkbox" 
                id="systemNotifications"
                checked={settings.systemNotifications}
                onChange={(e) => handleSettingChange('systemNotifications', e.target.checked)}
              />
              <label htmlFor="systemNotifications">System Status Updates</label>
            </div>
          </div>
          
          <div className="setting-group">
            <label className="setting-label">Data Refresh</label>
            <select 
              className="form-control"
              value={settings.refreshInterval}
              onChange={(e) => handleSettingChange('refreshInterval', parseInt(e.target.value))}
            >
              <option value="30">30 seconds</option>
              <option value="60">1 minute</option>
              <option value="300">5 minutes</option>
              <option value="600">10 minutes</option>
            </select>
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="btn btn--outline" onClick={handleReset}>
            Reset to Default
          </button>
          <button className="btn btn--primary" onClick={handleSave}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsModal; 