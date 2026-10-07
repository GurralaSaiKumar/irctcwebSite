import React, { useState } from 'react';
import { MantineCard } from '../common/MantineCard';
import { MantineBadge } from '../common/MantineBadge';
import { MantineButton } from '../common/MantineButton';

export function TrainList({ trains, searchParams, onSelectTrainClass }) {
  const [selectedClassPerTrain, setSelectedClassPerTrain] = useState({});

  if (!trains || trains.length === 0) {
    return (
      <MantineCard style={{ textAlign: 'center', padding: '3rem 1.5rem', background: '#fff' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚆</div>
        <h3 style={{ fontSize: '1.25rem', color: 'var(--mantine-color-gray-8)', marginBottom: '0.5rem' }}>
          No Direct Trains Found
        </h3>
        <p style={{ color: 'var(--mantine-color-gray-6)', fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto 1.5rem auto' }}>
          We could not find scheduled runs between {searchParams.source} and {searchParams.destination}. Try searching for NDLS (New Delhi) to MMCT (Mumbai Central) or HWH (Howrah).
        </p>
      </MantineCard>
    );
  }

  const handleClassClick = (trainId, classKey) => {
    setSelectedClassPerTrain(prev => ({ ...prev, [trainId]: classKey }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--mantine-color-gray-8)', margin: 0 }}>
          {trains.length} Trains Available | {searchParams.source.split(' ')[0]} ➔ {searchParams.destination.split(' ')[0]} ({searchParams.date})
        </h3>
        <MantineBadge color="blue">Quota: {searchParams.quota}</MantineBadge>
      </div>

      {trains.map((train) => {
        const availableClasses = Object.keys(train.classes);
        const activeClass = selectedClassPerTrain[train.id] || availableClasses[0];
        const classDetails = train.classes[activeClass];

        // Status badge color
        let badgeColor = 'green';
        let statusText = `AVAILABLE - ${classDetails?.available || 0}`;
        if (!classDetails || classDetails.available === 0) {
          if (classDetails?.status?.includes('RAC')) {
            badgeColor = 'yellow';
            statusText = classDetails.status;
          } else {
            badgeColor = 'red';
            statusText = classDetails?.status || 'WL 35';
          }
        }

        return (
          <MantineCard key={train.id} style={{ border: '1px solid #ced4da', background: '#fff' }}>
            {/* Train Header */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #f1f3f5', paddingBottom: '0.75rem', marginBottom: '1rem', gap: '0.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--irctc-navy)' }}>
                    {train.name}
                  </span>
                  <span style={{ background: '#e9ecef', color: '#495057', fontSize: '0.8rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                    #{train.id}
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--mantine-color-gray-6)', marginTop: '0.25rem' }}>
                  Runs On: {train.runsOn.map((d, i) => (
                    <span key={i} style={{ marginRight: '0.35rem', fontWeight: 600, color: '#1971c2' }}>{d}</span>
                  ))}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--mantine-color-gray-6)' }}>Starting Fare</span>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--irctc-orange)' }}>
                  ₹{classDetails?.fare || 500}
                </div>
              </div>
            </div>

            {/* Timing bar */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem', padding: '0.5rem 0' }}>
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--mantine-color-gray-9)' }}>
                  {train.departure}
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--mantine-color-gray-7)' }}>
                  {train.source}
                </div>
              </div>

              <div style={{ textAlign: 'center', minWidth: '120px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--mantine-color-gray-6)', fontWeight: 600 }}>
                  {train.duration}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', margin: '0.2rem 0' }}>
                  <div style={{ height: '2px', background: '#adb5bd', width: '35%' }}></div>
                  <span style={{ fontSize: '0.9rem' }}>🚆</span>
                  <div style={{ height: '2px', background: '#adb5bd', width: '35%' }}></div>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#0ca678', fontWeight: 600 }}>Daily Superfast</div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--mantine-color-gray-9)' }}>
                  {train.arrival}
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--mantine-color-gray-7)' }}>
                  {train.destination}
                </div>
              </div>
            </div>

            {/* Class Cards List */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--mantine-color-gray-6)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                Select Travel Class:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                {availableClasses.map((clsKey) => {
                  const info = train.classes[clsKey];
                  const isSelected = activeClass === clsKey;
                  const isAvail = info.available > 0;

                  return (
                    <div
                      key={clsKey}
                      onClick={() => handleClassClick(train.id, clsKey)}
                      style={{
                        flex: '1 1 120px',
                        maxWidth: '180px',
                        padding: '0.75rem',
                        borderRadius: '6px',
                        border: isSelected ? '2px solid var(--mantine-primary)' : '1px solid #ced4da',
                        background: isSelected ? 'var(--mantine-primary-light)' : '#ffffff',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--mantine-color-gray-9)' }}>
                          {clsKey}
                        </span>
                        <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--irctc-orange)' }}>
                          ₹{info.fare}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: isAvail ? '#0ca678' : '#e03131' }}>
                        {isAvail ? `AVL: ${info.available}` : (info.status || 'WL')}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Bar */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', background: '#f8f9fa', padding: '0.75rem 1rem', borderRadius: '6px', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--mantine-color-gray-7)' }}>
                  Selected: <strong>{activeClass}</strong> Class
                </span>
                <MantineBadge color={badgeColor}>{statusText}</MantineBadge>
              </div>

              <MantineButton
                variant="orange"
                size="md"
                onClick={() => onSelectTrainClass(train, activeClass, classDetails)}
              >
                Book Now ({activeClass} - ₹{classDetails?.fare})
              </MantineButton>
            </div>
          </MantineCard>
        );
      })}
    </div>
  );
}
