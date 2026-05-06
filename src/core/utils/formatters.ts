import { format, formatDistanceToNow, type Locale } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';

const LOCALES: Record<string, Locale> = { ar, en: enUS };

export function formatIQD(amount: number, locale = 'en'): string {
  const value = new Intl.NumberFormat(locale === 'ar' ? 'ar-IQ' : 'en-US', {
    maximumFractionDigits: 0,
  }).format(amount);
  return locale === 'ar' ? `${value} د.ع` : `${value} IQD`;
}

export function formatCompactIQD(amount: number, locale = 'en'): string {
  const formatter = new Intl.NumberFormat(locale === 'ar' ? 'ar-IQ' : 'en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  });
  return locale === 'ar' ? `${formatter.format(amount)} د.ع` : `${formatter.format(amount)} IQD`;
}

export function formatDate(date: Date | string, pattern = 'PP', locale = 'en'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, pattern, { locale: LOCALES[locale] ?? enUS });
}

export function formatDateTime(date: Date | string, locale = 'en'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, 'PPp', { locale: LOCALES[locale] ?? enUS });
}

export function formatRelative(date: Date | string, locale = 'en'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return formatDistanceToNow(d, { addSuffix: true, locale: LOCALES[locale] ?? enUS });
}

export function formatNumber(value: number, locale = 'en'): string {
  return new Intl.NumberFormat(locale === 'ar' ? 'ar-IQ' : 'en-US').format(value);
}

export function formatFawzNumber(num: string | number): string {
  // Force exactly 10 digits — pad shorter, take last 10 of longer.
  const digits = String(num).replace(/\D/g, '');
  const s = digits.padStart(10, '0').slice(-10);
  return `${s.slice(0, 4)} ${s.slice(4, 7)} ${s.slice(7, 10)}`;
}

export function formatCountdown(seconds: number): { days: number; hours: number; minutes: number; seconds: number } {
  const safe = Math.max(0, Math.floor(seconds));
  return {
    days: Math.floor(safe / 86400),
    hours: Math.floor((safe % 86400) / 3600),
    minutes: Math.floor((safe % 3600) / 60),
    seconds: safe % 60,
  };
}
