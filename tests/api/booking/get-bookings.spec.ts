import { test, expect } from '../../../fixtures/api.fixtures';
import { Booking, BookingId } from '../../../api/services/booking/booking.types';
import { logger } from '../../../utils/logger';

test.describe('Booking API', () => {
  test('[GET /booking] should return a list of booking IDs', async ({ bookingService }) => {
    const response = await bookingService.getAllBookings();

    logger.info(`GET /booking → ${response.status()}`);

    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();

    const bookings: BookingId[] = await response.json();

    expect(Array.isArray(bookings)).toBe(true);
    expect(bookings.length).toBeGreaterThan(0);
    expect(bookings[0]).toHaveProperty('bookingid');
    expect(typeof bookings[0].bookingid).toBe('number');

    logger.info(`Retrieved ${bookings.length} booking(s) — first ID: ${bookings[0].bookingid}`);
  });

  test('[GET /booking/:id] should return a booking by its ID', async ({ bookingService }) => {
    const listResponse = await bookingService.getAllBookings();
    const bookings: BookingId[] = await listResponse.json();
    const id = bookings[0].bookingid;

    logger.info(`GET /booking/${id} — resolving first available ID`);

    const response = await bookingService.getBookingById(id);

    logger.info(`GET /booking/${id} → ${response.status()}`);

    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();

    const booking: Booking = await response.json();

    expect(booking).toHaveProperty('firstname');
    expect(booking).toHaveProperty('lastname');
    expect(booking).toHaveProperty('totalprice');
    expect(booking).toHaveProperty('depositpaid');
    expect(booking).toHaveProperty('bookingdates');
    expect(booking.bookingdates).toHaveProperty('checkin');
    expect(booking.bookingdates).toHaveProperty('checkout');

    logger.info(`Booking ${id} — ${booking.firstname} ${booking.lastname} | £${booking.totalprice} | ${booking.bookingdates.checkin} → ${booking.bookingdates.checkout}`);
  });

  test('[GET /booking] should filter bookings by firstname and lastname', async ({ bookingService }) => {
    const listResponse = await bookingService.getAllBookings();
    const allBookings: BookingId[] = await listResponse.json();
    const { firstname, lastname } = await (await bookingService.getBookingById(allBookings[0].bookingid)).json() as Booking;

    logger.info(`GET /booking?firstname=${firstname}&lastname=${lastname}`);

    const response = await bookingService.getBookingsByName(firstname, lastname);

    logger.info(`GET /booking (filter: ${firstname} ${lastname}) → ${response.status()}`);

    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();

    const bookings: BookingId[] = await response.json();

    expect(Array.isArray(bookings)).toBe(true);
    expect(bookings.length).toBeGreaterThan(0);
    for (const booking of bookings) {
      expect(booking).toHaveProperty('bookingid');
      expect(typeof booking.bookingid).toBe('number');
    }

    logger.info(`Filter (${firstname} ${lastname}) returned ${bookings.length} booking(s) — IDs: ${bookings.map(b => b.bookingid).join(', ')}`);
  });
});
