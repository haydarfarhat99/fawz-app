import { Navigate, useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Trophy, Calendar, Hash, Share2, Sparkles, CheckCircle2, Tv } from 'lucide-react';
import { EmptyState } from '@shared/components/EmptyState';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { PageHeader } from '@shared/components/PageHeader';
import { Card } from '@shared/components/Card';
import { Badge } from '@shared/components/Badge';
import { Button } from '@shared/components/Button';
import { Skeleton } from '@shared/components/Skeleton';
import { ErrorState } from '@shared/components/ErrorState';
import { usePageTitle } from '@shared/hooks/usePageTitle';
import { useUIStore } from '@stores/ui.store';
import { formatCompactIQD, formatFawzNumber, formatNumber } from '@core/utils/formatters';
import { useDrawDetail, useMyDrawResult } from '../services/draw.service';
import { cn } from '@core/utils/cn';

export default function DrawDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const lang = useUIStore((s) => s.language);
  const { data: draw, isLoading, isError, error, refetch } = useDrawDetail(id);
  const { data: myResult } = useMyDrawResult(id);
  usePageTitle(t('draws.detailTitle'));

  if (!id) return <Navigate to="/draws/results" replace />;
  const notFound = error instanceof Error && error.message === 'DRAW_NOT_FOUND';

  if (isLoading) {
    return (
      <ScreenWrapper>
        <PageHeader title={<Skeleton className="h-7 w-40" />} back="/home" />
        <Card padding="lg" className="mb-4">
          <Skeleton className="h-7 w-48 mb-3" />
          <Skeleton className="h-5 w-32 mb-6" />
          <Skeleton className="h-32 w-full" />
        </Card>
      </ScreenWrapper>
    );
  }

  if (notFound) {
    return (
      <ScreenWrapper>
        <PageHeader title={t('draws.detailTitle')} back="/home" />
        <Card variant="elevated" padding="lg">
          <EmptyState
            icon={<Tv className="size-9" />}
            title={t('draws.notFoundTitle')}
            subtitle={t('draws.notFoundSubtitle')}
            action={
              <Button onClick={() => navigate('/draws/results')}>
                {t('draws.viewAllResults')}
              </Button>
            }
          />
        </Card>
      </ScreenWrapper>
    );
  }

  if (isError || !draw) {
    return (
      <ScreenWrapper>
        <PageHeader title={t('draws.detailTitle')} back="/home" />
        <ErrorState
          title={t('states.error.title')}
          subtitle={t('states.error.subtitle')}
          retryLabel={t('common.retry')}
          onRetry={() => refetch()}
        />
      </ScreenWrapper>
    );
  }

  const isWinner = (myResult?.matches.length ?? 0) > 0;
  const totalWon = myResult?.matches.reduce((sum, m) => sum + m.prizeIqd, 0) ?? 0;

  return (
    <ScreenWrapper>
      <PageHeader
        title={t(draw.type === 'monthly' ? 'draws.monthlyDraw' : 'draws.weeklyDraw')}
        description={new Date(draw.drawDate).toLocaleDateString(lang === 'ar' ? 'ar-IQ' : 'en-US', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}
        back="/home"
      />

      {isWinner && (
        <Card variant="gold" padding="lg" className="relative overflow-hidden mb-4">
          <div className="absolute -top-8 -end-8 size-40 rounded-full bg-gold-300/40 blur-3xl" />
          <div className="relative flex items-start gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-300 to-gold-600 text-ink-900 icon-3d shadow-md">
              <Trophy className="size-7" />
            </div>
            <div className="flex-1 min-w-0">
              <Badge tone="gold" className="mb-2">
                <Sparkles className="size-3" />
                {t('draws.youWonBadge')}
              </Badge>
              <h2 className="text-2xl font-black text-ink-900 mb-0.5">
                {formatCompactIQD(totalWon, lang)}
              </h2>
              <p className="text-sm text-ink-700">{t('draws.creditedToWallet')}</p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate(`/winners/win-1/share`)}
              iconStart={<Share2 className="size-4" />}
              className="hidden sm:inline-flex"
            >
              {t('common.shareApp')}
            </Button>
          </div>
        </Card>
      )}

      <Card padding="lg" className="mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-ink-900 inline-flex items-center gap-2">
            <Trophy className="size-5 text-gold-500" />
            {t('draws.winningNumbers')}
          </h3>
          <Badge tone="success">
            <CheckCircle2 className="size-3" />
            {t('draws.finalized')}
          </Badge>
        </div>
        <div className="space-y-3">
          {draw.winningNumbers?.map((num, i) => (
            <div
              key={num}
              dir="ltr"
              className={cn(
                'flex items-center justify-between gap-3 rounded-xl border p-3',
                myResult?.matches.find((m) => m.numberIndex === i)
                  ? 'bg-gradient-to-br from-gold-50 to-gold-100/40 border-gold-300'
                  : 'bg-ink-50 border-ink-100',
              )}
            >
              <span className="text-xs uppercase tracking-wider font-bold text-ink-500">
                #{i + 1}
              </span>
              <span className="font-mono text-base md:text-xl font-bold text-ink-900 tabular-nums">
                {formatFawzNumber(num)}
              </span>
            </div>
          ))}
        </div>
      </Card>

      <Card padding="lg" className="mb-4">
        <div className="grid grid-cols-3 gap-3">
          <div>
            <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-gold-100 to-gold-300 text-gold-700 icon-3d mb-2">
              <Trophy className="size-5" />
            </div>
            <div className="text-[10px] uppercase tracking-wider text-ink-500 font-bold">
              {t('draws.jackpotShort')}
            </div>
            <div className="text-lg font-black text-ink-900">
              {formatCompactIQD(draw.jackpotIqd, lang)}
            </div>
          </div>
          <div>
            <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-100 to-brand-300 text-brand-700 icon-3d mb-2">
              <Hash className="size-5" />
            </div>
            <div className="text-[10px] uppercase tracking-wider text-ink-500 font-bold">
              {t('draws.entries')}
            </div>
            <div className="text-lg font-black text-ink-900 tabular-nums">
              {formatNumber(draw.entryPoolSize, lang)}
            </div>
          </div>
          <div>
            <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-success-50 to-success-500/30 text-success-600 icon-3d mb-2">
              <Calendar className="size-5" />
            </div>
            <div className="text-[10px] uppercase tracking-wider text-ink-500 font-bold">
              {t('draws.aired')}
            </div>
            <div className="text-sm font-bold text-ink-900">
              {new Date(draw.drawDate).toLocaleDateString(lang === 'ar' ? 'ar-IQ' : 'en-US', {
                day: 'numeric',
                month: 'short',
              })}
            </div>
          </div>
        </div>
      </Card>

      <Card padding="lg">
        <h3 className="text-lg font-bold text-ink-900 mb-3 inline-flex items-center gap-2">
          <Hash className="size-5 text-brand-600" />
          {t('draws.myEntries')}
        </h3>
        {myResult && myResult.myEntries.length > 0 ? (
          <div dir="ltr" className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {myResult.myEntries.slice(0, 9).map((entry, i) => {
              const isMatch = myResult.matches.some((m) => m.fawzNumber === entry.fawzNumber);
              return (
                <div
                  key={i}
                  className={cn(
                    'rounded-xl px-3 py-2.5 text-center font-mono text-sm tabular-nums',
                    isMatch
                      ? 'bg-gradient-to-br from-gold-200 to-gold-400 text-ink-900 font-bold shadow-md'
                      : 'bg-ink-50 text-ink-700',
                  )}
                >
                  {formatFawzNumber(entry.fawzNumber)}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-ink-500">{t('draws.noEntriesForDraw')}</p>
        )}
      </Card>
    </ScreenWrapper>
  );
}
