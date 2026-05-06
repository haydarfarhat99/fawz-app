import { useTranslation } from 'react-i18next';
import type { ComponentType } from 'react';
import { Sparkles } from 'lucide-react';
import { Coin3D, Trophy3D, TrendingUp3D, Calendar3D } from '@shared/components/Icon3D';
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

  const tiles: Array<{
    label: string;
    value: string;
    Icon: ComponentType<{ size?: number; tone?: 'default' | 'teal' | 'gold' }>;
    tone?: 'default' | 'teal' | 'gold';
  }> = [
    {
      label: t('prizes.totalWins'),
      value: formatNumber(summary.totalWins, lang),
      Icon: Trophy3D,
    },
    {
      label: t('prizes.biggestWin'),
      value: formatCompactIQD(summary.biggestWinIqd, lang),
      Icon: TrendingUp3D,
    },
    {
      label: t('prizes.thisMonth'),
      value: formatCompactIQD(summary.thisMonthIqd, lang),
      Icon: Calendar3D,
      tone: 'teal',
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
          <div className="relative animate-float">
            <div className="absolute inset-0 -z-10 blur-2xl bg-gold-300/60 rounded-full scale-150" />
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
              <div className="mb-1.5">
                <tile.Icon size={28} tone={tile.tone} />
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
