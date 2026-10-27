import { Language } from '../types';

const BENGALI_MONTHS = [
  'জানুয়ারি',
  'ফেব্রুয়ারি',
  'মার্চ',
  'এপ্রিল',
  'মে',
  'জুন',
  'জুলাই',
  'আগস্ট',
  'সেপ্টেম্বর',
  'অক্টোবর',
  'নভেম্বর',
  'ডিসেম্বর',
];

const ENGLISH_MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export function toBengaliDigits(input: string | number): string {
  const digits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(input).replace(/[0-9]/g, (w) => digits[parseInt(w, 10)]);
}

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDisplayDate(dateStr?: string, language: Language = 'bn'): string {
  if (!dateStr) return '';

  // Match YYYY-MM-DD or standard parseable format
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const monthIdx = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);

    if (!isNaN(year) && monthIdx >= 0 && monthIdx < 12 && !isNaN(day)) {
      if (language === 'bn') {
        const bnDay = toBengaliDigits(day);
        const bnMonth = BENGALI_MONTHS[monthIdx];
        const bnYear = toBengaliDigits(year);
        return `${bnDay} ${bnMonth}, ${bnYear}`;
      } else {
        const enMonth = ENGLISH_MONTHS[monthIdx];
        return `${enMonth} ${day}, ${year}`;
      }
    }
  }

  // Fallback to Date object parsing
  try {
    const parsed = new Date(dateStr);
    if (!isNaN(parsed.getTime())) {
      const year = parsed.getFullYear();
      const monthIdx = parsed.getMonth();
      const day = parsed.getDate();
      if (language === 'bn') {
        return `${toBengaliDigits(day)} ${BENGALI_MONTHS[monthIdx]}, ${toBengaliDigits(year)}`;
      }
      return `${ENGLISH_MONTHS[monthIdx]} ${day}, ${year}`;
    }
  } catch {
    // Return original string if parse fails
  }

  return dateStr;
}
