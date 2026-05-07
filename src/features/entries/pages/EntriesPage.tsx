import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Hash, Wallet } from 'lucide-react';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { PageHeader } from '@shared/components/PageHeader';
import { Tabs } from '@shared/components/Tabs';
import { Card } from '@shared/components/Card';
import { Skeleton } from '@shared/components/Skeleton';
import { EmptyState } from '@shared/components/EmptyState';
import { ErrorState } from '@shared/components/ErrorState';
import { Button } from '@shared/components/Button';
import { usePageTitle } from '@shared/hooks/usePageTitle';
import { SummaryCard } from '../components/SummaryCard';
import { EntryRow } from '../components/EntryRow';
import { useEntryList, useEntrySummary } from '../services/entry.service';
import type { EntryFilter } from '../types/entry.types';

const PAGE_SIZE = 12;

const VALID_FILTERS: EntryFilter[] = ['all', 'weekly', 'monthly', 'transaction', 'challenge', 'referral', 'retroactive'];

export default function EntriesPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialFilter = (searchParams.get('filter') ?? 'all') as EntryFilter;
  const [filter, setFilter] = useState<EntryFilter>(
    VALID_FILTERS.includes(initialFilter) ? initialFilter : 'all',
  );
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  usePageTitle(t('entries.title'));

  const updateFilter = (next: EntryFilter) => {
    setFilter(next);
    setVisibleCount(PAGE_SIZE);
    if (next === 'all') {
      searchParams.delete('filter');
    } else {
      searchParams.set('filter', next);
    }
    setSearchParams(searchParams, { replace: true });
  };

  const summaryQ = useEntrySummary();
  const listQ = useEntryList(filter);

  const visibleEntries = useMemo(() => listQ.data?.slice(0, visibleCount) ?? [], [listQ.data, visibleCount]);
  const hasMore = (listQ.data?.length ?? 0) > visibleCount;

  const tabs = [
    { key: 'all', label: t('entries.filter.all') },
    { key: 'transaction', label: t('entries.filter.transaction') },
    { key: 'challenge', label: t('entries.filter.challenge') },
    { key: 'referral', label: t('entries.filter.referral') },
  ];

  return (
    <ScreenWrapper>
      <PageHeader
        title={t('entries.title')}
        description={t('entries.subtitle')}
      />

      {summaryQ.isLoading ? (
        <Card variant="gradient" padding="lg" className="mb-5">
          <Skeleton className="h-5 w-28 mb-3" />
          <Skeleton className="h-12 w-40 mb-2" />
          <Skeleton className="h-4 w-56 mb-5" />
          <div className="grid grid-cols-3 gap-3">
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
          </div>
        </Card>
      ) : summaryQ.data ? (
        <SummaryCard summary={summaryQ.data} />
      ) : null}

      <div className="-mx-4 md:mx-0 mb-4 sticky top-16 z-10 bg-gradient-to-b from-ink-50 via-ink-50 to-transparent pt-2 pb-3 px-4 md:px-0 md:static md:bg-transparent md:pt-0">
        <div className="overflow-x-auto -mx-1 px-1">
          <Tabs
            variant="pills"
            items={tabs}
            active={filter}
            onChange={(key) => updateFilter(key as EntryFilter)}
            className="!flex-nowrap whitespace-nowrap"
          />
        </div>
      </div>

      {listQ.isLoading ? (
        <div className="space-y-2.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 rounded-2xl bg-white border border-ink-100 p-3 md:p-4">
              <Skeleton className="size-12" rounded="2xl" />
              <div className="flex-1">
                <Skeleton className="h-5 w-40 mb-2" />
                <Skeleton className="h-3 w-28" />
              </div>
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
      ) : !listQ.data || listQ.data.length === 0 ? (
        <Card variant="elevated" padding="lg">
          <EmptyState
            icon={<Hash className="size-9" />}
            title={t('entries.emptyTitle')}
            subtitle={t('entries.emptySubtitle')}
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
        <>
          <div className="space-y-2.5">
            {visibleEntries.map((entry) => (
              <EntryRow key={entry.id} entry={entry} />
            ))}
          </div>
          {hasMore && (
            <div className="mt-5 flex justify-center">
              <Button
                variant="outline"
                size="md"
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
              >
                {t('entries.loadMore')}
              </Button>
            </div>
          )}
        </>
      )}
    </ScreenWrapper>
  );
}
