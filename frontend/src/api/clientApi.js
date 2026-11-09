import api from './client';

export const clientApi = {
  // Тарифы и абонементы
  getTypes: () => api.get('/api/membership-types'),
  getMyMembership: () => api.get('/api/memberships/me'),
  buyMembership: (typeId) => api.post('/api/payments/mock', { type_id: typeId }),

  // Занятия
  getClasses: () => api.get('/api/classes'),

  // Записи
  bookClass: (classId) => api.post('/api/bookings', { class_id: classId }),
  getMyBookings: () => api.get('/api/bookings/me'),
  cancelBooking: (bookingId) => api.delete(`/api/bookings/${bookingId}`),
};