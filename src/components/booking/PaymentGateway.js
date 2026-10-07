import React, { useState } from 'react';
import { MantineCard } from '../common/MantineCard';
import { MantineButton } from '../common/MantineButton';
import { MantineTextInput, MantineSelect } from '../common/MantineInput';
import { storageService } from '../../services/storage';

export function PaymentGateway({ bookingData, onPaymentSuccess, onBack }) {
  const { train, selectedClass, passengers, totalAmount, baseFare, irctcFee, gst, searchParams } = bookingData;
  const savedPaymentMethods = storageService.getPaymentMethods();

  const [paymentMode, setPaymentMode] = useState('UPI'); // 'SAVED' | 'UPI' | 'CARD' | 'NETBANKING'
  const [selectedSavedId, setSelectedSavedId] = useState(savedPaymentMethods[0]?.id || '');
  const [upiId, setUpiId] = useState('user@upi');
  const [cardData, setCardData] = useState({
    name: 'AARAV SHARMA',
    number: '4532 8912 3456 7890',
    expiry: '12/28',
    cvv: '891',
    saveCard: true
  });
  const [bank, setBank] = useState('State Bank of India');
  const [isProcessing, setIsProcessing] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [error, setError] = useState('');

  const BANKS = [
    'State Bank of India',
    'HDFC Bank',
    'ICICI Bank',
    'Axis Bank',
    'Punjab National Bank',
    'Bank of Baroda'
  ];

  const handlePay = (e) => {
    e.preventDefault();
    setError('');

    if (paymentMode === 'UPI' && !upiId.includes('@')) {
      setError('Please enter a valid UPI ID (e.g., name@okhdfcbank)');
      return;
    }

    if (paymentMode === 'CARD') {
      if (cardData.number.replace(/\s+/g, '').length < 16) {
        setError('Please enter a 16-digit card number');
        return;
      }
      if (!cardData.cvv || cardData.cvv.length < 3) {
        setError('Please enter a valid CVV');
        return;
      }
      if (cardData.saveCard) {
        storageService.addPaymentMethod({
          type: 'CARD',
          cardHolder: cardData.name.toUpperCase(),
          cardNumber: `•••• •••• •••• ${cardData.number.slice(-4)}`,
          expiry: cardData.expiry,
          bank: 'Visa/Mastercard'
        });
      }
    }

    // Start simulated processing
    setIsProcessing(true);
    let counter = 3;
    const interval = setInterval(() => {
      counter -= 1;
      setCountdown(counter);
      if (counter <= 0) {
        clearInterval(interval);
        // Generate simulated PNR, Coach, and seat assignments
        const pnr = Math.floor(1000000000 + Math.random() * 9000000000).toString();
        const coachPrefix = selectedClass.includes('1') ? 'H1' : selectedClass.includes('2') ? 'A1' : selectedClass.includes('3') ? 'B2' : 'S4';
        
        const confirmedPassengers = passengers.map((p, idx) => ({
          ...p,
          coach: coachPrefix,
          seatNumber: Math.floor(1 + Math.random() * 64),
          allocatedBerth: p.berth !== 'No Preference' ? p.berth : ['Lower', 'Middle', 'Upper', 'Side Lower'][idx % 4],
          status: 'CNF'
        }));

        const finalBooking = {
          pnr,
          bookingDate: new Date().toISOString(),
          trainNumber: train.id,
          trainName: train.name,
          source: train.source,
          destination: train.destination,
          journeyDate: searchParams.date,
          departureTime: train.departure,
          arrivalTime: train.arrival,
          classBooked: selectedClass,
          quota: searchParams.quota,
          passengers: confirmedPassengers,
          baseFare,
          irctcFee,
          gst,
          totalAmount,
          paymentMethod: paymentMode,
          status: 'CONFIRMED'
        };

        storageService.saveBooking(finalBooking);
        setIsProcessing(false);
        onPaymentSuccess(finalBooking);
      }
    }, 900);
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', marginBottom: '3rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* Payment Methods Column */}
        <MantineCard style={{ background: '#fff', border: '1px solid #ced4da' }}>
          <div style={{ borderBottom: '1px solid #f1f3f5', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--irctc-navy)', margin: 0 }}>
              IRCTC Simulated Payment Gateway
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#6c757d', margin: '0.2rem 0 0 0' }}>
              Select payment method to complete ticket reservation
            </p>
          </div>

          {error && (
            <div style={{ padding: '0.65rem 0.85rem', backgroundColor: '#fff5f5', color: '#e03131', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem', border: '1px solid #ffc9c9' }}>
              ⚠️ {error}
            </div>
          )}

          {/* Mode Selector Tabs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginBottom: '1.5rem' }}>
            {savedPaymentMethods.length > 0 && (
              <button
                type="button"
                onClick={() => setPaymentMode('SAVED')}
                style={{
                  padding: '0.6rem 0.2rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  borderRadius: '6px',
                  border: paymentMode === 'SAVED' ? '2px solid var(--mantine-primary)' : '1px solid #dee2e6',
                  background: paymentMode === 'SAVED' ? 'var(--mantine-primary-light)' : '#f8f9fa',
                  cursor: 'pointer'
                }}
              >
                Saved ({savedPaymentMethods.length})
              </button>
            )}

            <button
              type="button"
              onClick={() => setPaymentMode('UPI')}
              style={{
                padding: '0.6rem 0.2rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                borderRadius: '6px',
                border: paymentMode === 'UPI' ? '2px solid var(--mantine-primary)' : '1px solid #dee2e6',
                background: paymentMode === 'UPI' ? 'var(--mantine-primary-light)' : '#f8f9fa',
                cursor: 'pointer'
              }}
            >
              UPI / QR
            </button>

            <button
              type="button"
              onClick={() => setPaymentMode('CARD')}
              style={{
                padding: '0.6rem 0.2rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                borderRadius: '6px',
                border: paymentMode === 'CARD' ? '2px solid var(--mantine-primary)' : '1px solid #dee2e6',
                background: paymentMode === 'CARD' ? 'var(--mantine-primary-light)' : '#f8f9fa',
                cursor: 'pointer'
              }}
            >
              Debit/Credit
            </button>

            <button
              type="button"
              onClick={() => setPaymentMode('NETBANKING')}
              style={{
                padding: '0.6rem 0.2rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                borderRadius: '6px',
                border: paymentMode === 'NETBANKING' ? '2px solid var(--mantine-primary)' : '1px solid #dee2e6',
                background: paymentMode === 'NETBANKING' ? 'var(--mantine-primary-light)' : '#f8f9fa',
                cursor: 'pointer'
              }}
            >
              Net Banking
            </button>
          </div>

          {/* Form for SAVED */}
          {paymentMode === 'SAVED' && (
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.75rem', color: '#495057' }}>
                Choose Saved Card or UPI ID:
              </div>
              {savedPaymentMethods.map((m) => (
                <div
                  key={m.id}
                  onClick={() => setSelectedSavedId(m.id)}
                  style={{
                    padding: '0.85rem',
                    border: selectedSavedId === m.id ? '2px solid var(--mantine-primary)' : '1px solid #ced4da',
                    background: selectedSavedId === m.id ? '#e7f5ff' : '#ffffff',
                    borderRadius: '8px',
                    marginBottom: '0.75rem',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--irctc-navy)' }}>
                      {m.type === 'UPI' ? m.upiId : m.cardNumber}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#868e96' }}>
                      {m.type === 'UPI' ? m.name : `${m.cardHolder} (${m.expiry})`}
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="savedPay"
                    checked={selectedSavedId === m.id}
                    onChange={() => setSelectedSavedId(m.id)}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Form for UPI */}
          {paymentMode === 'UPI' && (
            <div>
              <MantineTextInput
                label="Virtual Payment Address (UPI ID)"
                placeholder="example@okaxis"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                helperText="Supported: Google Pay, PhonePe, Paytm, BHIM UPI"
              />
              <div style={{ background: '#f8f9fa', border: '1px dashed #adb5bd', borderRadius: '8px', padding: '1rem', textAlign: 'center', marginTop: '1rem' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📱⚡</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--irctc-navy)' }}>
                  Scan Dynamic IRCTC QR Code
                </div>
                <div style={{ fontSize: '0.75rem', color: '#868e96', marginTop: '0.25rem' }}>
                  Open any UPI app & scan to pay ₹{totalAmount} instantly
                </div>
              </div>
            </div>
          )}

          {/* Form for CARD */}
          {paymentMode === 'CARD' && (
            <div>
              <MantineTextInput
                label="Cardholder Name"
                placeholder="Name as on card"
                value={cardData.name}
                onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
              />
              <MantineTextInput
                label="Card Number"
                placeholder="16 digits card number"
                value={cardData.number}
                onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <MantineTextInput
                  label="Expiry (MM/YY)"
                  placeholder="12/28"
                  value={cardData.expiry}
                  onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                />
                <MantineTextInput
                  label="CVV"
                  placeholder="3 digits"
                  type="password"
                  maxLength={4}
                  value={cardData.cvv}
                  onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                />
              </div>
              <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  id="saveCardCheck"
                  checked={cardData.saveCard}
                  onChange={(e) => setCardData({ ...cardData, saveCard: e.target.checked })}
                />
                <label htmlFor="saveCardCheck" style={{ fontSize: '0.8rem', color: '#495057', cursor: 'pointer' }}>
                  Save this card securely in my profile for future bookings
                </label>
              </div>
            </div>
          )}

          {/* Form for NETBANKING */}
          {paymentMode === 'NETBANKING' && (
            <div>
              <MantineSelect
                label="Select Bank"
                value={bank}
                onChange={(e) => setBank(e.target.value)}
                options={BANKS}
              />
              <div style={{ fontSize: '0.8rem', color: '#868e96', marginTop: '0.5rem' }}>
                You will be redirected to {bank} secure payment gateway simulation.
              </div>
            </div>
          )}

          <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <MantineButton
              variant="orange"
              size="lg"
              fullWidth
              disabled={isProcessing}
              onClick={handlePay}
            >
              {isProcessing ? `Simulating Bank Authentication... (${countdown}s)` : `Pay ₹${totalAmount} & Confirm Ticket`}
            </MantineButton>

            <MantineButton variant="outline" size="sm" onClick={onBack} disabled={isProcessing}>
              ← Back to Passenger Form
            </MantineButton>
          </div>
        </MantineCard>

        {/* Order Fare Summary Column */}
        <MantineCard style={{ background: '#f8f9fa', border: '1px solid #dee2e6' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--irctc-navy)', marginBottom: '1rem', borderBottom: '1px solid #e9ecef', paddingBottom: '0.5rem' }}>
            Fare Breakdown
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#495057' }}>
              <span>Base Fare ({passengers.length} × ₹{bookingData.farePerPerson})</span>
              <span style={{ fontWeight: 600 }}>₹{baseFare}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#495057' }}>
              <span>IRCTC Convenience Fee</span>
              <span style={{ fontWeight: 600 }}>₹{irctcFee}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#495057' }}>
              <span>Goods & Services Tax (GST 5%)</span>
              <span style={{ fontWeight: 600 }}>₹{gst}</span>
            </div>

            <div style={{ height: '1px', background: '#ced4da', margin: '0.5rem 0' }}></div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 800, color: 'var(--irctc-navy)' }}>
              <span>Total Payable</span>
              <span style={{ color: 'var(--irctc-orange)' }}>₹{totalAmount}</span>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', padding: '0.75rem', background: '#e6fcf5', border: '1px solid #b2f2bb', borderRadius: '6px', fontSize: '0.775rem', color: '#0ca678' }}>
            🔒 256-Bit SSL Encrypted Indian Railways Simulated Payment Gateway
          </div>
        </MantineCard>
      </div>
    </div>
  );
}
