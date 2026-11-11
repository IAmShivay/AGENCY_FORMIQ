import { HTTP_STATUS } from './constants';

/** Error carrying the HTTP status the booking routes should answer with. */
export class BookingError extends Error {
  constructor(message: string, public readonly status: number = HTTP_STATUS.INTERNAL_SERVER_ERROR) {
    super(message);
    this.name = 'BookingError';
  }
}
