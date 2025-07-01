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

  const options: Intl.Date
