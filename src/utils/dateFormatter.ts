import { Language } from '../types';

const BN_NUMBERS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

const BN_MONTHS = [
  'জানুয়ারি',
  'ফেব্রুয়ারি',
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

const EN_MONTHS = [
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

export function toBengaliNumber(num: number | string): string {
  return num
    .toString()
    .replace(/[0-9]/g, (digit) => BN_NUMBERS[parseInt(digit, 10)] || digit);
}

/**
 * Format a YYYY-MM-DD or ISO date into an elegant readable localized string
 */
export function formatDisplayDate(dateStr?: string, language: Language = 'bn'): string {
  if (!dateStr) return '';

  try {
    // Handle YYYY-MM-DD or standard parseable string
    const parts = dateStr.split('T')[0].split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const monthIdx = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);

      if (language === 'bn') {
        const bnDay = toBengaliNumber(day);
        const bnMonth = BN_MONTHS[monthIdx] || '';
        const bnYear = toBengaliNumber(year);
        return `${bnDay} ${bnMonth}, ${bnYear}`;
      } else {
        const enMonth = EN_MONTHS[monthIdx] || '';
        return `${enMonth} ${day}, ${year}`;
      }
    }

    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;

    if (language === 'bn') {
      const day = toBengaliNumber(d.getDate());
      const month = BN_MONTHS[d.getMonth()];
      const year = toBengaliNumber(d.getFullYear());
      return `${day} ${month}, ${year}`;
    }

    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

/**
 * Get human-friendly relative time string (e.g. আজকে, ৩ দিন আগে / Today, 3 days ago)
 */
export function getRelativeTime(dateStr?: string, language: Language = 'bn'): string {
  if (!dateStr) return '';

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const parts = dateStr.split('T')[0].split('-');
    let target: Date;
    if (parts.length === 3) {
      target = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    } else {
      target = new Date(dateStr);
    }
    target.setHours(0, 0, 0, 0);

    const diffMs = today.getTime() - target.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return language === 'bn' ? 'আজকে' : 'Today';
    }
    if (diffDays === 1) {
      return language === 'bn' ? 'গতকাল' : 'Yesterday';
    }
    if (diffDays === -1) {
      return language === 'bn' ? 'আগামীকাল' : 'Tomorrow';
    }
    if (diffDays > 1 && diffDays < 30) {
      return language === 'bn'
        ? `${toBengaliNumber(diffDays)} দিন আগে`
        : `${diffDays} days ago`;
    }
    if (diffDays >= 30 && diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return language === 'bn'
        ? `${toBengaliNumber(months)} মাস আগে`
        : `${months} month${months > 1 ? 's' : ''} ago`;
    }
    if (diffDays >= 365) {
      const years = Math.floor(diffDays / 365);
      return language === 'bn'
        ? `${toBengaliNumber(years)} বছর আগে`
        : `${years} year${years > 1 ? 's' : ''} ago`;
    }

    // Future dates
    if (diffDays < -1) {
      const daysAhead = Math.abs(diffDays);
      return language === 'bn'
        ? `${toBengaliNumber(daysAhead)} দিন পর`
        : `in ${daysAhead} days`;
    }

    return '';
  } catch {
    return '';
  }
}

/**
 * Returns formatted date with optional relative suffix
 */
export function formatDateWithRelative(dateStr?: string, language: Language = 'bn'): string {
  const display = formatDisplayDate(dateStr, language);
  const relative = getRelativeTime(dateStr, language);
  if (!relative) return display;
  return `${display} (${relative})`;
}

/**
 * Helper to get today's date formatted as YYYY-MM-DD for HTML input[type="date"]
 */
export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Helper to get a date offset by N days in YYYY-MM-DD
 */
export function getDateOffsetDays(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
