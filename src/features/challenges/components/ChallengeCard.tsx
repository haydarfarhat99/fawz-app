import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Clock, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useUIStore } from '@stores/ui.store';
import { cn } from '@core/utils/cn';
import { formatNumber } from '@core/utils/formatters';
import { pluralizeUnit } from '@core/utils/helpers';
import { useCountdown } from '@shared/hooks/useCountdown';
import { Card } from '@shared/components/Card';
import { ProgressBar } from './ProgressBar';
import { ChallengeIcon } from './ChallengeIcon';
import { RewardChip } from './RewardChip';
import type { Challenge } from '../types/challenge.types';

interface ChallengeCardProps {
  challenge: Challenge;
  compact?: boolean;
}

export function ChallengeCard({ challenge, compact = false }: ChallengeCardProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const lang = useUIStore((s) => s.language);
  const countdown = useCountdown(challenge.endsAt);

  const pct = (challenge.currentValue / challenge.targetValue) * 100;
  const nearComplete = pct >= 80 && pct < 100;

  const timeLabel = countdown.days > 0
    ? t('challenges.daysLeft', { count: countdown.days })
    : countdown.hours > 0
      ? t('challenges.hoursLeft', { count: countdown.hours })
      : t('challenges.endsSoon');

  return (
    <Card
      variant={challenge.completed ? 'default' : nearComplete ? 'gold' : 'default'}
      interactive
      padding="md"
      onClick={() => navigate(`/challenges/${challenge.id}`)}
      className={cn(
        'group relative overflow-hidden',
        challenge.completed && 'opacity-90',
      )}
    >
      {challenge.completed && (
        <div className="absolute top-3 end-3">
          <span className="inline-flex items-center gap-1 rounded-full bg-success-500/15 text-success-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
            <CheckCircle2 className="size-3" />
            {t('challenges.complete')}
          </span>
        </div>
      )}
      {nearComplete && !challenge.completed && (
        <div className="absolute top-3 end-3">
          <span className="inline-flex items-center gap-1 rounded-full bg-gold-200 text-gold-800 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider animate-pulse">
            {t('challenges.almostThere')}
          </span>
        </div>
      )}

      <div className="flex items-start gap-3 mb-4">
        <ChallengeIcon challenge={challenge} size={compact ? 'sm' : 'md'} />
        <div className="flex-1 min-w-0 pe-6">
          <h3 className="font-bold text-ink-900 leading-tight mb-0.5">
            {challenge.name}
          </h3>
          <p className="text-xs text-ink-500 line-clamp-2">{challenge.description}</p>
        </div>
        <ChevronRight className="size-4 text-ink-300 rtl:rotate-180 mt-1.5 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
      </div>

      <div className="mb-3">
        <div className="flex items-baseline justify-between mb-1.5">
          <span className="text-xs font-semibold text-ink-700 tabular-nums">
            {formatNumber(challenge.currentValue, lang)} / {formatNumber(challenge.targetValue, lang)}
            <span className="text-ink-400 ms-1.5 font-normal">
              {pluralizeUnit(challenge.unit, challenge.targetValue, lang)}
            </span>
          </span>
          <span className="text-xs font-bold text-ink-900 tabular-nums">
            {Math.round(pct)}%
          </span>
        </div>
        <ProgressBar
          current={challenge.currentValue}
          target={challenge.targetValue}
          checkpoints={challenge.checkpoints}
          size="md"
        />
      </div>

      <div className="flex items-center justify-between gap-2 pt-2">
        <RewardChip entries={challenge.rewardEntries} cashIqd={challenge.rewardCashIqd} />
        {!challenge.completed && (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-ink-500">
            <Clock className="size-3" />
            {timeLabel}
          </span>
        )}
      </div>
    </Card>
  );
}
