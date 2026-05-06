import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Tv, Calendar, Trophy, ArrowRight, Sparkles } from 'lucide-react';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { PageHeader } from '@shared/components/PageHeader';
import { Card } from '@shared/components/Card';
import { Badge } from '@shared/components/Badge';
import { Skeleton } from '@shared/components/Skeleton';
import { ErrorState } from '@shared/components/ErrorState';
import { EmptyState } from '@shared/components/EmptyState';
import { usePageTitle } from '@shared/hooks/usePageTitle';
import { useUIStore } from '@stores/ui.store';
import { formatCompactIQD, formatFawzNumber, formatNumber } from '@core/utils/formatters';
import { useDrawList } from '../services/draw.service';

export default function DrawResultsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const lang = useUIStore((s) => s.language);
  const { data: draws, isLoading, isError, refetch } = useDrawList();
  usePageTitle(t('draws.resultsTitle'));

  return (
    <ScreenWrapper>
      <PageHeader
        title={t('draws.resultsTitle')}
        description={t('draws.resultsSubtitle')}
        actions={
          <button
            type="button"
            onClick={() => navigate('/draws/live')}
            className="hidden md:inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-danger-500 to-danger-600 text-white px-4 py-2.5 text-sm font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
          >
            <span className="relative flex size-2">
              <span className="absolute inset-0 rounded-full bg-white animate-ping opacity-70" />
              <span className="relative inline-flex size-2 rounded-full bg-white" />
            </span>
            {t('draws.watchLive')}
          </button>
        }
      />

      {isLoading ? (
        <div className="grid md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} padding="lg">
              <Skeleton className="h-5 w-24 mb-3" />
              <Skeleton className="h-7 w-40 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-2/3" />
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
      ) : !draws || draws.length === 0 ? (
        <EmptyState
          icon={<Tv className="size-9" />}
          title={t('draws.emptyTitle')}
          subtitle={t('draws.emptySubtitle')}
        />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {draws.map((draw) => (
            <Card
              key={draw.id}
              variant={draw.type === 'monthly' ? 'gold' : 'default'}
              interactive
              onClick={() => navigate(`/draws/${draw.id}`)}
              padding="lg"
              className="group"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <Badge tone={draw.type === 'monthly' ? 'gold' : 'brand'}>
                  <Sparkles className="size-3" />
                  {t(draw.type === 'monthly' ? 'draws.monthlyDraw' : 'draws.weeklyDraw')}
                </Badge>
                <Badge tone="success">{t('draws.finalized')}</Badge>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-ink-500 mb-2">
                <Calendar className="size-3.5" />
                {new Date(draw.drawDate).toLocaleDateString(lang === 'ar' ? 'ar-IQ' : 'en-US', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </div>
              <div className="flex items-baseline gap-2 mb-3">
                <Trophy className="size-5 text-gold-500" />
                <span className="text-2xl font-black text-ink-900">
                  {formatCompactIQD(draw.jackpotIqd, lang)}
                </span>
                <span className="text-xs text-ink-500">{t('draws.jackpotShort')}</span>
              </div>
              {draw.winningNumbers && draw.winningNumbers.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {draw.winningNumbers.map((num) => (
                    <span
                      key={num}
                      dir="ltr"
                      className="inline-flex font-mono text-[10px] tabular-nums text-ink-600 bg-ink-100 rounded-md px-1.5 py-1"
                    >
                      {formatFawzNumber(num)}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex items-center justify-between text-xs text-ink-500 pt-3 border-t border-ink-100">
                <span>{formatNumber(draw.entryPoolSize, lang)} {t('draws.entriesShort')}</span>
                <span className="inline-flex items-center gap-1 text-brand-700 font-semibold group-hover:gap-2 transition-all">
                  {t('common.viewDetails')}
                  <ArrowRight className="size-3.5 rtl:rotate-180" />
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </ScreenWrapper>
  );
}
