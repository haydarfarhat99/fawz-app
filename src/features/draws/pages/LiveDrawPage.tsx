import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Loader2, Tv, Calendar, Volume2, VolumeX, Trophy, Heart } from 'lucide-react';
import { useUIStore } from '@stores/ui.store';
import { usePageTitle } from '@shared/hooks/usePageTitle';
import { Badge } from '@shared/components/Badge';
import { useNetworkStatus } from '@shared/hooks/useNetworkStatus';
import { ErrorState } from '@shared/components/ErrorState';
import { formatNumber } from '@core/utils/formatters';
import { isSoundEnabled, setSoundEnabled } from '@core/utils/sound';
import { DigitGrid } from '../components/DigitGrid';
import { ConnectionStatus } from '../components/ConnectionStatus';
import { JackpotTicker } from '../components/JackpotTicker';
import { ViewerCount } from '../components/ViewerCount';
import { WinnerOverlay } from '../components/WinnerOverlay';
import { NonWinnerOverlay } from '../components/NonWinnerOverlay';
import { useLiveDrawSimulation, type LiveScenario, type LiveDrawType } from '../hooks/useLiveDrawSimulation';
import { useCurrentDraw } from '../services/draw.service';
import { cn } from '@core/utils/cn';

export default function LiveDrawPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const lang = useUIStore((s) => s.language);
  const isOnline = useNetworkStatus();
  const { data: draw, isLoading } = useCurrentDraw();

  const scenarioParam = params.get('scenario') as LiveScenario | null;
  const VALID_SCENARIOS: LiveScenario[] = ['win', 'win_4', 'win_6', 'win_8', 'jackpot', 'lose', 'random'];
  const scenario: LiveScenario = scenarioParam && VALID_SCENARIOS.includes(scenarioParam) ? scenarioParam : 'random';
  const typeParam = params.get('type');
  const drawType: LiveDrawType = typeParam === 'monthly' ? 'monthly' : 'weekly';
  const live = useLiveDrawSimulation({ scenario, drawType });
  const [soundOn, setSoundOnLocal] = useState(isSoundEnabled());

  const toggleSound = () => {
    const next = !soundOn;
    setSoundEnabled(next);
    setSoundOnLocal(next);
  };

  const setScenario = (next: 'win' | 'lose') => {
    params.set('scenario', next);
    setParams(params, { replace: true });
  };

  usePageTitle(t('draws.liveTitle'));

  if (!isOnline) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-gradient-to-br from-ink-900 via-brand-950 to-ink-900 p-6">
        <ErrorState
          title={t('states.offline.title')}
          subtitle={t('draws.offlineMessage')}
          retryLabel={t('common.retry')}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div className="relative min-h-dvh bg-gradient-to-br from-ink-950 via-brand-950 to-ink-900 text-white overflow-hidden">
      <div className="absolute inset-0 -z-10 gradient-mesh opacity-30" />
      <div className="absolute -top-32 start-1/4 size-[500px] rounded-full bg-brand-600/20 blur-[120px]" />
      <div className="absolute -bottom-32 end-1/4 size-[500px] rounded-full bg-gold-400/15 blur-[120px]" />

      <div className="relative max-w-3xl mx-auto px-4 py-5 md:py-8 pb-24 md:pb-10">
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={() => navigate('/home')}
            className="inline-flex size-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md text-white border border-white/15 hover:bg-white/15 transition-colors"
            aria-label={t('common.back')}
          >
            <ArrowLeft className="size-5 rtl:rotate-180" />
          </button>
          <div className="flex items-center gap-2">
            <ViewerCount count={live.viewerCount} />
            <ConnectionStatus state={live.connection} />
            <button
              type="button"
              onClick={toggleSound}
              className="inline-flex size-9 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white hover:bg-white/15 transition-colors"
              aria-label={soundOn ? t('draws.muteSound') : t('draws.unmuteSound')}
              title={soundOn ? t('draws.muteSound') : t('draws.unmuteSound')}
            >
              {soundOn ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
            </button>
          </div>
        </div>

        <div className="text-center mb-7">
          <Badge tone="danger" pulse className="mb-3 !bg-danger-500/20 !text-danger-300 border border-danger-500/30">
            <span className="text-[10px] uppercase tracking-[0.2em] font-black">
              {t('draws.liveNow')}
            </span>
          </Badge>
          <h1 className="text-2xl md:text-3xl font-black mb-1.5">
            {t(drawType === 'monthly' ? 'draws.monthlyDraw' : 'draws.weeklyDraw')}
          </h1>
          <p className="inline-flex items-center gap-1.5 text-sm text-white/60">
            <Calendar className="size-3.5" />
            {draw?.drawDate
              ? new Date(draw.drawDate).toLocaleDateString(lang === 'ar' ? 'ar-IQ' : 'en-US', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })
              : '—'}
          </p>

          {live.phase === 'waiting' && (
            <div className="mt-5 inline-flex flex-col items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">
                {t('draws.demoScenario')}
              </span>
              <div className="inline-flex gap-1 rounded-full bg-white/8 backdrop-blur-md p-1 border border-white/10">
                <button
                  type="button"
                  onClick={() => setScenario('win')}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all',
                    scenario === 'win'
                      ? 'bg-gradient-to-br from-gold-300 to-gold-500 text-ink-900 shadow-md'
                      : 'text-white/70 hover:text-white',
                  )}
                >
                  <Trophy className="size-3.5" />
                  {t('draws.scenarioWin')}
                </button>
                <button
                  type="button"
                  onClick={() => setScenario('lose')}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all',
                    scenario === 'lose'
                      ? 'bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-md'
                      : 'text-white/70 hover:text-white',
                  )}
                >
                  <Heart className="size-3.5" />
                  {t('draws.scenarioLose')}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-3 mb-7">
          <JackpotTicker baseAmount={drawType === 'monthly' ? 250_000_000 : 75_000_000} active={live.phase === 'broadcasting'} />
          <div className="inline-flex items-center gap-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md px-4 py-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 text-white icon-3d">
              <Tv className="size-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-brand-200 font-bold">
                {t('draws.entryPool')}
              </div>
              <div className="text-lg md:text-xl font-black text-white tabular-nums leading-tight">
                {formatNumber(draw?.entryPoolSize ?? 0, lang)}
              </div>
            </div>
          </div>
        </div>

        {(isLoading || live.phase === 'waiting') && live.connection === 'connecting' ? (
          <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm p-8 text-center">
            <Loader2 className="size-8 text-brand-300 animate-spin mx-auto mb-3" />
            <p className="text-white/70 text-sm">{t('draws.connectingToBroadcast')}</p>
          </div>
        ) : live.phase === 'waiting' ? (
          <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm p-8 text-center">
            <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-brand-500/20 text-brand-300 mb-3">
              <Loader2 className="size-7 animate-spin" />
            </div>
            <h3 className="text-lg font-bold mb-1">{t('draws.waitingForOperator')}</h3>
            <p className="text-white/60 text-sm">{t('draws.broadcastStartsSoon')}</p>
          </div>
        ) : (
          <DigitGrid
            digits={live.digits}
            numbersCount={live.numbersCount}
            spinning={live.phase === 'broadcasting'}
            matchedFawzNumber={live.result?.matchedFawzNumber}
            matchedNumberIndex={live.result?.matchedNumberIndex}
            matchedTrailingCount={
              live.result?.tier === 'last_10'
                ? 10
                : live.result?.tier === 'last_8'
                  ? 8
                  : live.result?.tier === 'last_6'
                    ? 6
                    : live.result?.tier === 'last_4'
                      ? 4
                      : 0
            }
          />
        )}

        {live.phase === 'finalizing' && (
          <div className="mt-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm p-5 text-center">
            <Loader2 className="size-6 text-brand-300 animate-spin mx-auto mb-2" />
            <p className="text-sm text-white/80 font-semibold">{t('draws.calculatingWinners')}</p>
          </div>
        )}
      </div>

      {live.phase === 'finalized' && live.result?.isWinner && live.result.tier && live.result.prizeIqd && live.result.matchedFawzNumber && (
        <WinnerOverlay
          tier={live.result.tier}
          prizeIqd={live.result.prizeIqd}
          fawzNumber={live.result.matchedFawzNumber}
          onShare={() => navigate(`/winners/win-1/share`)}
          onViewResults={() => navigate(`/draws/${draw?.id ?? 'draw-143'}`)}
        />
      )}

      {live.phase === 'finalized' && live.result && !live.result.isWinner && (
        <NonWinnerOverlay
          remainingEntries={12}
          onInvite={() => navigate('/referral')}
          onViewResults={() => navigate(`/draws/${draw?.id ?? 'draw-143'}`)}
        />
      )}
    </div>
  );
}
