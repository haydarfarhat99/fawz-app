import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Trophy, ChevronDown, ExternalLink } from 'lucide-react';
import { useUIStore } from '@stores/ui.store';
import { cn } from '@core/utils/cn';
import { formatCompactIQD, formatDate, formatFawzNumber } from '@core/utils/formatters';
import { StatusBadge } from './StatusBadge';
import { PayoutTimeline } from './PayoutTimeline';
import type { Prize, PrizeTier } from '../types/prize.types';

const tierConfig: Record<PrizeTier, { tone: string; mark: string; markShort: string }> = {
  last_4: { tone: 'from-brand-400 to-brand-700', mark: 'bg-brand-100 text-brand-700', markShort: '4' },
  last_6: { tone: 'from-info-500 to-info-500/70', mark: 'bg-info-50 text-info-500', markShort: '6' },
  last_8: { tone: 'from-gold-300 to-gold-600', mark: 'bg-gold-100 text-gold-700', markShort: '8' },
  last_10: { tone: 'from-danger-500 via-gold-500 to-brand-700', mark: 'bg-danger-50 text-danger-600', markShort: '★' },
};

interface PrizeRowProps {
  prize: Prize;
  defaultOpen?: boolean;
}

export function PrizeRow({ prize, defaultOpen = false }: PrizeRowProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const lang = useUIStore((s) => s.language);
  const [open, setOpen] = useState(defaultOpen);
  const tier = tierConfig[prize.tier];
  const isCredited = prize.payoutStatus === 'credited';

  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl border bg-white transition-all duration-300',
        isCredited
          ? 'border-gold-200 shadow-[0_4px_18px_-6px_rgba(251,191,36,0.25)]'
          : prize.payoutStatus === 'rejected'
            ? 'border-ink-100 opacity-80'
            : 'border-ink-100',
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 p-3 md:p-4 text-start hover:bg-ink-50/40 transition-colors"
      >
        <div
          className={cn(
            'relative flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white icon-3d',
            tier.tone,
          )}
        >
          <Trophy className="size-5" />
          <span
            className={cn(
              'absolute -bottom-1 -end-1 inline-flex h-4 items-center rounded-full px-1 text-[9px] font-black tabular-nums ring-2 ring-white',
              tier.mark,
            )}
          >
            {tier.markShort}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-lg md:text-xl font-black text-ink-900 tabular-nums leading-none">
              {formatCompactIQD(prize.prizeIqd, lang)}
            </span>
            <StatusBadge status={prize.payoutStatus} withDot />
          </div>
          <div className="flex items-center gap-1.5 text-xs text-ink-500">
            <span>{t(`draws.${prize.drawType}Draw`)}</span>
            <span className="size-1 rounded-full bg-ink-300" />
            <span>{formatDate(prize.drawDate, 'PP', lang)}</span>
          </div>
        </div>

        <ChevronDown
          className={cn(
            'size-5 text-ink-400 shrink-0 transition-transform duration-300',
            open && 'rotate-180',
          )}
        />
      </button>

      {open && (
        <div className="border-t border-ink-100 bg-ink-50/40 p-4 animate-slide-up">
          <div className="grid sm:grid-cols-2 gap-3 mb-4">
            <div className="rounded-xl bg-white p-3 border border-ink-100">
              <div className="text-[10px] uppercase tracking-wider font-bold text-ink-500 mb-1">
                {t('prizes.matchTier')}
              </div>
              <div className="text-sm font-bold text-ink-900">{t(`draws.tier_${prize.tier}`)}</div>
            </div>
            <div className="rounded-xl bg-white p-3 border border-ink-100">
              <div className="text-[10px] uppercase tracking-wider font-bold text-ink-500 mb-1">
                {t('prizes.fawzNumber')}
              </div>
              <div dir="ltr" className="font-mono text-sm font-bold text-ink-900 tabular-nums">
                {formatFawzNumber(prize.fawzNumber)}
              </div>
            </div>
          </div>

          <h4 className="text-xs uppercase tracking-[0.18em] font-bold text-ink-500 mb-3">
            {t('prizes.timeline')}
          </h4>
          <PayoutTimeline events={prize.timeline} reviewReason={prize.reviewReason} />

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/draws/${prize.drawId}`);
            }}
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-800 transition-colors"
          >
            {t('prizes.viewDraw')}
            <ExternalLink className="size-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
