import React, { useState } from 'react';
import { MantineCard } from '../common/MantineCard';
import { MantineButton } from '../common/MantineButton';
import { MantineBadge } from '../common/MantineBadge';
import { MantineTextInput } from '../common/MantineInput';
import { storageService } from '../../services/storage';

export function UserProfile({ currentUser, onUpdateUser }) {
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    address: currentUser?.address || '',
    username: currentUser?.username || ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const bookings = storageService.getBookings();
  const masterList = storageService.getMasterList();
  const paymentMethods = storageService.getPaymentMethods();

  const handleSave = (e) => {
    e.preventDefault();
    const updated = {
      ...currentUser,
      ...formData
    };
    storageService.saveUser(updated);
    storageService.setCurrentUser(updated);
    onUpdateUser(updated);
    setIsEditing(false);
    setSuccessMsg('Profile updated successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div style={{ maxWidth: '820px', margin: '0 auto', marginBottom: '3rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--irctc-navy)', margin: 0 }}>
          IRCTC User Profile
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--mantine-color-gray-6)', margin: '0.2rem 0 0 0' }}>
          Personal identity, verified contact information & travel analytics
        </p>
      </div>

      {successMsg && (
        <div style={{ padding: '0.75rem', background: '#e6fcf5', color: '#0ca678', border: '1px solid #b2f2bb', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
          ✅ {successMsg}
        </div>
      )}

      {/* User Stats Card */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <MantineCard style={{ background: '#fff', border: '1px solid #ced4da', textAlign: 'center' }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--irctc-navy)' }}>
            {bookings.length}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#868e96', fontWeight: 600 }}>Total Bookings</div>
        </MantineCard>

        <MantineCard style={{ background: '#fff', border: '1px solid #ced4da', textAlign: 'center' }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0ca678' }}>
            {bookings.filter(b => b.status === 'CONFIRMED').length}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#868e96', fontWeight: 600 }}>Active Tickets</div>
        </MantineCard>

        <MantineCard style={{ background: '#fff', border: '1px solid #ced4da', textAlign: 'center' }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--irctc-orange)' }}>
            {masterList.length}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#868e96', fontWeight: 600 }}>Master Passengers</div>
        </MantineCard>

        <MantineCard style={{ background: '#fff', border: '1px solid #ced4da', textAlign: 'center' }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1971c2' }}>
            {paymentMethods.length}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#868e96', fontWeight: 600 }}>Saved Cards / UPI</div>
        </MantineCard>
      </div>

      {/* Profile Details Card */}
      <MantineCard style={{ background: '#fff', border: '1px solid #ced4da' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #f1f3f5', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--irctc-navy)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 800 }}>
              {currentUser?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--irctc-navy)' }}>
                {currentUser?.name}
              </div>
              <MantineBadge color={currentUser?.role === 'admin' ? 'yellow' : 'blue'}>
                {currentUser?.role === 'admin' ? 'Railway Administrator' : 'Verified Passenger'}
              </MantineBadge>
            </div>
          </div>

          <MantineButton
            variant={isEditing ? 'outline' : 'light'}
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Cancel Edit' : '✏️ Edit Profile'}
          </MantineButton>
        </div>

        <form onSubmit={handleSave}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <MantineTextInput
              label="IRCTC Username"
              value={formData.username}
              disabled
              helperText="Username cannot be modified"
            />

            <MantineTextInput
              label="Full Legal Name"
              value={formData.name}
              disabled={!isEditing}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />

            <MantineTextInput
              label="Email Address"
              value={formData.email}
              disabled={!isEditing}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />

            <MantineTextInput
              label="Mobile Number"
              value={formData.phone}
              disabled={!isEditing}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div style={{ marginTop: '0.75rem' }}>
            <MantineTextInput
              label="Billing & Residential Address"
              value={formData.address}
              disabled={!isEditing}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Enter your street address, city, pincode"
            />
          </div>

          {isEditing && (
            <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <MantineButton variant="outline" size="sm" type="button" onClick={() => setIsEditing(false)}>
                Cancel
              </MantineButton>
              <MantineButton variant="orange" size="sm" type="submit">
                Save Profile Changes
              </MantineButton>
            </div>
          )}
        </form>
      </MantineCard>
    </div>
  );
}
