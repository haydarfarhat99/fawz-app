import { useTranslation } from 'react-i18next';
import { Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { useUIStore } from '@stores/ui.store';
import { Card } from '@shared/components/Card';
import { Avatar } from '@shared/components/Avatar';
import { formatCompactIQD, formatNumber } from '@core/utils/formatters';
import { cn } from '@core/utils/cn';
import type { AccountTier, FawzProfile } from '../types/profile.types';

interface ProfileHeroProps {
  profile: FawzProfile;
}

const tierConfig: Record<AccountTier, { icon: typeof Sparkles; tone: string; label: string }> = {
  starter: { icon: Sparkles, tone: 'from-info-500 to-info-500/70', label: 'Starter' },
  member: { icon: Zap, tone: 'from-brand-500 to-brand-700', label: 'Member' },
  plus: { icon: ShieldCheck, tone: 'from-gold-400 to-gold-600', label: 'Plus' },
};

export function ProfileHero({ profile }: ProfileHeroProps) {
  const { t } = useTranslation();
  const lang = useUIStore((s) => s.language);
  const tier = tierConfig[profile.tier];
  const TierIcon = tier.icon;

  return (
    <Card variant="gradient" padding="lg" className="relative overflow-hidden mb-5">
      <div className="absolute -top-12 -end-12 size-56 rounded-full bg-brand-300/40 blur-3xl" />
      <div className="absolute -bottom-12 -start-12 size-56 rounded-full bg-gold-300/30 blur-3xl" />

      <div className="relative">
        <div className="flex items-start gap-4 mb-5">
          <div className="relative">
            <Avatar name={profile.displayName} src={profile.avatarUrl} size="xl" />
            <span
              className={cn(
                'absolute -bottom-1 -end-1 inline-flex size-7 items-center justify-center rounded-full bg-gradient-to-br ring-2 ring-white text-white shadow-md',
                tier.tone,
              )}
            >
              <TierIcon className="size-3.5" />
            </span>
          </div>
          <div className="flex-1 min-w-0 pt-2">
            <div className="flex items-center gap-1.5 rounded-full bg-white/70 backdrop-blur w-fit px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-700 mb-1.5">
              <TierIcon className="size-3" />
              {t(`profile.tier.${profile.tier}`, tier.label)}
            </div>
            <h1 className="text-xl md:text-2xl font-black text-ink-900 leading-tight truncate">
              {profile.displayName}
            </h1>
            <p className="text-xs text-ink-500 truncate">{profile.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 md:gap-3">
          <div className="rounded-xl bg-white/70 backdrop-blur p-3">
            <div className="text-[10px] uppercase tracking-wider font-bold text-ink-500 mb-0.5">
              {t('profile.stats.entries')}
            </div>
            <div className="text-base md:text-xl font-black text-ink-900 tabular-nums">
              {formatNumber(profile.lifetimeEntries, lang)}
            </div>
          </div>
          <div className="rounded-xl bg-white/70 backdrop-blur p-3">
            <div className="text-[10px] uppercase tracking-wider font-bold text-ink-500 mb-0.5">
              {t('profile.stats.wins')}
            </div>
            <div className="text-base md:text-xl font-black text-ink-900 tabular-nums">
              {formatNumber(profile.totalWins, lang)}
            </div>
          </div>
          <div className="rounded-xl bg-white/70 backdrop-blur p-3">
            <div className="text-[10px] uppercase tracking-wider font-bold text-ink-500 mb-0.5">
              {t('profile.stats.winnings')}
            </div>
            <div className="text-base md:text-xl font-black text-ink-900 tabular-nums">
              {formatCompactIQD(profile.totalWinningsIqd, lang)}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
