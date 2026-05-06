export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function generateFawzNumber(): string {
  let n = '';
  for (let i = 0; i < 10; i++) n += Math.floor(Math.random() * 10);
  return n;
}

export function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard) return navigator.clipboard.writeText(text);
  return Promise.reject(new Error('Clipboard not available'));
}

export function truncate(text: string, max = 100): string {
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

export function maskEmail(email: string): string {
  const [user, domain] = email.split('@');
  if (!user || !domain) return email;
  const visible = user.slice(0, 2);
  return `${visible}${'*'.repeat(Math.max(user.length - 2, 0))}@${domain}`;
}

const UNIT_MAP_AR: Record<string, string> = {
  days: 'يوم',
  day: 'يوم',
  hours: 'ساعة',
  hour: 'ساعة',
  minutes: 'دقيقة',
  minute: 'دقيقة',
  recharges: 'شحنة',
  recharge: 'شحنة',
  merchants: 'تاجر',
  merchant: 'تاجر',
  transactions: 'معاملة',
  transaction: 'معاملة',
  invite: 'دعوة',
  invites: 'دعوات',
  view: 'مشاهدة',
  views: 'مشاهدات',
  IQD: 'د.ع',
};

export function pluralizeUnit(unit: string, count: number, lang = 'en'): string {
  if (lang === 'ar') return UNIT_MAP_AR[unit] ?? unit;
  if (count === 1) {
    if (unit.endsWith('ies')) return unit.slice(0, -3) + 'y';
    if (unit.endsWith('es') && !unit.endsWith('IQD')) return unit.slice(0, -2);
    if (unit.endsWith('s') && !unit.endsWith('ss')) return unit.slice(0, -1);
  }
  return unit;
}

export function pick<T extends object, K extends keyof T>(obj: T, keys: readonly K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const k of keys) result[k] = obj[k];
  return result;
}
