import { useTranslation } from 'react-i18next';
import { Trophy, Clock, CheckCircle2, Lock, XCircle, AlertCircle } from 'lucide-react';
import { useUIStore } from '@stores/ui.store';
import { cn } from '@core/utils/cn';
import { formatDateTime } from '@core/utils/formatters';
import type { PayoutEvent } from '../types/prize.types';

const iconMap = {
  won: Trophy,
  pending: Clock,
  credited: CheckCircle2,
  held: Lock,
  rejected: XCircle,
};

const toneMap = {
  won: 'from-gold-300 to-gold-500 text-ink-900',
  pending: 'from-warning-500 to-warning-600 text-white',
  credited: 'from-success-500 to-success-600 text-white',
  held: 'from-info-500 to-info-500 text-white',
  rejected: 'from-danger-500 to-danger-600 text-white',
};

interface PayoutTimelineProps {
  events: PayoutEvent[];
  reviewReason?: string;
}

export function PayoutTimeline({ events, reviewReason }: PayoutTimelineProps) {
  const { t } = useTranslation();
  const lang = useUIStore((s) => s.language);

  return (
    <div className="space-y-3">
      {reviewReason && (
        <div className="flex items-start gap-2.5 rounded-xl bg-info-50 border border-info-500/20 p-3">
          <AlertCircle className="size-4 text-info-500 shrink-0 mt-0.5" />
          <p className="text-xs text-ink-700 leading-relaxed">{reviewReason}</p>
        </div>
      )}

      <ol className="relative">
        {events.map((ev, i) => {
          const Icon = iconMap[ev.status];
          const tone = toneMap[ev.status];
          const isLast = i === events.length - 1;
          return (
            <li key={i} className="relative flex gap-3 pb-4 last:pb-0">
              {!isLast && (
                <span
                  className="absolute top-9 bottom-0 w-0.5 bg-gradient-to-b from-ink-200 via-ink-200 to-ink-100"
                  style={{ insetInlineStart: '17px' }}
                  aria-hidden="true"
                />
              )}
              <div
                className={cn(
                  'relative z-10 flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br icon-3d',
                  tone,
                )}
              >
                <Icon className="size-4" />
              </div>
              <div className="flex-1 min-w-0 pt-1">
                <div className="flex items-baseline justify-between gap-2 mb-0.5">
                  <span className="text-sm font-bold text-ink-900">
                    {t(`prizes.status.${ev.status}`)}
                  </span>
                  <span className="text-[11px] text-ink-400 tabular-nums shrink-0">
                    {formatDateTime(ev.at, lang)}
                  </span>
                </div>
                {ev.note && <p className="text-xs text-ink-600">{ev.note}</p>}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
