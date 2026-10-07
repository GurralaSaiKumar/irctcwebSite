// Initial seed data for IRCTC Simulation
const DEFAULT_TRAINS = [
  {
    id: '12952',
    name: 'New Delhi - Mumbai Central Rajdhani Express',
    source: 'NDLS (New Delhi)',
    destination: 'MMCT (Mumbai Central)',
    departure: '16:55',
    arrival: '08:35',
    duration: '15h 40m',
    runsOn: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    classes: {
      '1A': { fare: 4850, available: 14, status: 'AVAILABLE' },
      '2A': { fare: 2980, available: 42, status: 'AVAILABLE' },
      '3A': { fare: 2150, available: 98, status: 'AVAILABLE' },
      'SL': { fare: 820, available: 0, status: 'WL 28' },
    }
  },
  {
    id: '22436',
    name: 'Vande Bharat Express',
    source: 'NDLS (New Delhi)',
    destination: 'BSB (Varanasi Jn)',
    departure: '06:00',
    arrival: '14:00',
    duration: '8h 00m',
    runsOn: ['Tue', 'Wed', 'Fri', 'Sat', 'Sun'],
    classes: {
      'CC': { fare: 1750, available: 165, status: 'AVAILABLE' },
      'EC': { fare: 3300, available: 26, status: 'AVAILABLE' },
    }
  },
  {
    id: '12004',
    name: 'Lucknow Shatabdi Express',
    source: 'NDLS (New Delhi)',
    destination: 'LJN (Lucknow Jn)',
    departure: '06:10',
    arrival: '12:40',
    duration: '6h 30m',
    runsOn: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    classes: {
      'CC': { fare: 1165, available: 84, status: 'AVAILABLE' },
      'EC': { fare: 2125, available: 12, status: 'AVAILABLE' },
    }
  },
  {
    id: '12302',
    name: 'Kolkata Rajdhani Express',
    source: 'NDLS (New Delhi)',
    destination: 'HWH (Howrah Jn)',
    departure: '16:50',
    arrival: '09:55',
    duration: '17h 05m',
    runsOn: ['Mon', 'Tue', 'Wed', 'Thu', 'Sat', 'Sun'],
    classes: {
      '1A': { fare: 4950, available: 6, status: 'AVAILABLE' },
      '2A': { fare: 3050, available: 24, status: 'AVAILABLE' },
      '3A': { fare: 2210, available: 0, status: 'RAC 12' },
      'SL': { fare: 790, available: 180, status: 'AVAILABLE' },
    }
  },
  {
    id: '12626',
    name: 'Kerala Superfast Express',
    source: 'NDLS (New Delhi)',
    destination: 'TVC (Thiruvananthapuram)',
    departure: '20:10',
    arrival: '14:15',
    duration: '42h 05m',
    runsOn: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    classes: {
      '2A': { fare: 3450, available: 18, status: 'AVAILABLE' },
      '3A': { fare: 2420, available: 64, status: 'AVAILABLE' },
      'SL': { fare: 910, available: 112, status: 'AVAILABLE' },
    }
  },
  {
    id: '12658',
    name: 'Chennai Mail Express',
    source: 'SBC (Bengaluru City)',
    destination: 'MAS (Chennai Central)',
    departure: '22:40',
    arrival: '04:35',
    duration: '5h 55m',
    runsOn: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    classes: {
      '1A': { fare: 1850, available: 15, status: 'AVAILABLE' },
      '2A': { fare: 1150, available: 45, status: 'AVAILABLE' },
      '3A': { fare: 780, available: 120, status: 'AVAILABLE' },
      'SL': { fare: 295, available: 240, status: 'AVAILABLE' },
    }
  }
];

const INITIAL_USERS = [
  {
    id: 'usr_default',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    phone: '9876543210',
    username: 'aarav_irctc',
    password: 'password123',
    address: 'B-42, Connaught Place, New Delhi - 110001',
    role: 'user',
  },
  {
    id: 'usr_admin',
    name: 'Rajesh Gupta (Chief Controller)',
    email: 'admin@railnet.gov.in',
    phone: '9811223344',
    username: 'admin_rail',
    password: 'admin123',
    address: 'Rail Bhavan, Raisina Road, New Delhi',
    role: 'admin',
  }
];

const INITIAL_MASTER_PASSENGERS = [
  { id: 'p1', name: 'Aarav Sharma', age: 32, gender: 'Male', berth: 'Lower', senior: false },
  { id: 'p2', name: 'Priya Sharma', age: 30, gender: 'Female', berth: 'Middle', senior: false },
  { id: 'p3', name: 'Ramesh Sharma', age: 64, gender: 'Male', berth: 'Lower', senior: true },
];

const INITIAL_PAYMENT_METHODS = [
  { id: 'pay1', type: 'UPI', upiId: 'aarav@oksbi', name: 'SBI UPI' },
  { id: 'pay2', type: 'CARD', cardHolder: 'AARAV SHARMA', cardNumber: '•••• •••• •••• 4129', expiry: '08/28', bank: 'HDFC Bank Visa' },
];

// Helper functions for LocalStorage
export const storageService = {
  getTrains: () => {
    const data = localStorage.getItem('irctc_trains');
    if (!data) {
      localStorage.setItem('irctc_trains', JSON.stringify(DEFAULT_TRAINS));
      return DEFAULT_TRAINS;
    }
    return JSON.parse(data);
  },

  addTrain: (train) => {
    const trains = storageService.getTrains();
    const updated = [train, ...trains];
    localStorage.setItem('irctc_trains', JSON.stringify(updated));
    return updated;
  },

  getUsers: () => {
    const data = localStorage.getItem('irctc_users');
    if (!data) {
      localStorage.setItem('irctc_users', JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    const users = JSON.parse(data);
    // Ensure standard test accounts maintain their designated roles
    const aarav = users.find(u => u.username === 'aarav_irctc');
    if (aarav && aarav.role !== 'user') {
      aarav.role = 'user';
      localStorage.setItem('irctc_users', JSON.stringify(users));
    }
    const adminUser = users.find(u => u.username === 'admin_rail');
    if (!adminUser) {
      users.push(INITIAL_USERS[1]);
      localStorage.setItem('irctc_users', JSON.stringify(users));
    }
    return users;
  },

  saveUser: (user) => {
    const users = storageService.getUsers();
    const existingIndex = users.findIndex(u => u.username === user.username);
    if (existingIndex >= 0) {
      users[existingIndex] = { ...users[existingIndex], ...user };
    } else {
      users.push(user);
    }
    localStorage.setItem('irctc_users', JSON.stringify(users));
    return users;
  },

  getCurrentUser: () => {
    const data = localStorage.getItem('irctc_current_user');
    if (!data) return null;
    const user = JSON.parse(data);
    // Enforce user role for aarav_irctc
    if (user.username === 'aarav_irctc' && user.role !== 'user') {
      user.role = 'user';
      localStorage.setItem('irctc_current_user', JSON.stringify(user));
    }
    return user;
  },

  setCurrentUser: (user) => {
    if (user) {
      localStorage.setItem('irctc_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('irctc_current_user');
    }
  },

  logout: () => {
    localStorage.removeItem('irctc_current_user');
  },

  getMasterList: () => {
    const data = localStorage.getItem('irctc_master_passengers');
    if (!data) {
      localStorage.setItem('irctc_master_passengers', JSON.stringify(INITIAL_MASTER_PASSENGERS));
      return INITIAL_MASTER_PASSENGERS;
    }
    return JSON.parse(data);
  },

  saveMasterPassenger: (passenger) => {
    const list = storageService.getMasterList();
    if (passenger.id) {
      const idx = list.findIndex(p => p.id === passenger.id);
      if (idx >= 0) list[idx] = passenger;
      else list.push(passenger);
    } else {
      passenger.id = 'p_' + Date.now();
      list.push(passenger);
    }
    localStorage.setItem('irctc_master_passengers', JSON.stringify(list));
    return list;
  },

  deleteMasterPassenger: (id) => {
    const list = storageService.getMasterList().filter(p => p.id !== id);
    localStorage.setItem('irctc_master_passengers', JSON.stringify(list));
    return list;
  },

  getPaymentMethods: () => {
    const data = localStorage.getItem('irctc_payment_methods');
    if (!data) {
      localStorage.setItem('irctc_payment_methods', JSON.stringify(INITIAL_PAYMENT_METHODS));
      return INITIAL_PAYMENT_METHODS;
    }
    return JSON.parse(data);
  },

  addPaymentMethod: (method) => {
    const list = storageService.getPaymentMethods();
    const newMethod = { ...method, id: 'pay_' + Date.now() };
    const updated = [...list, newMethod];
    localStorage.setItem('irctc_payment_methods', JSON.stringify(updated));
    return updated;
  },

  deletePaymentMethod: (id) => {
    const list = storageService.getPaymentMethods().filter(m => m.id !== id);
    localStorage.setItem('irctc_payment_methods', JSON.stringify(list));
    return list;
  },

  getBookings: () => {
    const data = localStorage.getItem('irctc_bookings');
    return data ? JSON.parse(data) : [];
  },

  saveBooking: (booking) => {
    const list = storageService.getBookings();
    const updated = [booking, ...list];
    localStorage.setItem('irctc_bookings', JSON.stringify(updated));
    return updated;
  },

  cancelBooking: (pnr) => {
    const list = storageService.getBookings();
    const updated = list.map(b => {
      if (b.pnr === pnr) {
        return {
          ...b,
          status: 'CANCELLED',
          refundAmount: Math.round(b.totalAmount * 0.85),
          cancellationFee: Math.round(b.totalAmount * 0.15),
          cancelledAt: new Date().toISOString()
        };
      }
      return b;
    });
    localStorage.setItem('irctc_bookings', JSON.stringify(updated));
    return updated;
  }
};
