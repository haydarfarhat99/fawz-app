import { useTranslation } from 'react-i18next';
import { Trophy, CheckCircle2 } from 'lucide-react';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { PageHeader } from '@shared/components/PageHeader';
import { Card } from '@shared/components/Card';
import { Skeleton } from '@shared/components/Skeleton';
import { EmptyState } from '@shared/components/EmptyState';
import { ErrorState } from '@shared/components/ErrorState';
import { Badge } from '@shared/components/Badge';
import { usePageTitle } from '@shared/hooks/usePageTitle';
import { useUIStore } from '@stores/ui.store';
import { formatCompactIQD, formatDate, formatFawzNumber } from '@core/utils/formatters';
import { useMerchantPrizes } from '../services/merchant.service';

export default function MerchantPrizesPage() {
  const { t } = useTranslation();
  const lang = useUIStore((s) => s.language);
  usePageTitle(t('merchant.prizesTitle'));

  const { data, isLoading, isError, refetch } = useMerchantPrizes();
  const totalCredited =
    data?.filter((p) => p.payoutStatus === 'credited').reduce((s, p) => s + p.prizeIqd, 0) ?? 0;

  return (
    <ScreenWrapper>
      <PageHeader title={t('merchant.prizesTitle')} description={t('merchant.prizesSubtitle')} back />

      {!isLoading && !isError && totalCredited > 0 && (
        <Card variant="gold" padding="lg" className="relative overflow-hidden mb-5">
          <div className="absolute -top-12 -end-12 size-48 rounded-full bg-gold-300/40 blur-3xl" />
          <div className="relative flex items-center gap-4">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-300 to-gold-600 text-ink-900 icon-3d animate-float">
              <Trophy className="size-7" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider font-bold text-gold-700">
                {t('merchant.totalEarned')}
              </div>
              <div className="text-3xl font-black text-gradient-gold tabular-nums">
                {formatCompactIQD(totalCredited, lang)}
              </div>
              <div className="text-xs text-ink-700">{t('merchant.earnedSubtitle')}</div>
            </div>
          </div>
        </Card>
      )}

      {isLoading ? (
        <div className="space-y-2.5">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} padding="md">
              <Skeleton className="size-12 mb-3" rounded="2xl" />
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-3 w-24" />
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
            icon={<Trophy className="size-9" />}
            title={t('merchant.prizesEmptyTitle')}
            subtitle={t('merchant.prizesEmptySubtitle')}
          />
        </Card>
      ) : (
        <div className="space-y-2.5">
          {data.map((p) => (
            <Card key={p.id} padding="md" className="!p-3 md:!p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-300 to-gold-600 text-ink-900 icon-3d">
                  <Trophy className="size-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-lg md:text-xl font-black text-ink-900 tabular-nums">
                      {formatCompactIQD(p.prizeIqd, lang)}
                    </span>
                    <Badge tone={p.payoutStatus === 'credited' ? 'success' : p.payoutStatus === 'pending' ? 'warning' : 'info'}>
                      {p.payoutStatus === 'credited' && <CheckCircle2 className="size-3" />}
                      {t(`prizes.status.${p.payoutStatus}`)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-ink-500 flex-wrap">
                    <span dir="ltr" className="font-mono tabular-nums">
                      {formatFawzNumber(p.fawzNumber)}
                    </span>
                    <span className="size-1 rounded-full bg-ink-300" />
                    <span>{formatDate(p.drawDate, 'PP', lang)}</span>
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
