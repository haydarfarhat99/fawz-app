import { useTranslation } from 'react-i18next';
import { Trophy, TrendingUp, Calendar, Sparkles } from 'lucide-react';
import { Coin3D } from '@shared/components/Icon3D';
import { useUIStore } from '@stores/ui.store';
import { Card } from '@shared/components/Card';
import { formatCompactIQD, formatNumber } from '@core/utils/formatters';
import type { PrizeSummary } from '../types/prize.types';

interface LifetimeTotalCardProps {
  summary: PrizeSummary;
}

export function LifetimeTotalCard({ summary }: LifetimeTotalCardProps) {
  const { t } = useTranslation();
  const lang = useUIStore((s) => s.language);

  const tiles = [
    {
      label: t('prizes.totalWins'),
      value: formatNumber(summary.totalWins, lang),
      icon: Trophy,
      tone: 'from-brand-100 to-brand-200 text-brand-700',
    },
    {
      label: t('prizes.biggestWin'),
      value: formatCompactIQD(summary.biggestWinIqd, lang),
      icon: TrendingUp,
      tone: 'from-success-50 to-success-500/30 text-success-600',
    },
    {
      label: t('prizes.thisMonth'),
      value: formatCompactIQD(summary.thisMonthIqd, lang),
      icon: Calendar,
      tone: 'from-info-50 to-info-500/20 text-info-500',
    },
  ];

  return (
    <Card variant="gold" padding="lg" className="relative overflow-hidden mb-5">
      <div className="absolute -top-12 -end-12 size-56 rounded-full bg-gold-300/50 blur-3xl" />
      <div className="absolute -bottom-12 -start-12 size-56 rounded-full bg-brand-300/30 blur-3xl" />

      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/70 backdrop-blur px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gold-700">
            <Sparkles className="size-3" />
            {t('prizes.lifetimeWinnings')}
          </div>
          <div className="animate-float">
            <Coin3D size={56} />
          </div>
        </div>

        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-5xl md:text-6xl font-black text-gradient-gold tabular-nums leading-none">
            {formatNumber(summary.lifetimeIqd, lang)}
          </span>
          <span className="text-base font-bold text-ink-700">{t('currency.iqd')}</span>
        </div>
        <p className="text-sm text-ink-600 mb-5">{t('prizes.creditedToWallet')}</p>

        <div className="grid grid-cols-3 gap-2 md:gap-3">
          {tiles.map((tile) => (
            <div key={tile.label} className="rounded-xl bg-white/70 backdrop-blur p-3">
              <div className={`flex size-7 items-center justify-center rounded-lg bg-gradient-to-br icon-3d mb-1.5 ${tile.tone}`}>
                <tile.icon className="size-3.5" />
              </div>
              <div className="text-[10px] uppercase tracking-wider font-bold text-ink-500 mb-0.5 truncate">
                {tile.label}
              </div>
              <div className="text-base md:text-lg font-black text-ink-900 tabular-nums truncate">
                {tile.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
