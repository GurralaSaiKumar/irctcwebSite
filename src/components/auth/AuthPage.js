import React, { useState } from 'react';
import { MantineCard } from '../common/MantineCard';
import { MantineButton } from '../common/MantineButton';
import { MantineBadge } from '../common/MantineBadge';
import { MantineTextInput, MantineSelect } from '../common/MantineInput';
import { storageService } from '../../services/storage';

export function AuthPage({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    role: 'user',
    address: ''
  });
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');
    const users = storageService.getUsers();
    const found = users.find(
      (u) => u.username === formData.username && u.password === formData.password
    );

    if (found) {
      storageService.setCurrentUser(found);
      onLoginSuccess(found);
    } else {
      setError('Invalid username or password. You can use the quick demo buttons below.');
    }
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.username || !formData.password) {
      setError('Please fill in all mandatory fields (*)');
      return;
    }

    const users = storageService.getUsers();
    if (users.find((u) => u.username.toLowerCase() === formData.username.toLowerCase())) {
      setError('Username already taken. Please choose another username.');
      return;
    }

    const newUser = {
      id: 'usr_' + Date.now(),
      role: 'user',
      ...formData
    };

    storageService.saveUser(newUser);
    storageService.setCurrentUser(newUser);
    setSuccessMsg('Account created successfully! Logging you in...');
    setTimeout(() => {
      onLoginSuccess(newUser);
    }, 600);
  };

  const handleQuickLogin = (username, password) => {
    const users = storageService.getUsers();
    const found = users.find((u) => u.username === username);
    if (found) {
      storageService.setCurrentUser(found);
      onLoginSuccess(found);
    }
  };

  return (
    <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '1rem 0 3rem 0' }}>

      {/* Top Welcome Hero Banner */}
      <div style={{ background: 'linear-gradient(135deg, #0f2b48 0%, #1e4a78 100%)', color: '#ffffff', borderRadius: '12px', padding: '2rem', marginBottom: '2rem', boxShadow: '0 8px 24px rgba(15, 43, 72, 0.2)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.15)', padding: '0.35rem 0.75rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.75rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }}></span>
              Indian Railways Next Generation e-Ticketing System
            </div>
            <h1 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)', fontWeight: 800, margin: '0 0 0.5rem 0', letterSpacing: '-0.02em' }}>
              Welcome to IRCTC Portal Simulation
            </h1>
            <p style={{ margin: 0, color: '#ced4da', fontSize: '0.95rem', maxWidth: '680px', lineHeight: 1.5 }}>
              Please review the basic system guidelines and sign in with your credentials or register a new account to book train tickets and manage reservations.
            </p>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', padding: '1rem 1.25rem', borderRadius: '10px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f76707' }}>
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#e9ecef' }}>
              {new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#a5d8ff', marginTop: '0.25rem', fontWeight: 600 }}>
              Railway Time (IST)
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem', alignItems: 'start' }}>

        {/* LEFT COLUMN: BASIC THINGS & SYSTEM GUIDELINES */}
        <div>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--irctc-navy)', margin: '0 0 0.4rem 0' }}>
              ℹ️ Basic Things & Service Highlights
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#6c757d', margin: 0 }}>
              Key features and essential travel rules in this simulation
            </p>
          </div>

          {/* Core Feature Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <MantineCard style={{ background: '#fff' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>🚆</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--irctc-navy)', marginBottom: '0.25rem' }}>
                Live Train Availability
              </div>
              <div style={{ fontSize: '0.8rem', color: '#6c757d', lineHeight: 1.4 }}>
                Real-time seat quotas across 1A, 2A, 3A, Sleeper (SL), and Chair Car with instant pricing.
              </div>
            </MantineCard>

            <MantineCard style={{ background: '#fff' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>👥</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--irctc-navy)', marginBottom: '0.25rem' }}>
                Master Passenger List
              </div>
              <div style={{ fontSize: '0.8rem', color: '#6c757d', lineHeight: 1.4 }}>
                Save co-travelers and senior citizens once for 1-click import during fast ticket bookings.
              </div>
            </MantineCard>

            <MantineCard style={{ background: '#fff' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>💳</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--irctc-navy)', marginBottom: '0.25rem' }}>
                Simulated Payment Gateway
              </div>
              <div style={{ fontSize: '0.8rem', color: '#6c757d', lineHeight: 1.4 }}>
                Pay via Saved Cards, UPI QR scan, Debit/Credit Card, or Net Banking with simulated processing.
              </div>
            </MantineCard>

            <MantineCard style={{ background: '#fff' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>🎫</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--irctc-navy)', marginBottom: '0.25rem' }}>
                PNR & Cancellation
              </div>
              <div style={{ fontSize: '0.8rem', color: '#6c757d', lineHeight: 1.4 }}>
                Get electronic reservation slips with coach/seat numbers, plus simulated 85% cancellation refunds.
              </div>
            </MantineCard>
          </div>

          {/* Important Rules Banner */}
          <MantineCard style={{ background: '#fff9db', border: '1px solid #fde68a', marginBottom: '1.5rem' }}>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#d97706', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span>⚠️</span> Important Guidelines to Know Before Booking:
            </div>
            <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.8rem', color: '#495057', lineHeight: 1.7 }}>
              <li><strong>Tatkal Booking Timings:</strong> AC classes open at 10:00 AM, Non-AC at 11:00 AM daily.</li>
              <li><strong>Passenger Limit:</strong> Maximum 6 passengers per single booking transaction.</li>
              <li><strong>Identity Proof:</strong> Valid Govt ID (Aadhaar, Voter ID, Passport) required during journey.</li>
              <li><strong>Admin Privileges:</strong> Railway Administrators can add new train routes and seat allocations.</li>
            </ul>
          </MantineCard>

          {/* Data Storage Notice */}
          <div style={{ fontSize: '0.8rem', color: '#868e96', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>💾</span> All application data is stored locally in your browser's <code>localStorage</code>.
          </div>
        </div>

        {/* RIGHT COLUMN: LOGIN / SIGNUP FORM */}
        <div>
          <MantineCard style={{ background: '#ffffff', border: '1px solid #ced4da', boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}>

            {/* Form Toggle Header */}
            <div style={{ display: 'flex', borderBottom: '2px solid #dee2e6', marginBottom: '1.5rem' }}>
              <button
                type="button"
                onClick={() => { setIsLogin(true); setError(''); }}
                style={{
                  flex: 1,
                  padding: '0.85rem',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  border: 'none',
                  background: 'none',
                  borderBottom: isLogin ? '3px solid var(--irctc-orange)' : '3px solid transparent',
                  color: isLogin ? 'var(--irctc-orange)' : '#6c757d',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                Sign In to IRCTC
              </button>
              <button
                type="button"
                onClick={() => { setIsLogin(false); setError(''); }}
                style={{
                  flex: 1,
                  padding: '0.85rem',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  border: 'none',
                  background: 'none',
                  borderBottom: !isLogin ? '3px solid var(--irctc-orange)' : '3px solid transparent',
                  color: !isLogin ? 'var(--irctc-orange)' : '#6c757d',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                New User Registration (Sign Up)
              </button>
            </div>

            {error && (
              <div style={{ padding: '0.65rem 0.85rem', backgroundColor: '#fff5f5', color: '#e03131', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1.25rem', border: '1px solid #ffc9c9' }}>
                ⚠️ {error}
              </div>
            )}

            {successMsg && (
              <div style={{ padding: '0.65rem 0.85rem', backgroundColor: '#e6fcf5', color: '#0ca678', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1.25rem', border: '1px solid #b2f2bb' }}>
                ✅ {successMsg}
              </div>
            )}

            {/* LOGIN FORM */}
            {isLogin ? (
              <form onSubmit={handleLoginSubmit}>
                <MantineTextInput
                  label="IRCTC Username"
                  name="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your registered username"
                />

                <MantineTextInput
                  label="Password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your account password"
                />

                <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <MantineButton type="submit" variant="orange" fullWidth size="md">
                    Sign In to Book Tickets →
                  </MantineButton>
                </div>

                {/* 1-Click Demo Logins */}
                <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid #f1f3f5' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#868e96', marginBottom: '0.75rem', textTransform: 'uppercase', textAlign: 'center' }}>
                    ⚡ Instant 1-Click Test Access:
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <MantineButton
                      type="button"
                      variant="light"
                      size="xs"
                      onClick={() => handleQuickLogin('aarav_irctc', 'password123')}
                    >
                      👤 Passenger (Aarav)
                    </MantineButton>

                    <MantineButton
                      type="button"
                      variant="outline"
                      size="xs"
                      onClick={() => handleQuickLogin('admin_rail', 'admin123')}
                    >
                      👑 Railway Admin
                    </MantineButton>
                  </div>
                </div>
              </form>
            ) : (
              /* SIGNUP FORM */
              <form onSubmit={handleSignupSubmit}>
                <MantineTextInput
                  label="Full Name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="As per Government Photo ID"
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <MantineTextInput
                    label="Email Address"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                  />
                  <MantineTextInput
                    label="Mobile Number"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="10-digit number"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <MantineTextInput
                    label="Desired Username"
                    name="username"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Choose username"
                  />
                  <MantineTextInput
                    label="Password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create password"
                  />
                </div>

                <MantineSelect
                  label="Account Role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  options={[
                    { label: 'Passenger / General Public', value: 'user' },
                    { label: 'Railway Administrator', value: 'admin' }
                  ]}
                />

                <MantineTextInput
                  label="Residential Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="City, State, Pincode"
                />

                <div style={{ marginTop: '1.25rem' }}>
                  <MantineButton type="submit" variant="orange" fullWidth size="md">
                    Complete Registration & Enter Portal →
                  </MantineButton>
                </div>
              </form>
            )}

          </MantineCard>
        </div>

      </div>
    </div>
  );
}
