import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Hàm kết hợp Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Hàm format ngày tháng
export function formatDate(date: Date | string, format: 'short' | 'long' | 'datetime' = 'short'): string {
  const d = new Date(date);
  
  if (isNaN(d.getTime())) {
    return 'Ngày không hợp lệ';
  }

  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Ho_Chi_Minh',
  };

  switch (format) {
    case 'short':
      options.day = '2-digit';
      options.month = '2-digit';
      options.year = 'numeric';
      return d.toLocaleDateString('vi-VN', options);
    case 'long':
      options.weekday = 'long';
      options.day = 'numeric';
      options.month = 'long';
      options.year = 'numeric';
      return d.toLocaleDateString('vi-VN', options);
    case 'datetime':
      options.day = '2-digit';
      options.month = '2-digit';
      options.year = 'numeric';
      options.hour = '2-digit';
      options.minute = '2-digit';
      return d.toLocaleString('vi-VN', options);
    default:
      return d.toLocaleDateString('vi-VN');
  }
}

// Hàm format số tiền VND
export function formatCurrency(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(num)) {
    return '0 đ';
  }

  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(num);
}

// Hàm format số
export function formatNumber(num: number | string): string {
  const number = typeof num === 'string' ? parseFloat(num) : num;
  
  if (isNaN(number)) {
    return '0';
  }

  return new Intl.NumberFormat('vi-VN').format(number);
}

// Hàm hash password
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

// Hàm verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

// Hàm tạo JWT token
export function createToken(payload: any, expiresIn: string = '24h'): string {
  const secret = process.env.JWT_SECRET || 'your-super-secret-key';
  return jwt.sign(payload, secret, { expiresIn });
}

// Hàm verify JWT token
export function verifyToken(token: string): any {
  try {
    const secret = process.env.JWT_SECRET || 'your-super-secret-key';
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
}

// Hàm tạo mã số tự động
export function generateFileNumber(prefix: string = 'HD'): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const time = String(now.getHours()).padStart(2, '0') + String(now.getMinutes()).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  return `${prefix}${year}${month}${day}${time}${random}`;
}

// Hàm validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Hàm validate phone number (Vietnam)
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
  return phoneRegex.test(phone);
}

// Hàm validate CCCD/CMND
export function isValidCitizenId(citizenId: string): boolean {
  const cccdRegex = /^[0-9]{12}$/; // CCCD 12 số
  const cmndRegex = /^[0-9]{9}$/;  // CMND 9 số
  return cccdRegex.test(citizenId) || cmndRegex.test(citizenId);
}

// Hàm tạo slug từ string
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9 -]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Remove duplicate hyphens
    .trim();
}

// Hàm truncate text
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

// Hàm capitalize first letter
export function capitalizeFirst(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

// Hàm xử lý lỗi API
export function handleApiError(error: any): { message: string; status: number } {
  console.error('API Error:', error);
  
  if (error.message) {
    return {
      message: error.message,
      status: error.status || 500
    };
  }
  
  return {
    message: 'Đã xảy ra lỗi không xác định',
    status: 500
  };
}

// Hàm debounce
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Hàm validate form data
export function validateRequired(value: any, fieldName: string): string | null {
  if (value === null || value === undefined || value === '') {
    return `${fieldName} là bắt buộc`;
  }
  return null;
}

// Hàm tạo options cho select
export function createSelectOptions<T extends Record<string, any>>(
  items: T[],
  valueKey: keyof T,
  labelKey: keyof T
): Array<{ value: any; label: string }> {
  return items.map(item => ({
    value: item[valueKey],
    label: String(item[labelKey])
  }));
}

// Hàm chuyển đổi file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Constants
export const PROVINCES = [
  'Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ',
  'An Giang', 'Bà Rịa - Vũng Tàu', 'Bắc Giang', 'Bắc Kạn', 'Bạc Liêu',
  'Bắc Ninh', 'Bến Tre', 'Bình Định', 'Bình Dương', 'Bình Phước',
  'Bình Thuận', 'Cà Mau', 'Cao Bằng', 'Đắk Lắk', 'Đắk Nông',
  'Điện Biên', 'Đồng Nai', 'Đồng Tháp', 'Gia Lai', 'Hà Giang',
  'Hà Nam', 'Hà Tĩnh', 'Hải Dương', 'Hậu Giang', 'Hòa Bình',
  'Hưng Yên', 'Khánh Hòa', 'Kiên Giang', 'Kon Tum', 'Lai Châu',
  'Lâm Đồng', 'Lạng Sơn', 'Lào Cai', 'Long An', 'Nam Định',
  'Nghệ An', 'Ninh Bình', 'Ninh Thuận', 'Phú Thọ', 'Phú Yên',
  'Quảng Bình', 'Quảng Nam', 'Quảng Ngãi', 'Quảng Ninh', 'Quảng Trị',
  'Sóc Trăng', 'Sơn La', 'Tây Ninh', 'Thái Bình', 'Thái Nguyên',
  'Thanh Hóa', 'Thừa Thiên Huế', 'Tiền Giang', 'Trà Vinh', 'Tuyên Quang',
  'Vĩnh Long', 'Vĩnh Phúc', 'Yên Bái'
];

export const GENDERS = [
  { value: 'Nam', label: 'Nam' },
  { value: 'Nữ', label: 'Nữ' },
  { value: 'Khác', label: 'Khác' }
];

export const FILE_STATUSES = [
  { value: 'Chờ công chứng', label: 'Chờ công chứng', color: 'bg-warning-100 text-warning-800' },
  { value: 'Đã công chứng', label: 'Đã công chứng', color: 'bg-success-100 text-success-800' },
  { value: 'Hủy bỏ', label: 'Hủy bỏ', color: 'bg-danger-100 text-danger-800' }
];

export const PAYMENT_STATUSES = [
  { value: 'Chưa thanh toán', label: 'Chưa thanh toán', color: 'bg-danger-100 text-danger-800' },
  { value: 'Thanh toán một phần', label: 'Thanh toán một phần', color: 'bg-warning-100 text-warning-800' },
  { value: 'Đã thanh toán', label: 'Đã thanh toán', color: 'bg-success-100 text-success-800' }
];
