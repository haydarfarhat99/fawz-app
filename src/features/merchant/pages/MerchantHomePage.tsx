import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Store,
  Hash,
  Trophy,
  ShieldCheck,
  ShieldAlert,
  Clock,
  ArrowRight,
  TrendingUp,
  Calendar,
} from 'lucide-react';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { PageHeader } from '@shared/components/PageHeader';
import { Card } from '@shared/components/Card';
import { Skeleton } from '@shared/components/Skeleton';
import { ErrorState } from '@shared/components/ErrorState';
import { Badge } from '@shared/components/Badge';
import { usePageTitle } from '@shared/hooks/usePageTitle';
import { useCountdown } from '@shared/hooks/useCountdown';
import { useUIStore } from '@stores/ui.store';
import { formatCompactIQD, formatNumber } from '@core/utils/formatters';
import { cn } from '@core/utils/cn';
import { useMerchantSummary } from '../services/merchant.service';
import { useCurrentDraw } from '@features/draws/services/draw.service';

export default function MerchantHomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const lang = useUIStore((s) => s.language);
  usePageTitle(t('merchant.title'));

  const { data: summary, isLoading, isError, refetch } = useMerchantSummary();
  const { data: nextDraw } = useCurrentDraw();
  const countdown = useCountdown(nextDraw?.drawDate ?? null);

  if (isLoading) {
    return (
      <ScreenWrapper>
        <PageHeader title={t('merchant.title')} />
        <Card variant="gradient" padding="lg" className="mb-5">
          <Skeleton className="h-6 w-32 mb-3" />
          <Skeleton className="h-12 w-48 mb-4" />
          <Skeleton className="h-20 w-full" />
        </Card>
      </ScreenWrapper>
    );
  }

  if (isError || !summary) {
    return (
      <ScreenWrapper>
        <PageHeader title={t('merchant.title')} />
        <ErrorState
          title={t('states.error.title')}
          subtitle={t('states.error.subtitle')}
          retryLabel={t('common.retry')}
          onRetry={() => refetch()}
        />
      </ScreenWrapper>
    );
  }

  const volumePct = Math.min(100, (summary.rolling30dVolumeIqd / summary.minMonthlyVolumeIqd) * 100);
  const txPct = Math.min(100, (summary.rolling30dTransactions / summary.minMonthlyTransactions) * 100);

  return (
    <ScreenWrapper>
      <PageHeader title={summary.storeName} description={summary.category} />

      <Card variant="gradient" padding="lg" className="relative overflow-hidden mb-5">
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <Badge tone={summary.isEligible ? 'success' : 'warning'} size="md">
              {summary.isEligible ? <ShieldCheck className="size-3.5" /> : <ShieldAlert className="size-3.5" />}
              {t(summary.isEligible ? 'merchant.eligible' : 'merchant.ineligible')}
            </Badge>
            <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white icon-3d">
              <Store className="size-6" />
            </div>
          </div>

          <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-700 mb-1">
            {t('merchant.thisWeekEntries')}
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-5xl md:text-6xl font-black text-gradient-brand tabular-nums leading-none">
              {formatNumber(summary.weeklyEntryCount, lang)}
            </span>
            <span className="text-base font-bold text-ink-700">
              {t('entries.fawzNumbers')}
            </span>
          </div>
          <p className="text-sm text-ink-600 mb-5">{t('merchant.fromCustomers')}</p>

          {nextDraw && countdown.totalSeconds > 0 && (
            <div className="rounded-2xl bg-white/70 backdrop-blur p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="size-4 text-brand-700" />
                <span className="text-[11px] uppercase tracking-wider font-bold text-ink-600">
                  {t('merchant.nextDraw')}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: t('time.days', { count: 0 }).split(' ')[1] ?? 'D', value: countdown.days },
                  { label: 'H', value: countdown.hours },
                  { label: 'M', value: countdown.minutes },
                  { label: 'S', value: countdown.seconds },
                ].map((s, i) => (
                  <div key={i} className="text-center">
                    <div className="text-2xl font-black text-ink-900 tabular-nums">
                      {String(s.value).padStart(2, '0')}
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-ink-500">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      <Card padding="lg" className="mb-4">
        <h2 className="text-lg font-bold text-ink-900 mb-4 inline-flex items-center gap-2">
          <TrendingUp className="size-5 text-brand-600" />
          {t('merchant.eligibilityProgress')}
        </h2>

        <ProgressMetric
          label={t('merchant.monthlyVolume')}
          current={summary.rolling30dVolumeIqd}
          target={summary.minMonthlyVolumeIqd}
          format={(v) => formatCompactIQD(v, lang)}
          pct={volumePct}
        />
        <div className="h-3" />
        <ProgressMetric
          label={t('merchant.monthlyTransactions')}
          current={summary.rolling30dTransactions}
          target={summary.minMonthlyTransactions}
          format={(v) => formatNumber(v, lang)}
          pct={txPct}
        />

        <div className="mt-4 flex items-center gap-2 rounded-xl bg-info-50 border border-info-500/20 p-3">
          <Calendar className="size-4 text-info-500 shrink-0" />
          <p className="text-xs text-ink-700">
            {t('merchant.nextRecheck', {
              date: new Date(summary.nextEligibilityRecheckAt).toLocaleDateString(
                lang === 'ar' ? 'ar-IQ' : 'en-US',
                { day: 'numeric', month: 'long' },
              ),
            })}
          </p>
        </div>
      </Card>

      <div className="grid sm:grid-cols-2 gap-3">
        <Card interactive padding="md" onClick={() => navigate('/merchant/entries')} className="group">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-100 to-brand-200 text-brand-700 icon-3d">
              <Hash className="size-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-ink-900">{t('merchant.entriesShortcut')}</div>
              <div className="text-xs text-ink-500">{t('merchant.entriesShortcutDesc')}</div>
            </div>
            <ArrowRight className="size-4 text-ink-400 rtl:rotate-180 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform" />
          </div>
        </Card>
        <Card interactive padding="md" onClick={() => navigate('/merchant/prizes')} className="group">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-200 to-gold-400 text-gold-700 icon-3d">
              <Trophy className="size-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-ink-900">{t('merchant.prizesShortcut')}</div>
              <div className="text-xs text-ink-500">{t('merchant.prizesShortcutDesc')}</div>
            </div>
            <ArrowRight className="size-4 text-ink-400 rtl:rotate-180 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform" />
          </div>
        </Card>
      </div>
    </ScreenWrapper>
  );
}

function ProgressMetric({
  label,
  current,
  target,
  pct,
  format,
}: {
  label: string;
  current: number;
  target: number;
  pct: number;
  format: (v: number) => string;
}) {
  const reached = current >= target;
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-sm font-medium text-ink-700">{label}</span>
        <span className="text-xs font-bold text-ink-900 tabular-nums">
          {format(current)} / {format(target)}
        </span>
      </div>
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-ink-100">
        <div
          className={cn(
            'h-full rounded-full bg-gradient-to-r transition-all duration-700',
            reached ? 'from-success-500 to-success-600' : 'from-brand-500 to-brand-700',
          )}
          style={{ width: `${pct}%` }}
        >
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
            style={{ backgroundSize: '200% 100%', animation: 'shimmer 2.4s linear infinite' }}
          />
        </div>
      </div>
    </div>
  );
}
