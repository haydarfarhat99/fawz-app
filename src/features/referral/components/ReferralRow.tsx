import { useTranslation } from 'react-i18next';
import { CheckCircle2, Clock, XCircle, AlertCircle, User } from 'lucide-react';
import { useUIStore } from '@stores/ui.store';
import { Badge } from '@shared/components/Badge';
import { formatRelative } from '@core/utils/formatters';
import { cn } from '@core/utils/cn';
import { RewardChip } from '@features/challenges/components/RewardChip';
import type { ReferralRecord } from '../types/referral.types';

const statusConfig = {
  rewarded: { tone: 'success' as const, icon: CheckCircle2, glow: 'from-success-50 to-white border-success-200' },
  qualified: { tone: 'info' as const, icon: CheckCircle2, glow: 'from-info-50 to-white border-info-500/30' },
  pending: { tone: 'warning' as const, icon: Clock, glow: 'from-warning-500/10 to-white border-warning-500/30' },
  rejected: { tone: 'danger' as const, icon: XCircle, glow: 'from-danger-50 to-white border-danger-200' },
  expired: { tone: 'neutral' as const, icon: AlertCircle, glow: 'from-ink-50 to-white border-ink-200' },
};

interface ReferralRowProps {
  record: ReferralRecord;
}

export function ReferralRow({ record }: ReferralRowProps) {
  const { t } = useTranslation();
  const lang = useUIStore((s) => s.language);
  const config = statusConfig[record.status];
  const StatusIcon = config.icon;
  const dateLabel = record.qualifiedAt
    ? t('referral.qualifiedOn', { date: formatRelative(record.qualifiedAt, lang) })
    : t('referral.invitedOn', { date: formatRelative(record.invitedAt, lang) });

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-2xl border bg-gradient-to-br p-3 md:p-4 transition-all',
        config.glow,
      )}
    >
      <div className="relative flex size-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white icon-3d shadow-md">
        <User className="size-5" />
        <span className={cn(
          'absolute -bottom-0.5 -end-0.5 flex size-5 items-center justify-center rounded-full ring-2 ring-white',
          record.status === 'rewarded' && 'bg-success-500 text-white',
          record.status === 'qualified' && 'bg-info-500 text-white',
          record.status === 'pending' && 'bg-warning-500 text-white',
          record.status === 'rejected' && 'bg-danger-500 text-white',
          record.status === 'expired' && 'bg-ink-400 text-white',
        )}>
          <StatusIcon className="size-3" />
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
          <span dir="ltr" className="font-semibold text-sm text-ink-900 truncate">
            {record.partialName}
          </span>
          <Badge tone={config.tone}>{t(`referral.status.${record.status}`)}</Badge>
        </div>
        <div className="text-xs text-ink-500">{dateLabel}</div>
      </div>
      {record.referrerEntries > 0 && (
        <div className="hidden sm:block">
          <RewardChip entries={record.referrerEntries} cashIqd={record.referrerCashIqd} />
        </div>
      )}
    </div>
  );
}
