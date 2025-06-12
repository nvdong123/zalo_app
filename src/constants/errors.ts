// constants/errors.ts

export const Errors = {
  MERCHANT_NOT_FOUND: 'MERCHANT_NOT_FOUND',
  ORDER_SESSION_EXPIRED: 'ORDER_SESSION_EXPIRED',
  BOOKING_NOT_FOUND: 'BOOKING_NOT_FOUND',
  BOOKING_VALIDATION_ERROR: 'BOOKING_VALIDATION_ERROR',
  ROOM_NOT_AVAILABLE: 'ROOM_NOT_AVAILABLE',
  BOOKING_DATE_INVALID: 'BOOKING_DATE_INVALID',
  BOOKING_GUESTS_EXCEEDED: 'BOOKING_GUESTS_EXCEEDED',
  BOOKING_ALREADY_CANCELED: 'BOOKING_ALREADY_CANCELED',
  UNAUTHORIZED: 'UNAUTHORIZED',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  PAYMENT_FAILED: 'PAYMENT_FAILED'
}

export class MerchantNotFoundError extends Error {
  code = Errors.MERCHANT_NOT_FOUND
  constructor() {
    super(Errors.MERCHANT_NOT_FOUND)
  }
}

export class BookingNotFoundError extends Error {
  code = Errors.BOOKING_NOT_FOUND
  constructor() {
    super(Errors.BOOKING_NOT_FOUND)
  }
}

export class OrderSessionExpiredError extends Error {
  code = Errors.ORDER_SESSION_EXPIRED
  constructor() {
    super(Errors.ORDER_SESSION_EXPIRED)
  }
}

export class BookingValidationError extends Error {
  code = Errors.BOOKING_VALIDATION_ERROR
  details: any
  
  constructor(message: string, details?: any) {
    super(message || Errors.BOOKING_VALIDATION_ERROR)
    this.details = details
  }
}

export class RoomNotAvailableError extends Error {
  code = Errors.ROOM_NOT_AVAILABLE
  roomId: string
  dates: string[]
  
  constructor(roomId: string, dates: string[]) {
    super(Errors.ROOM_NOT_AVAILABLE)
    this.roomId = roomId
    this.dates = dates
  }
}

export class BookingDateInvalidError extends Error {
  code = Errors.BOOKING_DATE_INVALID
  
  constructor(message?: string) {
    super(message || Errors.BOOKING_DATE_INVALID)
  }
}

export class BookingGuestsExceededError extends Error {
  code = Errors.BOOKING_GUESTS_EXCEEDED
  maxGuests: number
  
  constructor(maxGuests: number) {
    super(Errors.BOOKING_GUESTS_EXCEEDED)
    this.maxGuests = maxGuests
  }
}

export class BookingAlreadyCanceledError extends Error {
  code = Errors.BOOKING_ALREADY_CANCELED
  bookingId: string
  
  constructor(bookingId: string) {
    super(Errors.BOOKING_ALREADY_CANCELED)
    this.bookingId = bookingId
  }
}

export class UnauthorizedError extends Error {
  code = Errors.UNAUTHORIZED
  
  constructor(message?: string) {
    super(message || Errors.UNAUTHORIZED)
  }
}

export class UserNotFoundError extends Error {
  code = Errors.USER_NOT_FOUND
  userId: string
  
  constructor(userId: string) {
    super(Errors.USER_NOT_FOUND)
    this.userId = userId
  }
}

export class PaymentFailedError extends Error {
  code = Errors.PAYMENT_FAILED
  details: any
  
  constructor(details?: any) {
    super(Errors.PAYMENT_FAILED)
    this.details = details
  }
}

// Helper function to handle errors
export function handleBookingError(error: any): string {
  if (error instanceof BookingValidationError) {
    return `Lỗi xác thực: ${error.message}`;
  }
  if (error instanceof RoomNotAvailableError) {
    return `Phòng không khả dụng trong thời gian bạn chọn`;
  }
  if (error instanceof BookingDateInvalidError) {
    return `Ngày đặt phòng không hợp lệ: ${error.message}`;
  }
  if (error instanceof BookingGuestsExceededError) {
    return `Số lượng khách vượt quá giới hạn cho phép (tối đa ${error.maxGuests} người)`;
  }
  if (error instanceof BookingAlreadyCanceledError) {
    return `Đặt phòng đã được hủy trước đó`;
  }
  if (error instanceof UnauthorizedError) {
    return `Vui lòng đăng nhập để tiếp tục`;
  }
  if (error instanceof UserNotFoundError) {
    return `Không tìm thấy thông tin người dùng`;
  }
  if (error instanceof PaymentFailedError) {
    return `Thanh toán thất bại. Vui lòng thử lại`;
  }
  // Default error message
  return error.message || 'Có lỗi xảy ra. Vui lòng thử lại';
}