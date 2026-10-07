import React, { useEffect } from 'react';

export function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, toast.duration || 3500);

    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';
  const isWarning = toast.type === 'warning';

  const bgColor = isSuccess ? '#e6fcf5' : isError ? '#fff5f5' : isWarning ? '#fff9db' : '#e7f5ff';
  const borderColor = isSuccess ? '#20c997' : isError ? '#fa5252' : isWarning ? '#fcc419' : '#339af0';
  const iconColor = isSuccess ? '#0ca678' : isError ? '#e03131' : isWarning ? '#f59f00' : '#1971c2';
  const icon = isSuccess ? '✅' : isError ? '❌' : isWarning ? '⚠️' : 'ℹ️';

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        minWidth: '320px',
        maxWidth: '420px',
        backgroundColor: bgColor,
        border: `1px solid ${borderColor}`,
        borderRadius: '8px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        padding: '0.85rem 1rem',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        animation: 'slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>

      <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>{icon}</span>

      <div style={{ flex: 1 }}>
        {toast.title && (
          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: iconColor, marginBottom: '0.2rem' }}>
            {toast.title}
          </div>
        )}
        <div style={{ fontSize: '0.85rem', color: '#343a40', lineHeight: 1.4 }}>
          {toast.message}
        </div>
      </div>

      <button
        onClick={onClose}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#868e96',
          cursor: 'pointer',
          fontSize: '1.1rem',
          lineHeight: 1,
          padding: '0 0.2rem'
        }}
        aria-label="Close Notification"
      >
        &times;
      </button>
    </div>
  );
}
