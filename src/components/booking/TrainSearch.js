import React, { useState } from 'react';
import { MantineCard } from '../common/MantineCard';
import { MantineButton } from '../common/MantineButton';
import { MantineSelect } from '../common/MantineInput';

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

const QUOTAS = [
  { label: 'GENERAL (GN)', value: 'GENERAL' },
  { label: 'TATKAL (TQ)', value: 'TATKAL' },
  { label: 'LADIES (LD)', value: 'LADIES' },
  { label: 'LOWER BERTH/SR. CITIZEN (SS)', value: 'SENIOR' },
  { label: 'PREMIUM TATKAL (PT)', value: 'PREMIUM_TATKAL' }
];

const CLASSES = [
  { label: 'All Classes', value: 'ALL' },
  { label: 'Anubhuti Class (EA)', value: 'EA' },
  { label: 'AC First Class (1A)', value: '1A' },
  { label: 'AC 2 Tier (2A)', value: '2A' },
  { label: 'AC 3 Tier (3A)', value: '3A' },
  { label: 'AC Chair Car (CC)', value: 'CC' },
  { label: 'Sleeper (SL)', value: 'SL' },
  { label: 'Second Sitting (2S)', value: '2S' }
];

export function TrainSearch({ onSearch, currentSearchParams }) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];

  const [searchParams, setSearchParams] = useState(
    currentSearchParams || {
      source: 'NDLS (New Delhi)',
      destination: 'MMCT (Mumbai Central)',
      date: defaultDateStr,
      quota: 'GENERAL',
      trainClass: 'ALL'
    }
  );

  const handleSwap = () => {
    setSearchParams((prev) => ({
      ...prev,
      source: prev.destination,
      destination: prev.source
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchParams);
  };

  return (
    <MantineCard
      style={{
        background: '#ffffff',
        border: '1px solid #ced4da',
        boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
        marginBottom: '2rem'
      }}
    >
      <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f3f5', paddingBottom: '0.75rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--irctc-navy)', margin: 0 }}>
            BOOK TICKET
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--mantine-color-gray-6)', margin: '0.2rem 0 0 0' }}>
            Search Indian Railways trains, verify live availability & book instantly
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', background: '#e7f5ff', color: '#1971c2', padding: '0.25rem 0.6rem', borderRadius: '4px', fontWeight: 600 }}>
            IRCTC e-Ticketing v2.0
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem', alignItems: 'flex-end' }}>
          {/* From Station */}
          <div className="m-input-group" style={{ marginBottom: 0 }}>
            <label className="m-label">From Station *</label>
            <select
              className="m-select"
              value={searchParams.source}
              onChange={(e) => setSearchParams({ ...searchParams, source: e.target.value })}
            >
              {POPULAR_STATIONS.map((st) => (
                <option key={'from_' + st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.25rem' }}>
            <button
              type="button"
              onClick={handleSwap}
              title="Swap From and To stations"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: '1px solid #ced4da',
                background: '#f8f9fa',
                cursor: 'pointer',
                fontSize: '1.1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = '#e9ecef')}
              onMouseOut={(e) => (e.currentTarget.style.background = '#f8f9fa')}
            >
              ⇄
            </button>
          </div>

          {/* To Station */}
          <div className="m-input-group" style={{ marginBottom: 0 }}>
            <label className="m-label">To Station *</label>
            <select
              className="m-select"
              value={searchParams.destination}
              onChange={(e) => setSearchParams({ ...searchParams, destination: e.target.value })}
            >
              {POPULAR_STATIONS.map((st) => (
                <option key={'to_' + st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Travel Date */}
          <div className="m-input-group" style={{ marginBottom: 0 }}>
            <label className="m-label">Journey Date *</label>
            <input
              type="date"
              className="m-input"
              value={searchParams.date}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setSearchParams({ ...searchParams, date: e.target.value })}
            />
          </div>

          {/* Quota */}
          <MantineSelect
            label="Quota"
            value={searchParams.quota}
            onChange={(e) => setSearchParams({ ...searchParams, quota: e.target.value })}
            options={QUOTAS}
            style={{ marginBottom: 0 }}
          />

          {/* Class Filter */}
          <MantineSelect
            label="Classes"
            value={searchParams.trainClass}
            onChange={(e) => setSearchParams({ ...searchParams, trainClass: e.target.value })}
            options={CLASSES}
            style={{ marginBottom: 0 }}
          />
        </div>

        <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <MantineButton type="submit" variant="orange" size="lg" icon="🔍">
            Search Trains
          </MantineButton>
        </div>
      </form>
    </MantineCard>
  );
}
