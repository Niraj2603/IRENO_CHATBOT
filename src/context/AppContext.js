import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';

// Initial state
const initialState = {
  currentSection: 'dashboard',
  theme: 'auto',
  settings: {
    theme: 'auto',
    alertNotifications: true,
    systemNotifications: true,
    refreshInterval: 60
  },
  chatMessages: [],
  isTyping: false,
  sidebarActive: false,
  quickActionsActive: false,
  settingsModalOpen: false,
  notifications: []
};

// Action types
const ActionTypes = {
  SET_CURRENT_SECTION: 'SET_CURRENT_SECTION',
  SET_THEME: 'SET_THEME',
  UPDATE_SETTINGS: 'UPDATE_SETTINGS',
  ADD_CHAT_MESSAGE: 'ADD_CHAT_MESSAGE',
  CLEAR_CHAT_MESSAGES: 'CLEAR_CHAT_MESSAGES',
  SET_TYPING: 'SET_TYPING',
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
  TOGGLE_QUICK_ACTIONS: 'TOGGLE_QUICK_ACTIONS',
  TOGGLE_SETTINGS_MODAL: 'TOGGLE_SETTINGS_MODAL',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION'
};

// Reducer function
function appReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_CURRENT_SECTION:
      return {
        ...state,
        currentSection: action.payload,
        sidebarActive: false // Close sidebar on mobile when section changes
      };
    
    case ActionTypes.SET_THEME:
      const newSettings = { ...state.settings, theme: action.payload };
      return {
        ...state,
        theme: action.payload,
        settings: newSettings
      };
    
    case ActionTypes.UPDATE_SETTINGS:
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };
    
    case ActionTypes.ADD_CHAT_MESSAGE:
      return {
        ...state,
        chatMessages: [...state.chatMessages, action.payload]
      };
    
    case ActionTypes.CLEAR_CHAT_MESSAGES:
      return {
        ...state,
        chatMessages: []
      };
    
    case ActionTypes.SET_TYPING:
      return {
        ...state,
        isTyping: action.payload
      };
    
    case ActionTypes.TOGGLE_SIDEBAR:
      return {
        ...state,
        sidebarActive: action.payload !== undefined ? action.payload : !state.sidebarActive
      };
    
    case ActionTypes.TOGGLE_QUICK_ACTIONS:
      return {
        ...state,
        quickActionsActive: action.payload !== undefined ? action.payload : !state.quickActionsActive
      };
    
    case ActionTypes.TOGGLE_SETTINGS_MODAL:
      return {
        ...state,
        settingsModalOpen: action.payload !== undefined ? action.payload : !state.settingsModalOpen
      };
    
    case ActionTypes.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, { ...action.payload, id: Date.now() }]
      };
    
    case ActionTypes.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      };
    
    default:
      return state;
  }
}

// Create context
const AppContext = createContext();

// Context provider component
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const chatInitialized = useRef(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('ireno-settings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        dispatch({
          type: ActionTypes.UPDATE_SETTINGS,
          payload: parsedSettings
        });
        dispatch({
          type: ActionTypes.SET_THEME,
          payload: parsedSettings.theme || 'auto'
        });
      } catch (e) {
        console.warn('Failed to load settings from localStorage');
      }
    }
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('ireno-settings', JSON.stringify(state.settings));
  }, [state.settings]);

  // Apply theme to document
  useEffect(() => {
    const html = document.documentElement;
    
    if (state.theme === 'dark') {
      html.setAttribute('data-color-scheme', 'dark');
    } else if (state.theme === 'light') {
      html.setAttribute('data-color-scheme', 'light');
    } else {
      html.removeAttribute('data-color-scheme');
    }
  }, [state.theme]);

  // Initialize chat with welcome message (only once)
  useEffect(() => {
    if (!chatInitialized.current && state.chatMessages.length === 0) {
      chatInitialized.current = true;
      const welcomeMessage = {
        type: 'bot',
        text: "Hello! I'm IRENO AI Assistant. I can help you with grid operations, meter readings, alerts, and system monitoring. How can I assist you today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      dispatch({
        type: ActionTypes.ADD_CHAT_MESSAGE,
        payload: welcomeMessage
      });
    }
  }, [state.chatMessages.length]);

  // Action creators
  const actions = {
    setCurrentSection: (section) => dispatch({
      type: ActionTypes.SET_CURRENT_SECTION,
      payload: section
    }),
    
    setTheme: (theme) => dispatch({
      type: ActionTypes.SET_THEME,
      payload: theme
    }),
    
    updateSettings: (settings) => dispatch({
      type: ActionTypes.UPDATE_SETTINGS,
      payload: settings
    }),
    
    addChatMessage: (message) => dispatch({
      type: ActionTypes.ADD_CHAT_MESSAGE,
      payload: {
        ...message,
        timestamp: message.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    }),
    
    clearChatMessages: () => {
      chatInitialized.current = false; // Reset initialization flag
      dispatch({
        type: ActionTypes.CLEAR_CHAT_MESSAGES
      });
    },
    
    setTyping: (isTyping) => dispatch({
      type: ActionTypes.SET_TYPING,
      payload: isTyping
    }),
    
    toggleSidebar: (active) => dispatch({
      type: ActionTypes.TOGGLE_SIDEBAR,
      payload: active
    }),
    
    toggleQuickActions: (active) => dispatch({
      type: ActionTypes.TOGGLE_QUICK_ACTIONS,
      payload: active
    }),
    
    toggleSettingsModal: (open) => dispatch({
      type: ActionTypes.TOGGLE_SETTINGS_MODAL,
      payload: open
    }),
    
    addNotification: (notification) => dispatch({
      type: ActionTypes.ADD_NOTIFICATION,
      payload: notification
    }),
    
    removeNotification: (id) => dispatch({
      type: ActionTypes.REMOVE_NOTIFICATION,
      payload: id
    })
  };

  const value = {
    ...state,
    ...actions
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook to use the app context
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export { ActionTypes }; 