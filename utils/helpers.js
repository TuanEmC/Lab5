import { APP_CONFIG } from '../config/appConfig';

// Format số tiền
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: APP_CONFIG.PAYMENT_CONFIG.CURRENCY
  }).format(amount);
};

// Format ngày giờ
export const formatDateTime = (date) => {
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
};

// Kiểm tra thời gian làm việc
export const isWithinWorkingHours = (dateTime) => {
  const date = new Date(dateTime);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  
  return time >= APP_CONFIG.WORKING_HOURS.START && time <= APP_CONFIG.WORKING_HOURS.END;
};

// Tính tổng tiền bao gồm thuế
export const calculateTotalWithTax = (amount) => {
  return amount * (1 + APP_CONFIG.PAYMENT_CONFIG.TAX_RATE);
};

// Kiểm tra ngày đặt lịch hợp lệ
export const isValidBookingDate = (date) => {
  const today = new Date();
  const bookingDate = new Date(date);
  const diffDays = Math.ceil((bookingDate - today) / (1000 * 60 * 60 * 24));
  
  return diffDays >= APP_CONFIG.BOOKING_CONFIG.MIN_ADVANCE_DAYS && 
         diffDays <= APP_CONFIG.BOOKING_CONFIG.MAX_ADVANCE_DAYS;
};

// Tạo mã đặt lịch ngẫu nhiên
export const generateBookingCode = () => {
  const prefix = 'BK';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}${timestamp}${random}`;
};

// Kiểm tra vai trò người dùng
export const checkUserRole = (userRole, allowedRoles) => {
  return allowedRoles.includes(userRole);
};

// Tính thời gian kết thúc dịch vụ
export const calculateEndTime = (startTime, duration = APP_CONFIG.BOOKING_CONFIG.DEFAULT_DURATION) => {
  const start = new Date(startTime);
  return new Date(start.getTime() + duration * 60000);
};

// Kiểm tra xung đột lịch đặt
export const hasTimeConflict = (existingBookings, newBooking) => {
  const newStart = new Date(newBooking.startTime);
  const newEnd = calculateEndTime(newStart, newBooking.duration);

  return existingBookings.some(booking => {
    const bookingStart = new Date(booking.startTime);
    const bookingEnd = calculateEndTime(bookingStart, booking.duration);
    
    return (newStart < bookingEnd && newEnd > bookingStart);
  });
};

// Lấy danh sách các ngày có thể đặt lịch
export const getAvailableDates = () => {
  const dates = [];
  const today = new Date();
  
  for (let i = APP_CONFIG.BOOKING_CONFIG.MIN_ADVANCE_DAYS; i <= APP_CONFIG.BOOKING_CONFIG.MAX_ADVANCE_DAYS; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    // Chỉ lấy các ngày từ thứ 2 đến thứ 7 (bỏ chủ nhật)
    if (date.getDay() !== 0) {
      dates.push(date);
    }
  }
  return dates;
};

// Lấy danh sách các khung giờ có thể đặt lịch trong ngày
export const getAvailableTimeSlots = (selectedDate, existingBookings = []) => {
  const timeSlots = [];
  const [startHour, startMinute] = APP_CONFIG.WORKING_HOURS.START.split(':').map(Number);
  const [endHour, endMinute] = APP_CONFIG.WORKING_HOURS.END.split(':').map(Number);
  
  const startTime = new Date(selectedDate);
  startTime.setHours(startHour, startMinute, 0);
  
  const endTime = new Date(selectedDate);
  endTime.setHours(endHour, endMinute, 0);
  
  // Tạo các khung giờ với khoảng thời gian là DEFAULT_DURATION
  const slotDuration = APP_CONFIG.BOOKING_CONFIG.DEFAULT_DURATION;
  let currentSlot = new Date(startTime);
  
  while (currentSlot < endTime) {
    const slotEnd = new Date(currentSlot.getTime() + slotDuration * 60000);
    
    // Kiểm tra xem khung giờ này đã được đặt chưa
    const isBooked = existingBookings.some(booking => {
      const bookingStart = new Date(booking.startTime);
      const bookingEnd = calculateEndTime(bookingStart, booking.duration);
      return (currentSlot < bookingEnd && slotEnd > bookingStart);
    });
    
    if (!isBooked) {
      timeSlots.push({
        startTime: new Date(currentSlot),
        endTime: slotEnd,
        formatted: `${currentSlot.getHours().toString().padStart(2, '0')}:${currentSlot.getMinutes().toString().padStart(2, '0')} - ${slotEnd.getHours().toString().padStart(2, '0')}:${slotEnd.getMinutes().toString().padStart(2, '0')}`
      });
    }
    
    // Thêm buffer time giữa các slot
    currentSlot = new Date(slotEnd.getTime() + APP_CONFIG.BOOKING_CONFIG.BUFFER_TIME * 60000);
  }
  
  return timeSlots;
};

// Format ngày theo định dạng tiếng Việt
export const formatDateToVietnamese = (date) => {
  const weekdays = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
  const months = [
    'tháng 1', 'tháng 2', 'tháng 3', 'tháng 4', 'tháng 5', 'tháng 6',
    'tháng 7', 'tháng 8', 'tháng 9', 'tháng 10', 'tháng 11', 'tháng 12'
  ];
  
  const d = new Date(date);
  return `${weekdays[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

// Kiểm tra xem một khung giờ có hợp lệ không
export const isValidTimeSlot = (startTime, duration = APP_CONFIG.BOOKING_CONFIG.DEFAULT_DURATION) => {
  const start = new Date(startTime);
  const end = calculateEndTime(start, duration);
  
  // Kiểm tra xem thời gian bắt đầu và kết thúc có nằm trong giờ làm việc không
  if (!isWithinWorkingHours(start) || !isWithinWorkingHours(end)) {
    return false;
  }
  
  // Kiểm tra xem thời gian đặt có đủ duration không
  const diffMinutes = (end - start) / (1000 * 60);
  if (diffMinutes < duration) {
    return false;
  }
  
  return true;
}; 