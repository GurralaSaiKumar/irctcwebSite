import React, { useState, useEffect } from 'react';
import { MantineCard } from '../common/MantineCard';
import { MantineBadge } from '../common/MantineBadge';
import { MantineButton } from '../common/MantineButton';
import { MantineModal } from '../common/MantineModal';
import { storageService } from '../../services/storage';

export function MyBookings({ onBookNew, showToast }) {
  const [bookings, setBookings] = useState([]);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    setBookings(storageService.getBookings());
  }, []);

  const handleOpenCancel = (booking) => {
    setSelectedBooking(booking);
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = () => {
    if (!selectedBooking) return;
    const updated = storageService.cancelBooking(selectedBooking.pnr);
    setBookings(updated);
    if (showToast) {
      showToast(
        'success',
        'Ticket Cancelled Successfully',
        `PNR #${selectedBooking.pnr} cancelled. Refund of ₹${Math.round(selectedBooking.totalAmount * 0.85)} initiated.`
      );
    }
    setCancelModalOpen(false);
    setSelectedBooking(null);
  };

  if (bookings.length === 0) {
    return (
      <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center', padding: '3rem 1rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎫</div>
        <h3 style={{ fontSize: '1.25rem', color: 'var(--mantine-color-gray-8)', marginBottom: '0.5rem' }}>
          No Bookings Found
        </h3>
        <p style={{ color: 'var(--mantine-color-gray-6)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          You have not booked any train tickets yet. Search routes and reserve seats in just a few clicks.
        </p>
        <MantineButton variant="orange" size="lg" onClick={onBookNew} icon="🔍">
          Search & Book Trains
        </MantineButton>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', marginBottom: '3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--irctc-navy)', margin: 0 }}>
            My Booked Tickets
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--mantine-color-gray-6)', margin: '0.2rem 0 0 0' }}>
            View your upcoming journey tickets, e-reservations, and cancellation history
          </p>
        </div>
        <MantineButton variant="orange" size="sm" onClick={onBookNew}>
          + Book New Ticket
        </MantineButton>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {bookings.map((booking) => {
          const isCancelled = booking.status === 'CANCELLED';

          return (
            <MantineCard key={booking.pnr} style={{ background: '#fff', border: '1px solid #ced4da' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #f1f3f5', paddingBottom: '0.75rem', marginBottom: '1rem', gap: '0.5rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#868e96' }}>PNR:</span>
                    <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--irctc-navy)', letterSpacing: '0.5px' }}>
                      {booking.pnr}
                    </span>
                    <MantineBadge color={isCancelled ? 'red' : 'green'}>
                      {isCancelled ? 'CANCELLED' : 'CONFIRMED'}
                    </MantineBadge>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#868e96', marginTop: '0.2rem' }}>
                    Booked on {new Date(booking.bookingDate).toLocaleDateString()}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: isCancelled ? '#868e96' : 'var(--irctc-orange)' }}>
                    ₹{booking.totalAmount}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#868e96' }}>
                    {booking.passengers.length} Passenger{booking.passengers.length > 1 ? 's' : ''} | {booking.classBooked}
                  </div>
                </div>
              </div>

              {/* Journey Details */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', background: '#f8f9fa', padding: '0.85rem', borderRadius: '6px', marginBottom: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#868e96' }}>Train</span>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--irctc-navy)' }}>
                    {booking.trainNumber} - {booking.trainName}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#868e96' }}>Journey Date</span>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--irctc-navy)' }}>
                    {booking.journeyDate}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#868e96' }}>Route</span>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--irctc-navy)' }}>
                    {booking.source.split(' ')[0]} ➔ {booking.destination.split(' ')[0]}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#868e96' }}>Departure</span>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--irctc-navy)' }}>
                    {booking.departureTime}
                  </div>
                </div>
              </div>

              {/* Passenger Pills */}
              <div style={{ marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#868e96', textTransform: 'uppercase' }}>
                  Passengers:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.4rem' }}>
                  {booking.passengers.map((p, idx) => (
                    <span
                      key={idx}
                      style={{
                        background: '#e9ecef',
                        padding: '0.3rem 0.6rem',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        color: '#495057'
                      }}
                    >
                      👤 {p.name} ({p.age}y) &bull; Coach: <strong>{p.coach}-{p.seatNumber}</strong> ({p.allocatedBerth})
                    </span>
                  ))}
                </div>
              </div>

              {/* Cancellation Status or Cancel Button */}
              {isCancelled ? (
                <div style={{ background: '#fff5f5', border: '1px solid #ffc9c9', borderRadius: '6px', padding: '0.75rem', fontSize: '0.8rem', color: '#e03131' }}>
                  <strong>Ticket Cancelled.</strong> Refund of ₹{booking.refundAmount} (after ₹{booking.cancellationFee} IRCTC clerkage deduction) initiated to original payment method.
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid #f1f3f5', paddingTop: '0.75rem' }}>
                  <MantineButton
                    variant="danger-light"
                    size="sm"
                    onClick={() => handleOpenCancel(booking)}
                  >
                    Cancel Ticket & Request Refund
                  </MantineButton>
                </div>
              )}
            </MantineCard>
          );
        })}
      </div>

      {/* Cancellation Confirmation Modal */}
      <MantineModal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Confirm Ticket Cancellation"
      >
        {selectedBooking && (
          <div>
            <p style={{ fontSize: '0.9rem', color: '#495057', lineHeight: 1.5 }}>
              Are you sure you want to cancel ticket for PNR <strong>{selectedBooking.pnr}</strong> (Train: {selectedBooking.trainNumber})?
            </p>

            <div style={{ background: '#fff9db', border: '1px solid #fde68a', borderRadius: '6px', padding: '0.85rem', margin: '1rem 0', fontSize: '0.825rem' }}>
              <div style={{ fontWeight: 700, color: '#d97706', marginBottom: '0.25rem' }}>
                IRCTC Refund Policy Calculation:
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#495057' }}>
                <span>Total Ticket Price:</span>
                <span>₹{selectedBooking.totalAmount}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#e03131' }}>
                <span>Cancellation Charges (15%):</span>
                <span>- ₹{Math.round(selectedBooking.totalAmount * 0.15)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, color: '#0ca678', borderTop: '1px dashed #ced4da', paddingTop: '0.35rem', marginTop: '0.35rem' }}>
                <span>Estimated Refund Amount:</span>
                <span>₹{Math.round(selectedBooking.totalAmount * 0.85)}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
              <MantineButton variant="outline" size="sm" onClick={() => setCancelModalOpen(false)}>
                Keep Ticket
              </MantineButton>
              <MantineButton variant="danger" size="sm" onClick={handleConfirmCancel}>
                Confirm Cancellation
              </MantineButton>
            </div>
          </div>
        )}
      </MantineModal>
    </div>
  );
}
