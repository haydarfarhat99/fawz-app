import { useTranslation } from 'react-i18next';
import { Compass, Flame, UserPlus, Trophy, Wallet, Star } from 'lucide-react';
import { cn } from '@core/utils/cn';
import type { FawzBadge, FawzBadgeId } from '../types/profile.types';

const config: Record<FawzBadgeId, { icon: typeof Compass; tone: string }> = {
  explorer: { icon: Compass, tone: 'from-info-500 to-brand-700' },
  streaker: { icon: Flame, tone: 'from-danger-500 to-gold-500' },
  inviter: { icon: UserPlus, tone: 'from-success-500 to-brand-600' },
  first_win: { icon: Trophy, tone: 'from-gold-300 to-gold-600' },
  big_spender: { icon: Wallet, tone: 'from-brand-500 to-brand-700' },
  jackpot_dreamer: { icon: Star, tone: 'from-gold-400 via-gold-500 to-danger-500' },
};

interface BadgeChipProps {
  badge: FawzBadge;
}

export function BadgeChip({ badge }: BadgeChipProps) {
  const { t } = useTranslation();
  const c = config[badge.id];
  const Icon = c.icon;

  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center rounded-2xl p-3 text-center transition-all duration-300',
        badge.earned
          ? 'bg-white border border-ink-100 shadow-[0_4px_18px_-6px_rgba(15,23,42,0.12)] hover:-translate-y-1'
          : 'bg-ink-50 border border-ink-100 opacity-60',
      )}
    >
      <div
        className={cn(
          'flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br text-white icon-3d mb-2',
          badge.earned ? c.tone : 'from-ink-300 to-ink-400',
        )}
      >
        <Icon className="size-6" />
      </div>
      <span className="text-[11px] font-bold text-ink-900 leading-tight">
        {t(`profile.badges.${badge.id}.name`)}
      </span>
      {!badge.earned && (
        <span className="mt-1 text-[10px] text-ink-400">{t('profile.locked')}</span>
      )}
    </div>
  );
}
