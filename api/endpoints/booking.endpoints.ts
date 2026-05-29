export const BookingEndpoints = {
  getAll: '/booking',
  getById: (id: number) => `/booking/${id}`,
} as const;
