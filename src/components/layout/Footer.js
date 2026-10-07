import React from 'react';

export function Footer() {
  return (
    <footer style={{ background: 'var(--irctc-navy)', color: '#ced4da', borderTop: '4px solid var(--irctc-orange)', padding: '2.5rem 1.5rem 1.5rem 1.5rem', marginTop: 'auto' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{ background: 'var(--irctc-orange)', color: '#fff', fontWeight: 900, padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.9rem' }}>
              IRCTC
            </span>
            <span style={{ fontWeight: 800, fontSize: '1rem', color: '#fff' }}>
              INDIAN RAILWAYS
            </span>
          </div>
          <p style={{ fontSize: '0.8rem', lineHeight: 1.6, color: '#adb5bd' }}>
            Official IRCTC Train Ticket Reservation Simulation Portal with instant PNR generation, master passenger management, and simulated payment gateway.
          </p>
        </div>

        <div>
          <h4 style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 700, marginBottom: '0.75rem', textTransform: 'uppercase' }}>
            Features Included
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.8rem', lineHeight: 2 }}>
            <li>✔ User Signup & Login</li>
            <li>✔ Train Search (Source, Dest, Date)</li>
            <li>✔ Class & Quota Availability Check</li>
            <li>✔ Passenger Master List Management</li>
            <li>✔ Debit/Credit/UPI Saved Methods</li>
          </ul>
        </div>

        <div>
          <h4 style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 700, marginBottom: '0.75rem', textTransform: 'uppercase' }}>
            Booking Simulation
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.8rem', lineHeight: 2 }}>
            <li>✔ Multi-Passenger Ticket Booking</li>
            <li>✔ Simulated Payment Gateway (UPI/Card)</li>
            <li>✔ Instant Confirmation & E-Ticket Slip</li>
            <li>✔ Ticket Cancellation with 85% Refund</li>
            <li>✔ Admin Train Route Management</li>
          </ul>
        </div>

        <div>
          <h4 style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 700, marginBottom: '0.75rem', textTransform: 'uppercase' }}>
            Data Storage
          </h4>
          <p style={{ fontSize: '0.8rem', color: '#adb5bd', lineHeight: 1.6 }}>
            All operations, registered users, master lists, trains, and bookings are persisted directly in client-side <code>localStorage</code>.
          </p>
          <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#0ca678', fontWeight: 700 }}>
            ● System Operational
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.25rem', textAlign: 'center', fontSize: '0.75rem', color: '#868e96' }}>
        Copyright © {new Date().getFullYear()} - IRCTC Booking Simulation &bull; Designed with Mantine Component Aesthetics
      </div>
    </footer>
  );
}
