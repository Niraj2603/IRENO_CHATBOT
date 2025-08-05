import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';

function NotificationContainer() {
  const { notifications, removeNotification } = useApp();

  useEffect(() => {
    // Auto-remove notifications after 5 seconds
    notifications.forEach(notification => {
      if (notification.id) {
        setTimeout(() => {
          removeNotification(notification.id);
        }, 5000);
      }
    });
  }, [notifications, removeNotification]);

  if (notifications.length === 0) return null;

  return (
    <div className="notification-container" style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 1100,
      maxWidth: '300px'
    }}>
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`notification notification--${notification.type}`}
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-card-border)',
            borderRadius: 'var(--radius-base)',
            padding: 'var(--space-12) var(--space-16)',
            boxShadow: 'var(--shadow-lg)',
            marginBottom: 'var(--space-8)',
            animation: 'slideIn 0.3s ease-out',
            borderLeft: `4px solid ${
              notification.type === 'success' ? 'var(--color-success)' :
              notification.type === 'error' ? 'var(--color-error)' :
              notification.type === 'warning' ? 'var(--color-warning)' :
              'var(--color-info)'
            }`
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--space-12)'
          }}>
            <span style={{
              color: 'var(--color-text)',
              fontSize: 'var(--font-size-sm)'
            }}>
              {notification.message}
            </span>
            <button
              onClick={() => removeNotification(notification.id)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-text-secondary)',
                cursor: 'pointer',
                fontSize: '18px',
                lineHeight: 1,
                padding: 0
              }}
              onMouseOver={(e) => e.target.style.color = 'var(--color-text)'}
              onMouseOut={(e) => e.target.style.color = 'var(--color-text-secondary)'}
            >
              ×
            </button>
          </div>
        </div>
      ))}
      
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export default NotificationContainer; 