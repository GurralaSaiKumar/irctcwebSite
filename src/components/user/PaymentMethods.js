import React, { useState, useEffect } from 'react';
import { MantineCard } from '../common/MantineCard';
import { MantineButton } from '../common/MantineButton';
import { MantineBadge } from '../common/MantineBadge';
import { MantineModal } from '../common/MantineModal';
import { MantineTextInput, MantineSelect } from '../common/MantineInput';
import { storageService } from '../../services/storage';

export function PaymentMethods({ showToast }) {
  const [methods, setMethods] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [methodType, setMethodType] = useState('UPI'); // 'UPI' | 'CARD'
  const [formData, setFormData] = useState({
    name: '',
    upiId: '',
    cardHolder: '',
    cardNumber: '',
    expiry: '',
    bank: 'HDFC Bank'
  });
  const [error, setError] = useState('');

  useEffect(() => {
    setMethods(storageService.getPaymentMethods());
  }, []);

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      upiId: '',
      cardHolder: '',
      cardNumber: '',
      expiry: '',
      bank: 'HDFC Bank'
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    const updated = storageService.deletePaymentMethod(id);
    setMethods(updated);
    if (showToast) showToast('info', 'Payment Method Removed', 'Saved payment method deleted.');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (methodType === 'UPI') {
      if (!formData.upiId.trim() || !formData.upiId.includes('@')) {
        const err = 'Please enter a valid UPI ID (e.g. name@okhdfcbank)';
        setError(err);
        if (showToast) showToast('error', 'Validation Error', err);
        return;
      }
      const newMethod = {
        type: 'UPI',
        upiId: formData.upiId.trim(),
        name: formData.name.trim() || 'Personal UPI'
      };
      const updated = storageService.addPaymentMethod(newMethod);
      setMethods(updated);
      setIsModalOpen(false);
      if (showToast) showToast('success', 'UPI VPA Saved', `${newMethod.upiId} saved for 1-click checkout.`);
    } else {
      if (!formData.cardHolder.trim() || !formData.cardNumber.trim()) {
        const err = 'Please enter cardholder name and card number';
        setError(err);
        if (showToast) showToast('error', 'Validation Error', err);
        return;
      }
      const rawNum = formData.cardNumber.replace(/\s+/g, '');
      if (rawNum.length < 16) {
        const err = 'Please enter a valid 16-digit card number';
        setError(err);
        if (showToast) showToast('error', 'Validation Error', err);
        return;
      }
      const masked = `•••• •••• •••• ${rawNum.slice(-4)}`;
      const newMethod = {
        type: 'CARD',
        cardHolder: formData.cardHolder.toUpperCase(),
        cardNumber: masked,
        expiry: formData.expiry || '12/29',
        bank: formData.bank || 'Visa/Mastercard'
      };
      const updated = storageService.addPaymentMethod(newMethod);
      setMethods(updated);
      setIsModalOpen(false);
      if (showToast) showToast('success', 'Card Saved', `${newMethod.bank} card (${masked}) stored securely.`);
    }
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', marginBottom: '3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--irctc-navy)', margin: 0 }}>
            Saved Payment Methods
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--mantine-color-gray-6)', margin: '0.2rem 0 0 0' }}>
            Store debit cards, credit cards, and UPI virtual payment addresses for fast 1-click checkout
          </p>
        </div>
        <MantineButton variant="orange" size="sm" onClick={handleOpenAdd} icon="➕">
          Add Payment Method
        </MantineButton>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
        {methods.map((m) => (
          <MantineCard key={m.id} style={{ background: '#fff', border: '1px solid #ced4da', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.5rem' }}>{m.type === 'UPI' ? '📱' : '💳'}</span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--irctc-navy)' }}>
                    {m.type === 'UPI' ? m.name : m.bank}
                  </div>
                  <MantineBadge color={m.type === 'UPI' ? 'blue' : 'green'}>
                    {m.type === 'UPI' ? 'BHIM UPI' : 'DEBIT / CREDIT'}
                  </MantineBadge>
                </div>
              </div>
              <button
                onClick={() => handleDelete(m.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#fa5252',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: 600
                }}
              >
                Delete
              </button>
            </div>

            <div style={{ background: '#f8f9fa', padding: '0.75rem', borderRadius: '6px', fontFamily: 'monospace', fontSize: '1rem', fontWeight: 700, color: '#343a40', letterSpacing: '1px' }}>
              {m.type === 'UPI' ? m.upiId : m.cardNumber}
            </div>

            {m.type === 'CARD' && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', fontSize: '0.75rem', color: '#868e96' }}>
                <span>HOLDER: {m.cardHolder}</span>
                <span>EXPIRES: {m.expiry}</span>
              </div>
            )}
          </MantineCard>
        ))}
      </div>

      {/* Add Payment Modal */}
      <MantineModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Saved Payment Method"
      >
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <button
            type="button"
            onClick={() => setMethodType('UPI')}
            style={{
              flex: 1,
              padding: '0.65rem',
              borderRadius: '6px',
              border: methodType === 'UPI' ? '2px solid var(--mantine-primary)' : '1px solid #dee2e6',
              background: methodType === 'UPI' ? 'var(--mantine-primary-light)' : '#f8f9fa',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            📱 UPI Virtual ID
          </button>
          <button
            type="button"
            onClick={() => setMethodType('CARD')}
            style={{
              flex: 1,
              padding: '0.65rem',
              borderRadius: '6px',
              border: methodType === 'CARD' ? '2px solid var(--mantine-primary)' : '1px solid #dee2e6',
              background: methodType === 'CARD' ? 'var(--mantine-primary-light)' : '#f8f9fa',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            💳 Debit / Credit Card
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{ padding: '0.65rem', backgroundColor: '#fff5f5', color: '#e03131', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem', border: '1px solid #ffc9c9' }}>
              ⚠️ {error}
            </div>
          )}

          {methodType === 'UPI' ? (
            <>
              <MantineTextInput
                label="UPI Identifier (VPA)"
                required
                value={formData.upiId}
                onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                placeholder="e.g. mobile@okhdfcbank"
              />
              <MantineTextInput
                label="Label / Nickname"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Personal SBI UPI"
              />
            </>
          ) : (
            <>
              <MantineTextInput
                label="Cardholder Name"
                required
                value={formData.cardHolder}
                onChange={(e) => setFormData({ ...formData, cardHolder: e.target.value })}
                placeholder="Full name printed on card"
              />
              <MantineTextInput
                label="Card Number"
                required
                value={formData.cardNumber}
                onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                placeholder="16 digits card number"
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <MantineTextInput
                  label="Expiry (MM/YY)"
                  value={formData.expiry}
                  onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                  placeholder="08/28"
                />
                <MantineSelect
                  label="Issuing Bank"
                  value={formData.bank}
                  onChange={(e) => setFormData({ ...formData, bank: e.target.value })}
                  options={['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Kotak Bank']}
                />
              </div>
            </>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <MantineButton variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </MantineButton>
            <MantineButton variant="orange" size="sm" type="submit">
              Save Method
            </MantineButton>
          </div>
        </form>
      </MantineModal>
    </div>
  );
}
