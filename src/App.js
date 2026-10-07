import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import '@mantine/core/styles.css';
import './theme/mantine.css';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Toast } from './components/common/Toast';
import { AuthPage } from './components/auth/AuthPage';
import { TrainSearch } from './components/booking/TrainSearch';
import { TrainList } from './components/booking/TrainList';
import { PassengerForm } from './components/booking/PassengerForm';
import { PaymentGateway } from './components/booking/PaymentGateway';
import { BookingConfirmation } from './components/booking/BookingConfirmation';
import { MyBookings } from './components/user/MyBookings';
import { MasterList } from './components/user/MasterList';
import { PaymentMethods } from './components/user/PaymentMethods';
import { UserProfile } from './components/user/UserProfile';
import { AdminPanel } from './components/admin/AdminPanel';
import { storageService } from './services/storage';

function App() {
  const navigate = useNavigate();

  // User State & Global Toast
  const [currentUser, setCurrentUser] = useState(null);
  const [toast, setToast] = useState(null);

  // Booking Flow State: 1: Search & List, 2: Passengers, 3: Payment, 4: Confirmed
  const [bookingStep, setBookingStep] = useState(1);
  const [searchParams, setSearchParams] = useState({
    source: 'NDLS (New Delhi)',
    destination: 'MMCT (Mumbai Central)',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    quota: 'GENERAL',
    trainClass: 'ALL'
  });
  const [filteredTrains, setFilteredTrains] = useState([]);
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [checkoutData, setCheckoutData] = useState(null);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const showToast = (type, title, message, duration = 3500) => {
    setToast({ type, title, message, duration });
  };

  // Filter trains helper
  const filterTrains = (trainsList, params) => {
    const results = trainsList.filter((t) => {
      const matchSource = t.source.toLowerCase().includes(params.source.split(' ')[0].toLowerCase());
      const matchDest = t.destination.toLowerCase().includes(params.destination.split(' ')[0].toLowerCase());
      return matchSource && matchDest;
    });
    setFilteredTrains(results.length > 0 ? results : trainsList);
  };

  // Load initial data
  useEffect(() => {
    const user = storageService.getCurrentUser();
    setCurrentUser(user);
    const trains = storageService.getTrains();
    filterTrains(trains, searchParams);
  }, []);

  const handleSearch = (newParams) => {
    setSearchParams(newParams);
    const trains = storageService.getTrains();
    filterTrains(trains, newParams);
  };

  const handleSelectTrainClass = (train, trainClass) => {
    setSelectedTrain(train);
    setSelectedClass(trainClass);
    setBookingStep(2); // Go to Passenger Details
  };

  const handleProceedToPayment = (passengerPayload) => {
    setCheckoutData({
      train: selectedTrain,
      selectedClass,
      searchParams,
      ...passengerPayload
    });
    setBookingStep(3); // Go to Payment
  };

  const handlePaymentSuccess = (finalBooking) => {
    setConfirmedBooking(finalBooking);
    setBookingStep(4); // Go to Confirmation
    showToast(
      'success',
      'Booking Confirmed!',
      `e-Ticket issued for PNR #${finalBooking.pnr}. Coach & berths allocated.`
    );
  };

  const handleResetBooking = () => {
    setBookingStep(1);
    setSelectedTrain(null);
    setSelectedClass(null);
    setCheckoutData(null);
    setConfirmedBooking(null);
  };

  const handleLogout = () => {
    storageService.logout();
    setCurrentUser(null);
    handleResetBooking();
    showToast('info', 'Logged Out', 'You have been safely signed out of your session.');
    navigate('/');
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    showToast(
      'success',
      'Authentication Successful',
      `Welcome to IRCTC, ${user.name}!`
    );
    navigate('/book');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f6f8fa' }}>
      {/* Global Animated Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Routed Container */}
      <main style={{ flex: 1, maxWidth: '1280px', width: '100%', margin: '0 auto', padding: '1.75rem 1rem' }}>
        <Routes>
          {/* HOME / LOGIN ROUTE */}
          <Route
            path="/"
            element={
              currentUser ? (
                <Navigate to="/book" replace />
              ) : (
                <AuthPage onLoginSuccess={handleLoginSuccess} />
              )
            }
          />

          {/* BOOK TICKET ROUTE */}
          <Route
            path="/book"
            element={
              !currentUser ? (
                <Navigate to="/" replace />
              ) : (
                <div>
                  {/* Mantine Stepper */}
                  <div className="m-stepper">
                    <div className={`m-step ${bookingStep >= 1 ? 'active' : ''} ${bookingStep > 1 ? 'completed' : ''}`}>
                      <div className="m-step-circle">1</div>
                      <div className="m-step-label">Select Train</div>
                    </div>
                    <div className={`m-step-line ${bookingStep > 1 ? 'active' : ''}`}></div>

                    <div className={`m-step ${bookingStep >= 2 ? 'active' : ''} ${bookingStep > 2 ? 'completed' : ''}`}>
                      <div className="m-step-circle">2</div>
                      <div className="m-step-label">Passenger Details</div>
                    </div>
                    <div className={`m-step-line ${bookingStep > 2 ? 'active' : ''}`}></div>

                    <div className={`m-step ${bookingStep >= 3 ? 'active' : ''} ${bookingStep > 3 ? 'completed' : ''}`}>
                      <div className="m-step-circle">3</div>
                      <div className="m-step-label">Payment Gateway</div>
                    </div>
                    <div className={`m-step-line ${bookingStep > 3 ? 'active' : ''}`}></div>

                    <div className={`m-step ${bookingStep === 4 ? 'active completed' : ''}`}>
                      <div className="m-step-circle">4</div>
                      <div className="m-step-label">e-Ticket Issued</div>
                    </div>
                  </div>

                  {/* STEP 1: Search and Train List */}
                  {bookingStep === 1 && (
                    <>
                      <TrainSearch
                        onSearch={handleSearch}
                        currentSearchParams={searchParams}
                      />
                      <TrainList
                        trains={filteredTrains}
                        searchParams={searchParams}
                        onSelectTrainClass={handleSelectTrainClass}
                      />
                    </>
                  )}

                  {/* STEP 2: Passenger Details */}
                  {bookingStep === 2 && selectedTrain && (
                    <PassengerForm
                      train={selectedTrain}
                      selectedClass={selectedClass}
                      searchParams={searchParams}
                      onProceedToPayment={handleProceedToPayment}
                      onBack={() => setBookingStep(1)}
                    />
                  )}

                  {/* STEP 3: Payment Gateway */}
                  {bookingStep === 3 && checkoutData && (
                    <PaymentGateway
                      bookingData={checkoutData}
                      onPaymentSuccess={handlePaymentSuccess}
                      onBack={() => setBookingStep(2)}
                    />
                  )}

                  {/* STEP 4: Confirmation */}
                  {bookingStep === 4 && confirmedBooking && (
                    <BookingConfirmation
                      booking={confirmedBooking}
                      onNewBooking={handleResetBooking}
                      onViewBookings={() => {
                        handleResetBooking();
                        navigate('/bookings');
                      }}
                    />
                  )}
                </div>
              )
            }
          />

          {/* MY BOOKINGS ROUTE */}
          <Route
            path="/bookings"
            element={
              !currentUser ? (
                <Navigate to="/" replace />
              ) : (
                <MyBookings
                  onBookNew={() => {
                    handleResetBooking();
                    navigate('/book');
                  }}
                  showToast={showToast}
                />
              )
            }
          />

          {/* MASTER PASSENGER LIST ROUTE */}
          <Route
            path="/master-list"
            element={
              !currentUser ? (
                <Navigate to="/" replace />
              ) : (
                <MasterList showToast={showToast} />
              )
            }
          />

          {/* PAYMENT METHODS ROUTE */}
          <Route
            path="/payments"
            element={
              !currentUser ? (
                <Navigate to="/" replace />
              ) : (
                <PaymentMethods showToast={showToast} />
              )
            }
          />

          {/* USER PROFILE ROUTE */}
          <Route
            path="/profile"
            element={
              !currentUser ? (
                <Navigate to="/" replace />
              ) : (
                <UserProfile
                  currentUser={currentUser}
                  onUpdateUser={(updated) => {
                    setCurrentUser(updated);
                    showToast('success', 'Profile Updated', 'Your profile details have been saved.');
                  }}
                />
              )
            }
          />

          {/* ADMIN / MANAGE TRAIN ROUTES ROUTE (ROLE PROTECTED) */}
          <Route
            path="/admin"
            element={
              !currentUser ? (
                <Navigate to="/" replace />
              ) : currentUser.role !== 'admin' ? (
                <Navigate to="/book" replace />
              ) : (
                <AdminPanel showToast={showToast} />
              )
            }
          />

          {/* FALLBACK CATCH-ALL */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
