import React, { useState } from 'react';
import { MantineModal } from '../common/MantineModal';
import { MantineTextInput, MantineSelect } from '../common/MantineInput';
import { MantineButton } from '../common/MantineButton';
import { storageService } from '../../services/storage';

export function AuthModal({ isOpen, onClose, onAuthSuccess }) {
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const users = storageService.getUsers();

    if (isLogin) {
      const found = users.find(
        (u) => u.username === formData.username && u.password === formData.password
      );
      if (found) {
        storageService.setCurrentUser(found);
        onAuthSuccess(found);
        onClose();
      } else {
        setError('Invalid username or password. (Demo: aarav_irctc / password123)');
      }
    } else {
      if (!formData.name || !formData.email || !formData.username || !formData.password) {
        setError('Please fill all mandatory fields');
        return;
      }
      if (users.find((u) => u.username === formData.username)) {
        setError('Username already taken. Please choose another.');
        return;
      }

      const newUser = {
        id: 'usr_' + Date.now(),
        role: 'user',
        ...formData
      };
      storageService.saveUser(newUser);
      storageService.setCurrentUser(newUser);
      onAuthSuccess(newUser);
      onClose();
    }
  };

  const fillDemoCredentials = () => {
    setFormData({
      ...formData,
      username: 'aarav_irctc',
      password: 'password123'
    });
  };

  return (
    <MantineModal
      isOpen={isOpen}
      onClose={onClose}
      title={isLogin ? 'IRCTC User Login' : 'Create IRCTC Account (Signup)'}
    >
      <form onSubmit={handleSubmit}>
        {error && (
          <div
            style={{
              padding: '0.65rem 0.85rem',
              backgroundColor: 'var(--mantine-color-red-0)',
              color: 'var(--mantine-color-red-6)',
              borderRadius: '6px',
              fontSize: '0.85rem',
              marginBottom: '1rem',
              border: '1px solid #ffc9c9'
            }}
          >
            {error}
          </div>
        )}

        {!isLogin && (
          <>
            <MantineTextInput
              label="Full Name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Rahul Verma"
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
            <MantineSelect
              label="Account Role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              options={[
                { label: 'Passenger / User', value: 'user' },
                { label: 'Railway Admin', value: 'admin' }
              ]}
            />
            <MantineTextInput
              label="Residential Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="House, Street, City, Pincode"
            />
          </>
        )}

        <MantineTextInput
          label="IRCTC Username"
          name="username"
          required
          value={formData.username}
          onChange={handleChange}
          placeholder="Enter username"
        />

        <MantineTextInput
          label="Password"
          name="password"
          type="password"
          required
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter password"
        />

        <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <MantineButton type="submit" variant="orange" fullWidth size="lg">
            {isLogin ? 'Sign In to IRCTC' : 'Complete Registration'}
          </MantineButton>

          {isLogin && (
            <MantineButton type="button" variant="light" size="sm" onClick={fillDemoCredentials}>
              Auto-fill Demo Credentials (aarav_irctc)
            </MantineButton>
          )}

          <div style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--mantine-color-gray-6)' }}>
            {isLogin ? "Don't have an IRCTC account?" : 'Already registered with IRCTC?'}{' '}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--mantine-primary)',
                fontWeight: 600,
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              {isLogin ? 'Register / Sign Up' : 'Login here'}
            </button>
          </div>
        </div>
      </form>
    </MantineModal>
  );
}
