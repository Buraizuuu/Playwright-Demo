import { APIResponse } from '@playwright/test';
import { BaseClient } from '../../clients/base.client';
import { BookingEndpoints } from '../../endpoints/booking.endpoints';

export class BookingService {
  constructor(private readonly client: BaseClient) {}

  getAllBookings(): Promise<APIResponse> {
    return this.client.get(BookingEndpoints.getAll);
  }

  getBookingById(id: number): Promise<APIResponse> {
    return this.client.get(BookingEndpoints.getById(id));
  }

  getBookingsByName(firstname: string, lastname: string): Promise<APIResponse> {
    return this.client.get(BookingEndpoints.getAll, { firstname, lastname });
  }
}
