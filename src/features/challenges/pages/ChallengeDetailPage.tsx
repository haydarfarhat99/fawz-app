import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Clock, Sparkles, CheckCircle2, Tag, ChevronsRight, Trophy, Target } from 'lucide-react';
import { EmptyState } from '@shared/components/EmptyState';
import { Button } from '@shared/components/Button';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { PageHeader } from '@shared/components/PageHeader';
import { Card } from '@shared/components/Card';
import { Skeleton } from '@shared/components/Skeleton';
import { ErrorState } from '@shared/components/ErrorState';
import { usePageTitle } from '@shared/hooks/usePageTitle';
import { useCountdown } from '@shared/hooks/useCountdown';
import { useUIStore } from '@stores/ui.store';
import { formatNumber } from '@core/utils/formatters';
import { pluralizeUnit } from '@core/utils/helpers';
import { cn } from '@core/utils/cn';
import { ProgressBar } from '../components/ProgressBar';
import { ChallengeIcon } from '../components/ChallengeIcon';
import { RewardChip } from '../components/RewardChip';
import { useChallenge } from '../services/challenge.service';

export default function ChallengeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const lang = useUIStore((s) => s.language);
  const { data: challenge, isLoading, isError, error, refetch } = useChallenge(id);
  usePageTitle(t('challenges.detailTitle'));
  const countdown = useCountdown(challenge?.endsAt ?? null);

  if (!id) return <Navigate to="/challenges" replace />;
  const notFound = error instanceof Error && error.message === 'CHALLENGE_NOT_FOUND';

  if (isLoading) {
    return (
      <ScreenWrapper>
        <PageHeader title={<Skeleton className="h-7 w-48" />} back />
        <Card padding="lg" className="mb-4">
          <Skeleton className="size-16 mb-4" rounded="2xl" />
          <Skeleton className="h-7 w-56 mb-2" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-2/3 mb-6" />
          <Skeleton className="h-4 w-full mb-6" />
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
          </div>
        </Card>
      </ScreenWrapper>
    );
  }

  if (notFound) {
    return (
      <ScreenWrapper>
        <PageHeader title={t('challenges.detailTitle')} back />
        <Card variant="elevated" padding="lg">
          <EmptyState
            icon={<Target className="size-9" />}
            title={t('challenges.notFoundTitle')}
            subtitle={t('challenges.notFoundSubtitle')}
            action={
              <Button onClick={() => navigate('/challenges')}>
                {t('challenges.viewAllChallenges')}
              </Button>
            }
          />
        </Card>
      </ScreenWrapper>
    );
  }

  if (isError || !challenge) {
    return (
      <ScreenWrapper>
        <PageHeader title={t('challenges.detailTitle')} back />
        <ErrorState
          title={t('states.error.title')}
          subtitle={t('states.error.subtitle')}
          retryLabel={t('common.retry')}
          onRetry={() => refetch()}
        />
      </ScreenWrapper>
    );
  }

  const pct = (challenge.currentValue / challenge.targetValue) * 100;
  const timeLabel =
    challenge.expired || pct >= 100
      ? null
      : countdown.days > 0
        ? t('challenges.daysLeft', { count: countdown.days })
        : countdown.hours > 0
          ? t('challenges.hoursLeft', { count: countdown.hours })
          : t('challenges.endsSoon');

  return (
    <ScreenWrapper>
      <PageHeader title={t('challenges.detailTitle')} back />

      <Card
        variant={challenge.completed ? 'gold' : 'elevated'}
        padding="lg"
        className="relative overflow-hidden mb-4"
      >
        {challenge.completed && (
          <>
            <div className="absolute -top-12 -end-12 size-48 rounded-full bg-gold-300/40 blur-3xl" />
            <div className="absolute -bottom-12 -start-12 size-48 rounded-full bg-success-500/20 blur-3xl" />
          </>
        )}

        <div className="relative">
          <div className="flex items-start gap-3 mb-5">
            <ChallengeIcon challenge={challenge} size="lg" />
            <div className="flex-1 min-w-0 pt-1">
              <h1 className="text-2xl font-black text-ink-900 leading-tight mb-1">
                {challenge.name}
              </h1>
              <p className="text-sm text-ink-600">{challenge.description}</p>
            </div>
          </div>

          {challenge.categoryFilter && (
            <div className="inline-flex items-center gap-1.5 rounded-full bg-info-50 text-info-500 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider mb-4">
              <Tag className="size-3" />
              {t(`challenges.category.${challenge.categoryFilter}`, challenge.categoryFilter)}
            </div>
          )}

          <div className="mb-2">
            <div className="flex items-baseline justify-between mb-2">
              <div>
                <span className="text-3xl font-black text-ink-900 tabular-nums">
                  {formatNumber(challenge.currentValue, lang)}
                </span>
                <span className="text-xl font-bold text-ink-400 tabular-nums">
                  {' / '}
                  {formatNumber(challenge.targetValue, lang)}
                </span>
                <span className="ms-2 text-xs text-ink-500 font-medium">
                  {pluralizeUnit(challenge.unit, challenge.targetValue, lang)}
                </span>
              </div>
              <span className="text-2xl font-black text-gradient-brand tabular-nums">
                {Math.round(pct)}%
              </span>
            </div>
            <ProgressBar
              current={challenge.currentValue}
              target={challenge.targetValue}
              checkpoints={challenge.checkpoints}
              size="lg"
            />
          </div>

          {challenge.completed ? (
            <div className="mt-5 flex items-center gap-3 rounded-2xl bg-white/60 backdrop-blur p-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-success-500 to-success-600 text-white icon-3d">
                <CheckCircle2 className="size-5" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-ink-900">
                  {t('challenges.completedDate')}
                </div>
                <div className="text-xs text-ink-500">
                  {challenge.completedAt
                    ? new Date(challenge.completedAt).toLocaleDateString(lang === 'ar' ? 'ar-IQ' : 'en-US', {
                        day: 'numeric',
                        month: 'long',
                      })
                    : '—'}
                </div>
              </div>
              <RewardChip
                entries={challenge.rewardEntries}
                cashIqd={challenge.rewardCashIqd}
              />
            </div>
          ) : timeLabel ? (
            <div className="mt-5 flex items-center justify-between rounded-2xl bg-ink-50 p-3">
              <span className="inline-flex items-center gap-2 text-sm font-medium text-ink-700">
                <Clock className="size-4 text-brand-600" />
                {timeLabel}
              </span>
              <span className="text-xs text-ink-500 tabular-nums">
                {String(countdown.days).padStart(2, '0')}:
                {String(countdown.hours).padStart(2, '0')}:
                {String(countdown.minutes).padStart(2, '0')}:
                {String(countdown.seconds).padStart(2, '0')}
              </span>
            </div>
          ) : null}
        </div>
      </Card>

      <Card padding="lg" className="mb-4">
        <h3 className="text-lg font-bold text-ink-900 mb-4 inline-flex items-center gap-2">
          <Trophy className="size-5 text-gold-500" />
          {t('challenges.rewardsTitle')}
        </h3>

        {challenge.checkpoints && challenge.checkpoints.length > 0 ? (
          <div className="space-y-2.5">
            {challenge.checkpoints.map((cp, i) => {
              const reached = challenge.currentValue >= cp.threshold;
              return (
                <div
                  key={i}
                  className={cn(
                    'flex items-center gap-3 rounded-xl border p-3 transition-all',
                    cp.claimed
                      ? 'bg-gradient-to-br from-gold-50 to-gold-100/40 border-gold-300'
                      : reached
                        ? 'bg-gradient-to-br from-brand-50 to-white border-brand-300 animate-pulse-glow'
                        : 'bg-ink-50 border-ink-100',
                  )}
                >
                  <div
                    className={cn(
                      'flex size-9 items-center justify-center rounded-lg shrink-0 icon-3d',
                      cp.claimed
                        ? 'bg-gradient-to-br from-gold-300 to-gold-500 text-ink-900'
                        : reached
                          ? 'bg-gradient-to-br from-brand-500 to-brand-700 text-white'
                          : 'bg-ink-200 text-ink-500',
                    )}
                  >
                    {cp.claimed ? <CheckCircle2 className="size-4" /> : <ChevronsRight className="size-4 rtl:rotate-180" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-ink-900">
                      {t('challenges.atTarget', {
                        target: formatNumber(cp.threshold, lang),
                        unit: pluralizeUnit(challenge.unit, cp.threshold, lang),
                      })}
                    </div>
                    <div className="text-xs text-ink-500">
                      {cp.claimed
                        ? t('challenges.claimed')
                        : reached
                          ? t('challenges.readyToClaim')
                          : t('challenges.locked')}
                    </div>
                  </div>
                  <RewardChip entries={cp.rewardEntries} cashIqd={cp.rewardCashIqd} />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-xl bg-gradient-to-br from-gold-50 to-gold-100/40 border border-gold-200 p-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-gold-300 to-gold-500 text-ink-900 icon-3d">
              <Sparkles className="size-5" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold text-ink-900">
                {t('challenges.completionReward')}
              </div>
              <div className="text-xs text-ink-500">
                {t('challenges.unlockedAtTarget', {
                  target: formatNumber(challenge.targetValue, lang),
                  unit: pluralizeUnit(challenge.unit, challenge.targetValue, lang),
                })}
              </div>
            </div>
            <RewardChip entries={challenge.rewardEntries} cashIqd={challenge.rewardCashIqd} />
          </div>
        )}
      </Card>
    </ScreenWrapper>
  );
}
