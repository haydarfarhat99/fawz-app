import { useTranslation } from 'react-i18next';
import { CheckCircle2, Clock, AlertCircle, XCircle, Sparkles } from 'lucide-react';
import { useUIStore } from '@stores/ui.store';
import { Badge } from '@shared/components/Badge';
import { cn } from '@core/utils/cn';
import { formatDate, formatFawzNumber } from '@core/utils/formatters';
import type { Dispute, DisputeStatus } from '../types/dispute.types';

const statusConfig: Record<DisputeStatus, { tone: 'success' | 'warning' | 'info' | 'danger' | 'gold'; icon: typeof CheckCircle2; bg: string }> = {
  pending: { tone: 'warning', icon: Clock, bg: 'from-warning-500/10 to-white border-warning-500/30' },
  in_review: { tone: 'info', icon: AlertCircle, bg: 'from-info-50 to-white border-info-500/30' },
  resolved: { tone: 'success', icon: CheckCircle2, bg: 'from-success-50 to-white border-success-200' },
  auto_resolved: { tone: 'gold', icon: Sparkles, bg: 'from-gold-50 to-white border-gold-200' },
  rejected: { tone: 'danger', icon: XCircle, bg: 'from-danger-50 to-white border-danger-200' },
};

interface DisputeRowProps {
  dispute: Dispute;
}

export function DisputeRow({ dispute }: DisputeRowProps) {
  const { t } = useTranslation();
  const lang = useUIStore((s) => s.language);
  const config = statusConfig[dispute.status];
  const Icon = config.icon;

  return (
    <div className={cn('rounded-2xl border bg-gradient-to-br p-4', config.bg)}>
      <div className="flex items-start gap-3 mb-2">
        <div
          className={cn(
            'flex size-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br icon-3d',
            dispute.status === 'auto_resolved' || dispute.status === 'resolved'
              ? 'from-success-500 to-success-600 text-white'
              : dispute.status === 'rejected'
                ? 'from-danger-500 to-danger-600 text-white'
                : dispute.status === 'in_review'
                  ? 'from-info-500 to-info-500/80 text-white'
                  : 'from-warning-500 to-gold-500 text-white',
          )}
        >
          <Icon className="size-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-sm font-bold text-ink-900">
              {t(`disputes.type.${dispute.type}`)}
            </span>
            <Badge tone={config.tone}>{t(`disputes.status.${dispute.status}`)}</Badge>
          </div>
          <p className="text-xs text-ink-600 line-clamp-2 leading-relaxed">{dispute.description}</p>
        </div>
      </div>

      {(dispute.drawId || dispute.fawzNumber) && (
        <div className="flex flex-wrap gap-2 ms-13 mb-2 text-[11px]">
          {dispute.drawId && (
            <span className="inline-flex items-center gap-1 rounded-md bg-white border border-ink-100 px-2 py-0.5 font-medium text-ink-600">
              {t('disputes.draw')} #{dispute.drawId.replace('draw-', '')}
            </span>
          )}
          {dispute.fawzNumber && (
            <span dir="ltr" className="inline-flex items-center gap-1 rounded-md bg-white border border-ink-100 px-2 py-0.5 font-mono font-medium text-ink-600 tabular-nums">
              {formatFawzNumber(dispute.fawzNumber)}
            </span>
          )}
        </div>
      )}

      {dispute.resolution && (
        <div className="ms-13 rounded-xl bg-white/70 backdrop-blur p-2.5 border border-ink-100 mb-2">
          <div className="text-[10px] uppercase tracking-wider font-bold text-ink-500 mb-0.5">
            {t('disputes.resolution')}
          </div>
          <p className="text-xs text-ink-700 leading-relaxed">{dispute.resolution}</p>
        </div>
      )}

      <div className="flex items-center justify-between ms-13 text-[11px] text-ink-400">
        <span>{t('disputes.submittedOn', { date: formatDate(dispute.submittedAt, 'PP', lang) })}</span>
        {dispute.resolvedAt && (
          <span>{t('disputes.resolvedOn', { date: formatDate(dispute.resolvedAt, 'PP', lang) })}</span>
        )}
      </div>
    </div>
  );
}
