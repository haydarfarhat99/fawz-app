import { useTranslation } from 'react-i18next';
import { UserPlus, Hash, Coins } from 'lucide-react';
import { useUIStore } from '@stores/ui.store';
import { Card } from '@shared/components/Card';
import { formatCompactIQD, formatNumber } from '@core/utils/formatters';
import type { ReferralStats } from '../types/referral.types';

interface ReferralStatsRowProps {
  stats: ReferralStats;
}

export function ReferralStatsRow({ stats }: ReferralStatsRowProps) {
  const { t } = useTranslation();
  const lang = useUIStore((s) => s.language);

  const tiles = [
    {
      label: t('referral.thisMonth'),
      value: `${formatNumber(stats.monthCount, lang)} / ${formatNumber(stats.monthlyCap, lang)}`,
      icon: UserPlus,
      tone: 'from-brand-100 to-brand-200 text-brand-700',
    },
    {
      label: t('referral.entriesEarned'),
      value: `+${formatNumber(stats.entriesEarned, lang)}`,
      icon: Hash,
      tone: 'from-info-50 to-info-500/20 text-info-500',
    },
    {
      label: t('referral.cashEarned'),
      value: formatCompactIQD(stats.cashEarnedIqd, lang),
      icon: Coins,
      tone: 'from-gold-100 to-gold-300 text-gold-700',
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-2 md:gap-3">
      {tiles.map((tile) => (
        <Card key={tile.label} padding="md" className="!p-3 md:!p-4">
          <div className={`flex size-9 md:size-10 items-center justify-center rounded-xl bg-gradient-to-br icon-3d mb-2 ${tile.tone}`}>
            <tile.icon className="size-4 md:size-5" />
          </div>
          <div className="text-[10px] md:text-xs uppercase tracking-wider font-bold text-ink-500 mb-0.5 truncate">
            {tile.label}
          </div>
          <div className="text-base md:text-xl font-black text-ink-900 tabular-nums truncate">
            {tile.value}
          </div>
        </Card>
      ))}
    </div>
  );
}
