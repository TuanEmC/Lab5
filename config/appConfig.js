// Cấu hình chung cho ứng dụng
export const APP_CONFIG = {
  // Thông tin ứng dụng
  APP_NAME: 'Spa Service',
  APP_VERSION: '1.0.0',
  
  // Cấu hình thời gian
  WORKING_HOURS: {
    START: '08:00',
    END: '20:00'
  },

  // Cấu hình đặt lịch
  BOOKING_CONFIG: {
    MIN_ADVANCE_DAYS: 1,
    MAX_ADVANCE_DAYS: 30,
    DEFAULT_DURATION: 60, // minutes
    BUFFER_TIME: 15, // minutes between appointments
  },

  // Cấu hình thanh toán
  PAYMENT_CONFIG: {
    CURRENCY: 'VND',
    TAX_RATE: 0.1, // 10%
    PAYMENT_METHODS: ['CASH', 'BANK_TRANSFER', 'MOMO'],
  },

  // Trạng thái đặt lịch
  BOOKING_STATUS: {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
  },

  // Trạng thái thanh toán
  PAYMENT_STATUS: {
    UNPAID: 'unpaid',
    PARTIALLY_PAID: 'partially_paid',
    PAID: 'paid',
    REFUNDED: 'refunded'
  },

  // Vai trò người dùng
  USER_ROLES: {
    ADMIN: 'admin',
    CUSTOMER: 'customer',
    STAFF: 'staff'
  },

  // Cấu hình thông báo
  NOTIFICATION_CONFIG: {
    BOOKING_REMINDER_HOURS: 24,
    FEEDBACK_REMINDER_HOURS: 48
  }
}; 