import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Users } from 'lucide-react';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { PageHeader } from '@shared/components/PageHeader';
import { Tabs } from '@shared/components/Tabs';
import { Card } from '@shared/components/Card';
import { Skeleton } from '@shared/components/Skeleton';
import { EmptyState } from '@shared/components/EmptyState';
import { ErrorState } from '@shared/components/ErrorState';
import { usePageTitle } from '@shared/hooks/usePageTitle';
import { ReferralRow } from '../components/ReferralRow';
import { useReferralHistory } from '../services/referral.service';
import type { ReferralStatus } from '../types/referral.types';

type FilterKey = 'all' | ReferralStatus;

export default function ReferralHistoryPage() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<FilterKey>('all');
  usePageTitle(t('referral.historyTitle'));

  const { data, isLoading, isError, refetch } = useReferralHistory();

  const filtered = useMemo(() => {
    if (!data) return [];
    if (filter === 'all') return data;
    return data.filter((r) => r.status === filter);
  }, [data, filter]);

  const counts = useMemo(() => {
    const c: Record<FilterKey, number> = {
      all: data?.length ?? 0,
      rewarded: 0,
      qualified: 0,
      pending: 0,
      rejected: 0,
      expired: 0,
    };
    data?.forEach((r) => (c[r.status] += 1));
    return c;
  }, [data]);

  const tabs = [
    { key: 'all', label: t('common.all'), count: counts.all },
    { key: 'rewarded', label: t('referral.status.rewarded'), count: counts.rewarded },
    { key: 'qualified', label: t('referral.status.qualified'), count: counts.qualified },
    { key: 'pending', label: t('referral.status.pending'), count: counts.pending },
  ];

  return (
    <ScreenWrapper>
      <PageHeader
        title={t('referral.historyTitle')}
        description={t('referral.historySubtitle')}
        back
      />

      <div className="-mx-4 md:mx-0 mb-4 sticky top-16 z-10 bg-gradient-to-b from-ink-50 via-ink-50 to-transparent pt-2 pb-3 px-4 md:px-0 md:static md:bg-transparent md:pt-0">
        <div className="overflow-x-auto -mx-1 px-1">
          <Tabs
            variant="pills"
            items={tabs}
            active={filter}
            onChange={(k) => setFilter(k as FilterKey)}
            className="!flex-nowrap whitespace-nowrap"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 rounded-2xl bg-white border border-ink-100 p-4">
              <Skeleton className="size-11" rounded="2xl" />
              <div className="flex-1">
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <ErrorState
          title={t('states.error.title')}
          subtitle={t('states.error.subtitle')}
          retryLabel={t('common.retry')}
          onRetry={() => refetch()}
        />
      ) : filtered.length === 0 ? (
        <Card variant="elevated" padding="lg">
          <EmptyState
            icon={<Users className="size-9" />}
            title={t('referral.emptyTitle')}
            subtitle={t('referral.emptySubtitle')}
          />
        </Card>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((r) => (
            <ReferralRow key={r.id} record={r} />
          ))}
        </div>
      )}
    </ScreenWrapper>
  );
}
