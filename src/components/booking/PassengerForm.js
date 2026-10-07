import React, { useState } from 'react';
import { MantineCard } from '../common/MantineCard';
import { MantineButton } from '../common/MantineButton';
import { MantineTextInput, MantineSelect } from '../common/MantineInput';
import { storageService } from '../../services/storage';

export function PassengerForm({ train, selectedClass, searchParams, onProceedToPayment, onBack }) {
  const masterList = storageService.getMasterList();

  const [passengers, setPassengers] = useState([
    {
      id: 'p_1',
      name: '',
      age: '',
      gender: 'Male',
      berth: 'No Preference',
      senior: false
    }
  ]);
  const [error, setError] = useState('');

  const BERTH_OPTIONS = [
    'No Preference',
    'Lower Berth',
    'Middle Berth',
    'Upper Berth',
    'Side Lower',
    'Side Upper',
    'Window Seat'
  ];

  const GENDER_OPTIONS = ['Male', 'Female', 'Transgender'];

  const handlePassengerChange = (index, field, value) => {
    const updated = [...passengers];
    updated[index][field] = value;

    // Auto calculate senior citizen
    if (field === 'age') {
      const numAge = parseInt(value, 10);
      if (!isNaN(numAge) && numAge >= 60) {
        updated[index].senior = true;
      }
    }

    setPassengers(updated);
    setError('');
  };

  const handleAddPassenger = () => {
    if (passengers.length >= 6) {
      setError('Maximum 6 passengers allowed per booking');
      return;
    }
    setPassengers([
      ...passengers,
      {
        id: 'p_' + (passengers.length + 1),
        name: '',
        age: '',
        gender: 'Male',
        berth: 'No Preference',
        senior: false
      }
    ]);
  };

  const handleRemovePassenger = (index) => {
    if (passengers.length === 1) {
      setError('At least one passenger is required');
      return;
    }
    setPassengers(passengers.filter((_, i) => i !== index));
  };

  const handleImportFromMaster = (masterItem) => {
    // Check if already in list
    if (passengers.some((p) => p.name.toLowerCase() === masterItem.name.toLowerCase())) {
      setError(`${masterItem.name} is already added in the passenger list.`);
      return;
    }

    // Replace first empty passenger or append
    const firstEmptyIndex = passengers.findIndex((p) => !p.name.trim());
    if (firstEmptyIndex >= 0) {
      const updated = [...passengers];
      updated[firstEmptyIndex] = {
        ...updated[firstEmptyIndex],
        name: masterItem.name,
        age: masterItem.age,
        gender: masterItem.gender,
        berth: masterItem.berth || 'No Preference',
        senior: masterItem.senior || masterItem.age >= 60
      };
      setPassengers(updated);
    } else {
      if (passengers.length >= 6) {
        setError('Maximum 6 passengers allowed per booking');
        return;
      }
      setPassengers([
        ...passengers,
        {
          id: 'p_' + Date.now(),
          name: masterItem.name,
          age: masterItem.age,
          gender: masterItem.gender,
          berth: masterItem.berth || 'No Preference',
          senior: masterItem.senior || masterItem.age >= 60
        }
      ]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate
    for (let i = 0; i < passengers.length; i++) {
      const p = passengers[i];
      if (!p.name.trim()) {
        setError(`Please enter passenger name for Passenger #${i + 1}`);
        return;
      }
      const ageNum = parseInt(p.age, 10);
      if (!p.age || isNaN(ageNum) || ageNum <= 0 || ageNum > 120) {
        setError(`Please enter a valid age (1-120) for ${p.name || `Passenger #${i + 1}`}`);
        return;
      }
    }

    const farePerPerson = train.classes[selectedClass]?.fare || 500;
    const baseFare = farePerPerson * passengers.length;
    const irctcFee = 35.4;
    const gst = Math.round(baseFare * 0.05);
    const totalAmount = baseFare + irctcFee + gst;

    onProceedToPayment({
      passengers,
      farePerPerson,
      baseFare,
      irctcFee,
      gst,
      totalAmount
    });
  };

  const farePerPerson = train.classes[selectedClass]?.fare || 500;
  const currentTotal = farePerPerson * passengers.length;

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', marginBottom: '3rem' }}>
      {/* Journey Summary Bar */}
      <MantineCard style={{ marginBottom: '1.5rem', background: '#e7f5ff', border: '1px solid #a5d8ff' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#1864ab', fontWeight: 700, textTransform: 'uppercase' }}>
              Journey Details
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--irctc-navy)' }}>
              {train.name} (#{train.id})
            </div>
            <div style={{ fontSize: '0.85rem', color: '#495057' }}>
              {train.source} ➔ {train.destination} | Date: <strong>{searchParams.date}</strong> | Class: <strong>{selectedClass}</strong> | Quota: <strong>{searchParams.quota}</strong>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.8rem', color: '#495057' }}>Class Fare</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--irctc-orange)' }}>
              ₹{farePerPerson} <span style={{ fontSize: '0.8rem', fontWeight: 400, color: '#6c757d' }}>/ person</span>
            </div>
          </div>
        </div>
      </MantineCard>

      {/* Master List Quick Import */}
      {masterList.length > 0 && (
        <MantineCard style={{ marginBottom: '1.5rem', background: '#fff' }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--irctc-navy)', marginBottom: '0.5rem' }}>
            ⚡ Quick-Add from Saved Master List
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {masterList.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => handleImportFromMaster(m)}
                style={{
                  background: '#f8f9fa',
                  border: '1px solid #ced4da',
                  padding: '0.4rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.15s ease'
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = '#e7f5ff')}
                onMouseOut={(e) => (e.currentTarget.style.background = '#f8f9fa')}
              >
                <span>➕ {m.name}</span>
                <span style={{ color: '#868e96', fontSize: '0.75rem' }}>({m.age}y, {m.gender})</span>
              </button>
            ))}
          </div>
        </MantineCard>
      )}

      {/* Passengers Form */}
      <form onSubmit={handleSubmit}>
        <MantineCard style={{ background: '#fff', border: '1px solid #ced4da', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #f1f3f5', paddingBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--irctc-navy)', margin: 0 }}>
              Passenger Details
            </h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--mantine-color-gray-6)' }}>
              Total: {passengers.length} / 6
            </span>
          </div>

          {error && (
            <div style={{ padding: '0.75rem', backgroundColor: '#fff5f5', color: '#e03131', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1.25rem', border: '1px solid #ffc9c9' }}>
              ⚠️ {error}
            </div>
          )}

          {passengers.map((passenger, idx) => (
            <div
              key={passenger.id || idx}
              style={{
                background: '#f8f9fa',
                border: '1px solid #e9ecef',
                borderRadius: '8px',
                padding: '1.25rem',
                marginBottom: '1rem',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--irctc-navy)' }}>
                  Passenger #{idx + 1}
                </span>
                {passengers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemovePassenger(idx)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#fa5252',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: 600
                    }}
                  >
                    ✕ Remove
                  </button>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem' }}>
                <MantineTextInput
                  label="Full Name"
                  required
                  value={passenger.name}
                  onChange={(e) => handlePassengerChange(idx, 'name', e.target.value)}
                  placeholder="As per Government ID"
                  style={{ marginBottom: 0 }}
                />

                <MantineTextInput
                  label="Age"
                  required
                  type="number"
                  value={passenger.age}
                  onChange={(e) => handlePassengerChange(idx, 'age', e.target.value)}
                  placeholder="Age in years"
                  style={{ marginBottom: 0 }}
                />

                <MantineSelect
                  label="Gender"
                  value={passenger.gender}
                  onChange={(e) => handlePassengerChange(idx, 'gender', e.target.value)}
                  options={GENDER_OPTIONS}
                  style={{ marginBottom: 0 }}
                />

                <MantineSelect
                  label="Berth Preference"
                  value={passenger.berth}
                  onChange={(e) => handlePassengerChange(idx, 'berth', e.target.value)}
                  options={BERTH_OPTIONS}
                  style={{ marginBottom: 0 }}
                />
              </div>

              <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  id={`senior_${idx}`}
                  checked={passenger.senior}
                  onChange={(e) => handlePassengerChange(idx, 'senior', e.target.checked)}
                />
                <label htmlFor={`senior_${idx}`} style={{ fontSize: '0.8rem', color: '#495057', cursor: 'pointer' }}>
                  Senior Citizen Concession / Lower Berth Quota (Age 60+)
                </label>
              </div>
            </div>
          ))}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
            <MantineButton
              type="button"
              variant="light"
              size="sm"
              onClick={handleAddPassenger}
              disabled={passengers.length >= 6}
            >
              ➕ Add Another Passenger
            </MantineButton>

            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--irctc-navy)' }}>
              Subtotal: ₹{currentTotal}
            </div>
          </div>
        </MantineCard>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <MantineButton type="button" variant="outline" onClick={onBack}>
            ← Back to Train List
          </MantineButton>
          <MantineButton type="submit" variant="orange" size="lg">
            Proceed to Payment (₹{currentTotal}) →
          </MantineButton>
        </div>
      </form>
    </div>
  );
}
