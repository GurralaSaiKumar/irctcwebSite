import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MantineBadge } from '../common/MantineBadge';

export function Navbar({ currentUser, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = currentUser?.role === 'admin';

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="irctc-navbar">
      {/* 1. TOP UTILITY BAR (User Status, Clock) */}
      <div className="irctc-top-utility-bar">
        <div className="irctc-utility-container">
          <div className="irctc-utility-left">
            <span>🇮🇳 Indian Railways &bull; Government of India</span>
            <span className="utility-divider">|</span>
            <span style={{ color: '#adb5bd' }}>Safety &bull; Security &bull; Punctuality</span>
          </div>

          <div className="irctc-utility-right">
            {currentUser ? (
              <div className="utility-user-group">
                <span className="utility-user-name">👤 {currentUser.name}</span>
                <MantineBadge color={isAdmin ? 'yellow' : 'blue'} size="xs">
                  {currentUser.role?.toUpperCase() || 'USER'}
                </MantineBadge>

                <button
                  type="button"
                  className="utility-logout-btn"
                  onClick={() => {
                    onLogout();
                    navigate('/');
                  }}
                  title="Logout from system"
                >
                  Logout ➔
                </button>
              </div>
            ) : (
              <span style={{ color: '#ced4da', fontSize: '0.75rem' }}>Guest Mode &bull; Please Sign In</span>
            )}
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER & NAVIGATION BAR */}
      <div className="irctc-main-nav-bar">
        <div className="irctc-main-nav-container">
          {/* Brand Logo & Title */}
          <div
            className="irctc-brand"
            onClick={() => navigate(currentUser ? '/book' : '/')}
          >
            <div className="irctc-logo-badge">IRCTC</div>
            <div className="irctc-brand-text">
              <h1>INDIAN RAILWAYS</h1>
              <p>e-Ticketing System Simulation</p>
            </div>
          </div>

          {/* Navigation Links using React Router */}
          {currentUser && (
            <div className="irctc-nav-links">
              <button
                className={`irctc-nav-btn ${isActive('/book') ? 'active' : ''}`}
                onClick={() => navigate('/book')}
              >
                🚆 Book Ticket
              </button>

              <button
                className={`irctc-nav-btn ${isActive('/bookings') ? 'active' : ''}`}
                onClick={() => navigate('/bookings')}
              >
                🎫 My Bookings
              </button>

              <button
                className={`irctc-nav-btn ${isActive('/master-list') ? 'active' : ''}`}
                onClick={() => navigate('/master-list')}
              >
                👥 Master List
              </button>

              <button
                className={`irctc-nav-btn ${isActive('/payments') ? 'active' : ''}`}
                onClick={() => navigate('/payments')}
              >
                💳 Saved Cards/UPI
              </button>

              <button
                className={`irctc-nav-btn ${isActive('/profile') ? 'active' : ''}`}
                onClick={() => navigate('/profile')}
              >
                👤 Profile
              </button>

              {/* Only show Route Management if user has Admin role! */}
              {isAdmin && (
                <button
                  className={`irctc-nav-btn ${isActive('/admin') ? 'active' : ''}`}
                  onClick={() => navigate('/admin')}
                  style={{ border: '1px solid rgba(255, 180, 0, 0.4)' }}
                >
                  🛠️ Manage Train Routes
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
