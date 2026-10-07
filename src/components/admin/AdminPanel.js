import React, { useState, useEffect } from 'react';
import { MantineCard } from '../common/MantineCard';
import { MantineButton } from '../common/MantineButton';
import { MantineBadge } from '../common/MantineBadge';
import { MantineModal } from '../common/MantineModal';
import { MantineTextInput, MantineSelect } from '../common/MantineInput';
import { storageService } from '../../services/storage';

export function AdminPanel({ showToast }) {
  const [trains, setTrains] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    source: 'NDLS (New Delhi)',
    destination: 'MMCT (Mumbai Central)',
    departure: '12:00',
    arrival: '22:00',
    duration: '10h 00m',
    fare1A: '4500',
    seats1A: '18',
    fare2A: '2800',
    seats2A: '46',
    fare3A: '1900',
    seats3A: '110',
    fareSL: '650',
    seatsSL: '240'
  });
  const [error, setError] = useState('');

  const POPULAR_STATIONS = [
    'NDLS (New Delhi)',
    'MMCT (Mumbai Central)',
    'HWH (Howrah Jn)',
    'MAS (Chennai Central)',
    'SBC (Bengaluru City)',
    'BSB (Varanasi Jn)',
    'LJN (Lucknow Jn)',
    'TVC (Thiruvananthapuram)',
    'PUNE (Pune Jn)',
    'ADI (Ahmedabad Jn)'
  ];

  useEffect(() => {
    setTrains(storageService.getTrains());
  }, []);

  const handleOpenAdd = () => {
    setError('');
    setFormData({
      id: '',
      name: '',
      source: 'NDLS (New Delhi)',
      destination: 'MMCT (Mumbai Central)',
      departure: '12:00',
      arrival: '22:00',
      duration: '10h 00m',
      fare1A: '4500',
      seats1A: '18',
      fare2A: '2800',
      seats2A: '46',
      fare3A: '1900',
      seats3A: '110',
      fareSL: '650',
      seatsSL: '240'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.id.trim() || !formData.name.trim()) {
      const err = 'Train Number and Train Name are required.';
      setError(err);
      if (showToast) showToast('error', 'Validation Error', err);
      return;
    }

    if (trains.some(t => t.id === formData.id.trim())) {
      const err = `Train #${formData.id.trim()} already exists in the system.`;
      setError(err);
      if (showToast) showToast('error', 'Duplicate Train', err);
      return;
    }

    const newTrain = {
      id: formData.id.trim(),
      name: formData.name.trim(),
      source: formData.source,
      destination: formData.destination,
      departure: formData.departure,
      arrival: formData.arrival,
      duration: formData.duration || '12h 00m',
      runsOn: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      classes: {
        '1A': { fare: parseInt(formData.fare1A, 10) || 4000, available: parseInt(formData.seats1A, 10) || 12, status: 'AVAILABLE' },
        '2A': { fare: parseInt(formData.fare2A, 10) || 2500, available: parseInt(formData.seats2A, 10) || 30, status: 'AVAILABLE' },
        '3A': { fare: parseInt(formData.fare3A, 10) || 1800, available: parseInt(formData.seats3A, 10) || 80, status: 'AVAILABLE' },
        'SL': { fare: parseInt(formData.fareSL, 10) || 600, available: parseInt(formData.seatsSL, 10) || 150, status: 'AVAILABLE' }
      }
    };

    const updated = storageService.addTrain(newTrain);
    setTrains(updated);
    setIsModalOpen(false);

    if (showToast) {
      showToast(
        'success',
        'Train Route Added Successfully!',
        `Train #${newTrain.id} (${newTrain.name}) has been scheduled and is immediately searchable for bookings.`
      );
    }
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', marginBottom: '3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--irctc-navy)', margin: 0 }}>
              Train Route Operations & Management
            </h2>
            <MantineBadge color="yellow">ADMIN CONSOLE</MantineBadge>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#6c757d', margin: '0.2rem 0 0 0' }}>
            Add new train routes, configure travel classes, schedules, and live seat quotas
          </p>
        </div>

        <MantineButton variant="orange" size="md" onClick={handleOpenAdd} icon="➕">
          Add Train Route
        </MantineButton>
      </div>

      {/* Train Routes Table */}
      <MantineCard style={{ background: '#fff', border: '1px solid #ced4da', padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1rem', borderBottom: '1px solid #e9ecef', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--irctc-navy)' }}>
            Configured Trains ({trains.length} Routes Live)
          </h4>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #dee2e6', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem 1rem', color: '#495057' }}>Train #</th>
                <th style={{ padding: '0.75rem 1rem', color: '#495057' }}>Train Name</th>
                <th style={{ padding: '0.75rem 1rem', color: '#495057' }}>Source ➔ Destination</th>
                <th style={{ padding: '0.75rem 1rem', color: '#495057' }}>Timings</th>
                <th style={{ padding: '0.75rem 1rem', color: '#495057' }}>Classes & Fares</th>
                <th style={{ padding: '0.75rem 1rem', color: '#495057' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {trains.map((t) => (
                <tr key={t.id} style={{ borderBottom: '1px solid #f1f3f5' }}>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 800, color: 'var(--irctc-navy)' }}>
                    #{t.id}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{t.name}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    {t.source} ➔ {t.destination}
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    {t.departure} - {t.arrival} ({t.duration})
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {Object.keys(t.classes).map((cls) => (
                        <span key={cls} style={{ background: '#e7f5ff', color: '#1971c2', padding: '0.15rem 0.4rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                          {cls}: ₹{t.classes[cls].fare} ({t.classes[cls].available} seats)
                        </span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <MantineBadge color="green">OPERATIONAL</MantineBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </MantineCard>

      {/* Modal to Add New Train Route */}
      <MantineModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Train Route (Admin)"
        maxWidth="640px"
      >
        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{ padding: '0.65rem', backgroundColor: '#fff5f5', color: '#e03131', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem', border: '1px solid #ffc9c9' }}>
              ⚠️ {error}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.75rem' }}>
            <MantineTextInput
              label="Train Number"
              required
              placeholder="e.g. 12953"
              value={formData.id}
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
            />
            <MantineTextInput
              label="Train Name"
              required
              placeholder="e.g. August Kranti Rajdhani Express"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <MantineSelect
              label="Source Station"
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              options={POPULAR_STATIONS}
            />
            <MantineSelect
              label="Destination Station"
              value={formData.destination}
              onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              options={POPULAR_STATIONS}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
            <MantineTextInput
              label="Departure Time"
              placeholder="17:05"
              value={formData.departure}
              onChange={(e) => setFormData({ ...formData, departure: e.target.value })}
            />
            <MantineTextInput
              label="Arrival Time"
              placeholder="10:05"
              value={formData.arrival}
              onChange={(e) => setFormData({ ...formData, arrival: e.target.value })}
            />
            <MantineTextInput
              label="Duration"
              placeholder="17h 00m"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            />
          </div>

          <div style={{ marginTop: '0.5rem', marginBottom: '1rem', padding: '0.75rem', background: '#f8f9fa', borderRadius: '6px', border: '1px solid #dee2e6' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--irctc-navy)', marginBottom: '0.5rem' }}>
              Classes, Fares (₹) & Seats
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0.5rem' }}>
              <MantineTextInput
                label="1A Fare"
                value={formData.fare1A}
                onChange={(e) => setFormData({ ...formData, fare1A: e.target.value })}
                style={{ marginBottom: 0 }}
              />
              <MantineTextInput
                label="2A Fare"
                value={formData.fare2A}
                onChange={(e) => setFormData({ ...formData, fare2A: e.target.value })}
                style={{ marginBottom: 0 }}
              />
              <MantineTextInput
                label="3A Fare"
                value={formData.fare3A}
                onChange={(e) => setFormData({ ...formData, fare3A: e.target.value })}
                style={{ marginBottom: 0 }}
              />
              <MantineTextInput
                label="SL Fare"
                value={formData.fareSL}
                onChange={(e) => setFormData({ ...formData, fareSL: e.target.value })}
                style={{ marginBottom: 0 }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <MantineButton variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </MantineButton>
            <MantineButton variant="orange" size="sm" type="submit">
              Save Train Route
            </MantineButton>
          </div>
        </form>
      </MantineModal>
    </div>
  );
}
