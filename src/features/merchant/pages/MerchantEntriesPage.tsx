import { useTranslation } from 'react-i18next';
import { Hash, Users, Calendar } from 'lucide-react';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { PageHeader } from '@shared/components/PageHeader';
import { Card } from '@shared/components/Card';
import { Skeleton } from '@shared/components/Skeleton';
import { EmptyState } from '@shared/components/EmptyState';
import { ErrorState } from '@shared/components/ErrorState';
import { usePageTitle } from '@shared/hooks/usePageTitle';
import { useUIStore } from '@stores/ui.store';
import { formatCompactIQD, formatFawzNumber, formatRelative } from '@core/utils/formatters';
import { useMerchantEntries } from '../services/merchant.service';

export default function MerchantEntriesPage() {
  const { t } = useTranslation();
  const lang = useUIStore((s) => s.language);
  usePageTitle(t('merchant.entriesTitle'));

  const { data, isLoading, isError, refetch } = useMerchantEntries();

  return (
    <ScreenWrapper>
      <PageHeader title={t('merchant.entriesTitle')} description={t('merchant.entriesSubtitle')} back />

      {isLoading ? (
        <div className="space-y-2.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} padding="md">
              <div className="flex items-center gap-3">
                <Skeleton className="size-11" rounded="2xl" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-40 mb-2" />
                  <Skeleton className="h-3 w-28" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : isError ? (
        <ErrorState
          title={t('states.error.title')}
          subtitle={t('states.error.subtitle')}
          retryLabel={t('common.retry')}
          onRetry={() => refetch()}
        />
      ) : !data || data.length === 0 ? (
        <Card variant="elevated" padding="lg">
          <EmptyState
            icon={<Hash className="size-9" />}
            title={t('merchant.entriesEmptyTitle')}
            subtitle={t('merchant.entriesEmptySubtitle')}
          />
        </Card>
      ) : (
        <div className="space-y-2.5">
          {data.map((entry) => (
            <Card key={entry.id} padding="md" className="!p-3 md:!p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-700 text-white icon-3d">
                  <Users className="size-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span dir="ltr" className="font-mono text-sm md:text-base font-bold text-ink-900 tabular-nums">
                      {formatFawzNumber(entry.fawzNumber)}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-brand-50 text-brand-700 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                      {t('merchant.sharedWithCustomer')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-ink-500 flex-wrap">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="size-3" />
                      {formatRelative(entry.createdAt, lang)}
                    </span>
                    <span className="size-1 rounded-full bg-ink-300" />
                    <span>{formatCompactIQD(entry.customerTransactionAmount, lang)}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </ScreenWrapper>
  );
}
