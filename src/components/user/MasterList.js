import React, { useState, useEffect } from 'react';
import { MantineCard } from '../common/MantineCard';
import { MantineButton } from '../common/MantineButton';
import { MantineBadge } from '../common/MantineBadge';
import { MantineModal } from '../common/MantineModal';
import { MantineTextInput, MantineSelect } from '../common/MantineInput';
import { storageService } from '../../services/storage';

export function MasterList({ showToast }) {
  const [masterPassengers, setMasterPassengers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    berth: 'Lower',
    senior: false
  });
  const [error, setError] = useState('');

  const BERTH_OPTIONS = ['Lower', 'Middle', 'Upper', 'Side Lower', 'Side Upper', 'Window Seat'];
  const GENDER_OPTIONS = ['Male', 'Female', 'Transgender'];

  useEffect(() => {
    setMasterPassengers(storageService.getMasterList());
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      name: '',
      age: '',
      gender: 'Male',
      berth: 'Lower',
      senior: false
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setEditingId(p.id);
    setFormData({
      name: p.name,
      age: p.age,
      gender: p.gender,
      berth: p.berth || 'Lower',
      senior: p.senior || p.age >= 60
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    const updated = storageService.deleteMasterPassenger(id);
    setMasterPassengers(updated);
    if (showToast) showToast('info', 'Passenger Removed', 'Passenger removed from your master list.');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Passenger name is required');
      if (showToast) showToast('error', 'Validation Error', 'Passenger name is required');
      return;
    }
    const ageNum = parseInt(formData.age, 10);
    if (!formData.age || isNaN(ageNum) || ageNum <= 0 || ageNum > 120) {
      setError('Please provide a valid age');
      if (showToast) showToast('error', 'Validation Error', 'Please enter a valid age (1-120)');
      return;
    }

    const payload = {
      ...formData,
      id: editingId,
      senior: formData.senior || ageNum >= 60
    };

    const updated = storageService.saveMasterPassenger(payload);
    setMasterPassengers(updated);
    setIsModalOpen(false);
    if (showToast) {
      showToast(
        'success',
        editingId ? 'Passenger Updated' : 'Passenger Added to Master List',
        `${payload.name} saved for 1-click booking import.`
      );
    }
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', marginBottom: '3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--irctc-navy)', margin: 0 }}>
            IRCTC Passenger Master List
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--mantine-color-gray-6)', margin: '0.2rem 0 0 0' }}>
            Store frequent co-travelers to auto-fill details during quick Tatkal and General ticket booking
          </p>
        </div>
        <MantineButton variant="orange" size="sm" onClick={handleOpenAdd} icon="➕">
          Add Master Passenger
        </MantineButton>
      </div>

      <MantineCard style={{ background: '#fff', border: '1px solid #ced4da', padding: 0, overflow: 'hidden' }}>
        {masterPassengers.length === 0 ? (
          <div style={{ padding: '2.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>👥</div>
            <p style={{ color: '#868e96', fontSize: '0.9rem' }}>
              Your Master List is empty. Add passenger details once to book in seconds!
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #dee2e6', textAlign: 'left' }}>
                  <th style={{ padding: '0.85rem 1rem', color: '#495057' }}>#</th>
                  <th style={{ padding: '0.85rem 1rem', color: '#495057' }}>Name</th>
                  <th style={{ padding: '0.85rem 1rem', color: '#495057' }}>Age</th>
                  <th style={{ padding: '0.85rem 1rem', color: '#495057' }}>Gender</th>
                  <th style={{ padding: '0.85rem 1rem', color: '#495057' }}>Berth Preference</th>
                  <th style={{ padding: '0.85rem 1rem', color: '#495057' }}>Senior Citizen</th>
                  <th style={{ padding: '0.85rem 1rem', color: '#495057', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {masterPassengers.map((p, idx) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f1f3f5' }}>
                    <td style={{ padding: '0.85rem 1rem', color: '#868e96' }}>{idx + 1}</td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--irctc-navy)' }}>{p.name}</td>
                    <td style={{ padding: '0.85rem 1rem' }}>{p.age} yrs</td>
                    <td style={{ padding: '0.85rem 1rem' }}>{p.gender}</td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{ background: '#e7f5ff', color: '#1971c2', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>
                        {p.berth}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      {p.senior ? (
                        <MantineBadge color="yellow">SR. CITIZEN</MantineBadge>
                      ) : (
                        <span style={{ color: '#adb5bd', fontSize: '0.8rem' }}>No</span>
                      )}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        <MantineButton variant="outline" size="sm" onClick={() => handleOpenEdit(p)}>
                          Edit
                        </MantineButton>
                        <MantineButton variant="danger-light" size="sm" onClick={() => handleDelete(p.id)}>
                          Delete
                        </MantineButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </MantineCard>

      {/* Add / Edit Passenger Modal */}
      <MantineModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Master Passenger' : 'Add Passenger to Master List'}
      >
        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{ padding: '0.65rem', backgroundColor: '#fff5f5', color: '#e03131', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem', border: '1px solid #ffc9c9' }}>
              ⚠️ {error}
            </div>
          )}

          <MantineTextInput
            label="Full Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="As on Government Photo ID"
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <MantineTextInput
              label="Age"
              required
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              placeholder="e.g. 35"
            />

            <MantineSelect
              label="Gender"
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              options={GENDER_OPTIONS}
            />
          </div>

          <MantineSelect
            label="Berth Preference"
            value={formData.berth}
            onChange={(e) => setFormData({ ...formData, berth: e.target.value })}
            options={BERTH_OPTIONS}
          />

          <div style={{ margin: '0.75rem 0 1.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              id="masterSenior"
              checked={formData.senior}
              onChange={(e) => setFormData({ ...formData, senior: e.target.checked })}
            />
            <label htmlFor="masterSenior" style={{ fontSize: '0.85rem', color: '#495057', cursor: 'pointer' }}>
              Senior Citizen / Lower Berth Preference (Age 60+)
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <MantineButton variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </MantineButton>
            <MantineButton variant="orange" size="sm" type="submit">
              {editingId ? 'Save Changes' : 'Add to Master List'}
            </MantineButton>
          </div>
        </form>
      </MantineModal>
    </div>
  );
}
