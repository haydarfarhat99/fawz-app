import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronRight, Sparkles, AlertCircle, Users, Gift } from 'lucide-react';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { PageHeader } from '@shared/components/PageHeader';
import { Card } from '@shared/components/Card';
import { Skeleton } from '@shared/components/Skeleton';
import { ErrorState } from '@shared/components/ErrorState';
import { Button } from '@shared/components/Button';
import { usePageTitle } from '@shared/hooks/usePageTitle';
import { GoldenTicketCard } from '../components/GoldenTicketCard';
import { ShareButtons } from '../components/ShareButtons';
import { ReferralStatsRow } from '../components/ReferralStatsRow';
import { useReferralLink, useReferralStats } from '../services/referral.service';

export default function ReferralPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  usePageTitle(t('referral.title'));

  const linkQ = useReferralLink();
  const statsQ = useReferralStats();

  const isLoading = linkQ.isLoading || statsQ.isLoading;
  const isError = linkQ.isError || statsQ.isError;

  const showCapWarning =
    statsQ.data && statsQ.data.monthCount >= statsQ.data.monthlyCap - 2;

  return (
    <ScreenWrapper>
      <PageHeader title={t('referral.title')} description={t('referral.subtitle')} />

      <div className="mb-5 flex items-start gap-3 rounded-2xl bg-gradient-to-br from-brand-50 to-gold-50 border border-brand-200 p-4">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white icon-3d">
          <Gift className="size-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-ink-900 mb-0.5">{t('referral.howItWorksTitle')}</div>
          <p className="text-xs text-ink-600 leading-relaxed">
            {t('referral.howItWorksDesc')}
          </p>
        </div>
      </div>

      {isLoading ? (
        <Card padding="lg" className="mb-5">
          <Skeleton className="h-32 w-full mb-4" />
          <Skeleton className="h-12 w-full" />
        </Card>
      ) : isError ? (
        <ErrorState
          title={t('states.error.title')}
          subtitle={t('states.error.subtitle')}
          retryLabel={t('common.retry')}
          onRetry={() => {
            linkQ.refetch();
            statsQ.refetch();
          }}
        />
      ) : (
        <>
          {linkQ.data && (
            <div className="mb-6">
              <GoldenTicketCard link={linkQ.data} />
            </div>
          )}

          <div className="mb-5">
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-ink-500 mb-3 inline-flex items-center gap-2">
              <Sparkles className="size-3.5 text-brand-500" />
              {t('referral.shareDirect')}
            </h2>
            {linkQ.data && <ShareButtons url={linkQ.data.url} message={t('referral.shareMessage')} />}
          </div>

          {showCapWarning && (
            <div className="mb-5 flex items-start gap-3 rounded-2xl bg-warning-500/10 border border-warning-500/30 p-4">
              <AlertCircle className="size-5 text-warning-600 shrink-0 mt-0.5" />
              <div className="text-sm">
                <div className="font-bold text-ink-900 mb-0.5">
                  {t('referral.nearCapTitle')}
                </div>
                <div className="text-xs text-ink-600">
                  {t('referral.nearCapDesc', {
                    count: statsQ.data?.monthCount ?? 0,
                    cap: statsQ.data?.monthlyCap ?? 10,
                  })}
                </div>
              </div>
            </div>
          )}

          <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-ink-500 mb-3 inline-flex items-center gap-2">
            <Users className="size-3.5 text-brand-500" />
            {t('referral.yourImpact')}
          </h2>

          {statsQ.data && (
            <div className="mb-5">
              <ReferralStatsRow stats={statsQ.data} />
            </div>
          )}

          <Card padding="md" interactive onClick={() => navigate('/referral/history')} className="group flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-ink-100 to-ink-200 text-ink-700 icon-3d">
              <Users className="size-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-ink-900">{t('referral.viewHistory')}</div>
              <div className="text-xs text-ink-500">
                {t('referral.totalCount', { count: statsQ.data?.totalCount ?? 0 })}
              </div>
            </div>
            <ChevronRight className="size-5 text-ink-400 rtl:rotate-180 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform" />
          </Card>

          <div className="mt-6">
            <Button
              variant="ghost"
              onClick={() => navigate('/home')}
              fullWidth
              className="!justify-center"
            >
              {t('common.back')}
            </Button>
          </div>
        </>
      )}
    </ScreenWrapper>
  );
}
