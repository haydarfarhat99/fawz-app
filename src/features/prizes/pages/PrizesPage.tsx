import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Trophy, Wallet } from 'lucide-react';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { PageHeader } from '@shared/components/PageHeader';
import { Tabs } from '@shared/components/Tabs';
import { Card } from '@shared/components/Card';
import { Skeleton } from '@shared/components/Skeleton';
import { EmptyState } from '@shared/components/EmptyState';
import { ErrorState } from '@shared/components/ErrorState';
import { Button } from '@shared/components/Button';
import { usePageTitle } from '@shared/hooks/usePageTitle';
import { LifetimeTotalCard } from '../components/LifetimeTotalCard';
import { PrizeRow } from '../components/PrizeRow';
import { useMyPrizes, usePrizeSummary } from '../services/prize.service';
import type { PayoutStatus } from '../types/prize.types';

type FilterKey = 'all' | PayoutStatus;

export default function PrizesPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<FilterKey>('all');
  usePageTitle(t('prizes.title'));

  const summaryQ = usePrizeSummary();
  const listQ = useMyPrizes();

  const counts = useMemo(() => {
    const c: Record<FilterKey, number> = { all: 0, credited: 0, pending: 0, held: 0, rejected: 0 };
    listQ.data?.forEach((p) => {
      c.all += 1;
      c[p.payoutStatus] += 1;
    });
    return c;
  }, [listQ.data]);

  const filtered = useMemo(() => {
    if (!listQ.data) return [];
    if (filter === 'all') return listQ.data;
    return listQ.data.filter((p) => p.payoutStatus === filter);
  }, [listQ.data, filter]);

  const tabs = [
    { key: 'all', label: t('common.all'), count: counts.all },
    { key: 'credited', label: t('prizes.status.credited'), count: counts.credited },
    { key: 'pending', label: t('prizes.status.pending'), count: counts.pending },
    { key: 'held', label: t('prizes.status.held'), count: counts.held },
  ];

  return (
    <ScreenWrapper>
      <PageHeader title={t('prizes.title')} description={t('prizes.subtitle')} />

      {summaryQ.isLoading ? (
        <Card variant="gold" padding="lg" className="mb-5">
          <Skeleton className="h-5 w-32 mb-3" />
          <Skeleton className="h-12 w-48 mb-2" />
          <Skeleton className="h-4 w-56 mb-5" />
          <div className="grid grid-cols-3 gap-3">
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
          </div>
        </Card>
      ) : summaryQ.data ? (
        <LifetimeTotalCard summary={summaryQ.data} />
      ) : null}

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

      {listQ.isLoading ? (
        <div className="space-y-2.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 rounded-2xl bg-white border border-ink-100 p-4">
              <Skeleton className="size-12" rounded="2xl" />
              <div className="flex-1">
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="size-5" />
            </div>
          ))}
        </div>
      ) : listQ.isError ? (
        <ErrorState
          title={t('states.error.title')}
          subtitle={t('states.error.subtitle')}
          retryLabel={t('common.retry')}
          onRetry={() => listQ.refetch()}
        />
      ) : filtered.length === 0 ? (
        <Card variant="elevated" padding="lg">
          <EmptyState
            icon={<Trophy className="size-9" />}
            title={t('prizes.emptyTitle')}
            subtitle={t('prizes.emptySubtitle')}
            action={
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/home')}
                iconStart={<Wallet className="size-4" />}
              >
                {t('entries.payWithSuperQi')}
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((p, i) => (
            <PrizeRow key={p.id} prize={p} defaultOpen={i === 0 && p.payoutStatus !== 'credited'} />
          ))}
        </div>
      )}
    </ScreenWrapper>
  );
}
