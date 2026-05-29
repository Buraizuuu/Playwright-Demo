import { test as base } from '@playwright/test';
import { BaseClient } from '../api/clients/base.client';
import { BookingService } from '../api/services/booking/booking.service';

type ApiFixtures = {
  bookingService: BookingService;
};

export const test = base.extend<ApiFixtures>({
  bookingService: async ({ request }, use) => {
    const client = new BaseClient(request);
    await use(new BookingService(client));
  },
});

export { expect } from '@playwright/test';
