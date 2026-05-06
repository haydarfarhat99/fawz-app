import { CheckCircle2, Clock, Lock, XCircle, Trophy } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@core/utils/cn';
import type { PayoutStatus, PayoutEvent } from '../types/prize.types';

const config = {
  credited: { icon: CheckCircle2, tone: 'bg-success-50 text-success-600 border-success-500/20' },
  pending: { icon: Clock, tone: 'bg-warning-500/10 text-warning-600 border-warning-500/30' },
  held: { icon: Lock, tone: 'bg-info-50 text-info-500 border-info-500/30' },
  rejected: { icon: XCircle, tone: 'bg-danger-50 text-danger-600 border-danger-500/20' },
  won: { icon: Trophy, tone: 'bg-gold-100 text-gold-700 border-gold-300' },
} as const;

interface StatusBadgeProps {
  status: PayoutStatus | PayoutEvent['status'];
  size?: 'sm' | 'md';
  withDot?: boolean;
}

export function StatusBadge({ status, size = 'sm', withDot = false }: StatusBadgeProps) {
  const { t } = useTranslation();
  const c = config[status];
  const Icon = c.icon;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border font-bold',
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs',
        c.tone,
      )}
    >
      {withDot && status === 'pending' && (
        <span className="size-1.5 rounded-full bg-current animate-pulse" />
      )}
      <Icon className="size-3" />
      <span>{t(`prizes.status.${status}`)}</span>
    </span>
  );
}
