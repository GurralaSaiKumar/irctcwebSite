import React from 'react';
import { MantineCard } from '../common/MantineCard';
import { MantineBadge } from '../common/MantineBadge';
import { MantineButton } from '../common/MantineButton';

export function BookingConfirmation({ booking, onNewBooking, onViewBookings }) {
  if (!booking) return null;

  return (
    <div style={{ maxWidth: '820px', margin: '0 auto', marginBottom: '3rem' }}>
      {/* Success banner */}
      <div style={{ background: '#e6fcf5', border: '1px solid #63e6be', borderRadius: '8px', padding: '1.25rem', marginBottom: '1.5rem', textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>🎉</div>
        <h2 style={{ fontSize: '1.35rem', color: '#0ca678', fontWeight: 800, margin: '0 0 0.25rem 0' }}>
          Booking Confirmed Successfully!
        </h2>
        <p style={{ margin: 0, fontSize: '0.85rem', color: '#2b8a3e' }}>
          Your electronic reservation slip (e-Ticket) has been issued. An SMS & email notification has been dispatched.
        </p>
      </div>

      {/* Ticket Paper */}
      <div className="ticket-container" style={{ background: '#fff' }}>
        <div className="ticket-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span style={{ background: 'var(--irctc-orange)', color: '#fff', fontWeight: 900, padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.9rem' }}>
                IRCTC
              </span>
              <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--irctc-navy)' }}>
                ELECTRONIC RESERVATION SLIP (ERS)
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#868e96' }}>
              Booked on: {new Date(booking.bookingDate).toLocaleString()}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.75rem', color: '#868e96', textTransform: 'uppercase' }}>PNR Number</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--irctc-navy)', letterSpacing: '1px' }}>
              {booking.pnr}
            </div>
            <MantineBadge color="green">CONFIRMED (CNF)</MantineBadge>
          </div>
        </div>

        {/* Train Details Block */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', background: '#f8f9fa', padding: '1rem', borderRadius: '6px', marginBottom: '1.5rem', border: '1px solid #e9ecef' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#868e96' }}>Train No. & Name</span>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--irctc-navy)' }}>
              {booking.trainNumber} - {booking.trainName}
            </div>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#868e96' }}>Date of Journey</span>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--irctc-navy)' }}>
              {booking.journeyDate}
            </div>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#868e96' }}>From ➔ To</span>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--irctc-navy)' }}>
              {booking.source} ➔ {booking.destination}
            </div>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#868e96' }}>Class & Quota</span>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--irctc-navy)' }}>
              Class: {booking.classBooked} | Quota: {booking.quota}
            </div>
          </div>
        </div>

        {/* Passenger List Table */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--irctc-navy)', marginBottom: '0.75rem' }}>
            Passenger Details & Coach Allotment
          </h4>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: '#f1f3f5', borderBottom: '2px solid #ced4da', textAlign: 'left' }}>
                <th style={{ padding: '0.5rem 0.75rem' }}>#</th>
                <th style={{ padding: '0.5rem 0.75rem' }}>Name</th>
                <th style={{ padding: '0.5rem 0.75rem' }}>Age / Gender</th>
                <th style={{ padding: '0.5rem 0.75rem' }}>Coach</th>
                <th style={{ padding: '0.5rem 0.75rem' }}>Seat No.</th>
                <th style={{ padding: '0.5rem 0.75rem' }}>Berth Type</th>
                <th style={{ padding: '0.5rem 0.75rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {booking.passengers.map((p, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #e9ecef' }}>
                  <td style={{ padding: '0.6rem 0.75rem' }}>{idx + 1}</td>
                  <td style={{ padding: '0.6rem 0.75rem', fontWeight: 700 }}>{p.name}</td>
                  <td style={{ padding: '0.6rem 0.75rem' }}>{p.age} yrs / {p.gender}</td>
                  <td style={{ padding: '0.6rem 0.75rem', fontWeight: 700, color: '#1971c2' }}>{p.coach}</td>
                  <td style={{ padding: '0.6rem 0.75rem', fontWeight: 700 }}>{p.seatNumber}</td>
                  <td style={{ padding: '0.6rem 0.75rem' }}>{p.allocatedBerth}</td>
                  <td style={{ padding: '0.6rem 0.75rem' }}>
                    <MantineBadge color="green">CNF</MantineBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Fare Summary & QR Code Simulation */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px dashed #ced4da', paddingTop: '1.25rem', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#868e96' }}>Payment Mode: {booking.paymentMethod}</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--irctc-navy)' }}>
              Total Fare Paid: <span style={{ color: 'var(--irctc-orange)' }}>₹{booking.totalAmount}</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#868e96' }}>
              (Includes GST & IRCTC Convenience Charges)
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#f8f9fa', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #e9ecef' }}>
            <div style={{ width: '48px', height: '48px', background: '#212529', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', borderRadius: '4px' }}>
              🏁
            </div>
            <div style={{ fontSize: '0.75rem', color: '#495057' }}>
              <strong>TTE Verification QR</strong>
              <div>Valid Govt ID Required</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
        <MantineButton variant="outline" onClick={() => window.print()} icon="🖨️">
          Print / Save PDF
        </MantineButton>
        <MantineButton variant="light" onClick={onViewBookings} icon="📋">
          View in My Bookings
        </MantineButton>
        <MantineButton variant="orange" onClick={onNewBooking} icon="🚆">
          Book Another Ticket
        </MantineButton>
      </div>
    </div>
  );
}
