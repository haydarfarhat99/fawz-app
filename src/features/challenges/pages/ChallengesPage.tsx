import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Trophy, ChevronDown, Target } from 'lucide-react';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { PageHeader } from '@shared/components/PageHeader';
import { Card } from '@shared/components/Card';
import { Skeleton } from '@shared/components/Skeleton';
import { EmptyState } from '@shared/components/EmptyState';
import { ErrorState } from '@shared/components/ErrorState';
import { usePageTitle } from '@shared/hooks/usePageTitle';
import { cn } from '@core/utils/cn';
import { useAuth } from '@shared/hooks/useAuth';
import { ChallengeCard } from '../components/ChallengeCard';
import { OnboardingHeader } from '../components/OnboardingHeader';
import { useChallenges, useOnboarding } from '../services/challenge.service';

export default function ChallengesPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [completedOpen, setCompletedOpen] = useState(false);
  usePageTitle(t('challenges.title'));

  const challengesQ = useChallenges();
  const onboardingQ = useOnboarding();

  const showOnboarding = !!user?.isNew;

  const { active, completed } = useMemo(() => {
    const all = challengesQ.data ?? [];
    return {
      active: all.filter((c) => !c.completed && !c.expired).sort((a, b) =>
        new Date(a.endsAt).getTime() - new Date(b.endsAt).getTime(),
      ),
      completed: all.filter((c) => c.completed),
    };
  }, [challengesQ.data]);

  return (
    <ScreenWrapper>
      <PageHeader
        title={t('challenges.title')}
        description={t('challenges.subtitle')}
      />

      {showOnboarding && onboardingQ.data && (
        <OnboardingHeader progress={onboardingQ.data} />
      )}

      {challengesQ.isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <Card key={i} padding="lg">
              <div className="flex items-start gap-3 mb-4">
                <Skeleton className="size-12" rounded="2xl" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-40 mb-2" />
                  <Skeleton className="h-3 w-full mb-1" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
              <Skeleton className="h-3 w-full mb-3" />
              <div className="flex justify-between">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
            </Card>
          ))}
        </div>
      ) : challengesQ.isError ? (
        <ErrorState
          title={t('states.error.title')}
          subtitle={t('states.error.subtitle')}
          retryLabel={t('common.retry')}
          onRetry={() => challengesQ.refetch()}
        />
      ) : active.length === 0 && completed.length === 0 ? (
        <Card variant="elevated" padding="lg">
          <EmptyState
            icon={<Target className="size-9" />}
            title={t('challenges.emptyTitle')}
            subtitle={t('challenges.emptySubtitle')}
          />
        </Card>
      ) : (
        <>
          {active.length > 0 && (
            <>
              <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-ink-500 mb-3 mt-2 flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-gradient-to-r from-brand-500 to-gold-400 animate-pulse" />
                {t('challenges.activeChallenges')}
                <span className="text-ink-400 font-medium normal-case tracking-normal">
                  · {active.length}
                </span>
              </h2>
              <div className="space-y-3">
                {active.map((c) => (
                  <ChallengeCard key={c.id} challenge={c} />
                ))}
              </div>
            </>
          )}

          {completed.length > 0 && (
            <div className="mt-8">
              <button
                type="button"
                onClick={() => setCompletedOpen((v) => !v)}
                className="w-full flex items-center justify-between rounded-2xl bg-white border border-ink-100 px-4 py-3 hover:border-brand-200 transition-colors"
              >
                <span className="inline-flex items-center gap-2.5">
                  <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-success-50 to-success-500/30 text-success-600 icon-3d">
                    <Trophy className="size-4" />
                  </span>
                  <span className="text-start">
                    <span className="block font-bold text-ink-900 text-sm">
                      {t('challenges.completedTitle')}
                    </span>
                    <span className="block text-xs text-ink-500">
                      {t('challenges.completedSubtitle', { count: completed.length })}
                    </span>
                  </span>
                </span>
                <ChevronDown
                  className={cn(
                    'size-5 text-ink-400 transition-transform duration-300',
                    completedOpen && 'rotate-180',
                  )}
                />
              </button>
              {completedOpen && (
                <div className="space-y-3 mt-3 animate-slide-up">
                  {completed.map((c) => (
                    <ChallengeCard key={c.id} challenge={c} />
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </ScreenWrapper>
  );
}
