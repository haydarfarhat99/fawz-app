import { useTranslation } from 'react-i18next';
import { Tv, Sparkles, ArrowRight, Eye } from 'lucide-react';
import { Trophy3D, Ticket3D, Calendar3D, Gift3D, LuckClover3D } from '@shared/components/Icon3D';
import { useNavigate } from 'react-router-dom';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { useAuth } from '@shared/hooks/useAuth';
import { usePageTitle } from '@shared/hooks/usePageTitle';
import { useCountdown } from '@shared/hooks/useCountdown';
import { useUIStore } from '@stores/ui.store';
import { formatCompactIQD, formatNumber } from '@core/utils/formatters';
import { DEMO_STATS } from '@core/mocks/demoStats';

const NEXT_DRAW = (() => {
  const d = new Date();
  d.setDate(d.getDate() + ((4 - d.getDay() + 7) % 7 || 7));
  d.setHours(21, 0, 0, 0);
  return d;
})();

export default function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const lang = useUIStore((s) => s.language);
  usePageTitle(t('nav.home'));
  const countdown = useCountdown(NEXT_DRAW);

  return (
    <ScreenWrapper>
      <div
        className="hidden lg:block relative overflow-hidden rounded-3xl mb-6 px-8 py-7 text-white shadow-[0_18px_44px_-18px_rgba(0,49,46,0.55)]"
        style={{ background: 'linear-gradient(135deg, #00C6A7 0%, #00766A 60%, #00312E 100%)' }}
      >
        <div className="absolute -top-16 -end-16 size-56 rounded-full bg-fawzgold-300/25 blur-3xl" />
        <div className="absolute -bottom-16 -start-16 size-56 rounded-full bg-teal-300/30 blur-3xl" />

        <div className="relative flex items-center gap-5">
          <div className="relative shrink-0">
            <div className="absolute inset-0 -z-10 blur-3xl bg-fawzgold-400/35 rounded-full scale-125" />
            <div className="absolute inset-0 -z-10 blur-xl bg-teal-400/30 rounded-2xl scale-110" />
            <img
              src="/brand/fawz-mark.png"
              alt="FAWZ"
              className="size-24 drop-shadow-[0_14px_28px_rgba(10,15,14,0.55)]"
            />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.22em] text-fawzgold-200 font-bold mb-1">
              {t('home.welcomeBack')}
            </p>
            <p className="text-sm text-white/75 mb-1.5">{t('home.brandTagline')}</p>
            <h1 className="text-3xl font-black leading-tight truncate">
              {user?.fullName ?? t('home.playerFallback')}
            </h1>
          </div>
        </div>
      </div>

      <div
        className="relative overflow-hidden rounded-3xl mb-6 p-6 md:p-8 text-white shadow-[0_18px_44px_-18px_rgba(0,49,46,0.55)]"
        style={{ background: 'linear-gradient(135deg, #00C6A7 0%, #00766A 60%, #00312E 100%)' }}
      >
        <div className="absolute -top-16 -end-12 size-64 rounded-full bg-fawzgold-300/30 blur-3xl" />
        <div className="absolute -bottom-16 -start-12 size-56 rounded-full bg-teal-300/25 blur-3xl" />

        <div className="relative grid md:grid-cols-2 gap-6 items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] mb-3 bg-fawzgold-400/20 text-fawzgold-200 ring-1 ring-fawzgold-300/40">
              <Sparkles className="size-3 animate-pulse" />
              {t('home.nextDraw')}
            </span>
            <h2 className="text-4xl md:text-5xl font-black mb-2 tracking-tight">
              <span
                className="bg-clip-text text-transparent drop-shadow-[0_4px_24px_rgba(255,201,77,0.5)]"
                style={{ backgroundImage: 'linear-gradient(180deg, #FFE7A3 0%, #FFC94D 60%, #F2B324 100%)' }}
              >
                {formatCompactIQD(50_000_000, lang)}
              </span>
            </h2>
            <p className="text-sm text-white/75 mb-5">{t('home.jackpotSubtitle')}</p>
            <div className="grid grid-cols-4 gap-2 max-w-sm">
              {[
                { label: t('home.units.days'), value: countdown.days },
                { label: t('home.units.hours'), value: countdown.hours },
                { label: t('home.units.minutes'), value: countdown.minutes },
                { label: t('home.units.seconds'), value: countdown.seconds },
              ].map((s) => (
                <div key={s.label} className="text-center bg-white/10 ring-1 ring-white/15 backdrop-blur rounded-xl py-2.5">
                  <div className="text-xl font-black text-white tabular-nums">
                    {String(s.value).padStart(2, '0')}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-white/55">{s.label}</div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => navigate('/draws/live')}
              className="group relative mt-6 inline-flex items-center gap-2 rounded-2xl px-6 h-12 font-black text-ink-900 shadow-[0_12px_32px_-8px_rgba(255,201,77,0.55)] transition-all duration-200 hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg, #FFE7A3 0%, #FFC94D 50%, #F2B324 100%)' }}
            >
              <Sparkles className="size-4" />
              {t('draws.watchLive')}
              <ArrowRight className="size-4 rtl:rotate-180 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform" />
            </button>
          </div>
          <div className="relative h-48 md:h-56 flex items-center justify-center">
            <div className="absolute size-44 md:size-52 rounded-full bg-fawzgold-300/40 blur-3xl" />
            <div className="absolute size-32 md:size-40 rounded-full bg-fawzgold-200/40 blur-xl" />
            <div className="relative animate-float">
              <Trophy3D size={170} />
            </div>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-3xl mb-6 p-5 md:p-6 bg-mint-50 border border-teal-100 shadow-[0_8px_30px_-12px_rgba(0,198,167,0.25)]">
        <div className="absolute -top-8 -end-8 size-32 rounded-full bg-teal-300/30 blur-3xl" />
        <div className="absolute -bottom-8 -start-8 size-32 rounded-full bg-fawzgold-200/40 blur-3xl" />

        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-teal-600 text-white px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.18em]">
              <Eye className="size-3" />
              {t('home.demoBadge')}
            </span>
            <span className="text-xs text-teal-800 font-medium">{t('home.demoSubtitle')}</span>
          </div>
          <h3 className="text-lg md:text-xl font-black text-teal-900 mb-1">
            {t('home.demoTitle')}
          </h3>
          <p className="text-sm text-teal-800/80 mb-4 max-w-md">{t('home.demoDescription')}</p>

          <DemoSection
            type="weekly"
            jackpotPrize="50M"
            navigate={navigate}
            t={t}
          />
          <div className="h-3" />
          <DemoSection
            type="monthly"
            jackpotPrize="250M"
            navigate={navigate}
            t={t}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <button
          type="button"
          onClick={() => navigate('/entries?filter=weekly')}
          className="group flex items-center gap-3 rounded-2xl bg-white border border-teal-100 p-4 text-start hover:border-teal-300 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-12px_rgba(0,198,167,0.35)] transition-all"
        >
          <Ticket3D size={48} tone="teal" />
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-wider text-teal-700 font-bold">{t('home.weeklyTickets')}</div>
            <div className="text-2xl font-black text-teal-900 tabular-nums">{formatNumber(DEMO_STATS.weeklyTicketsThisWeek, lang)}</div>
          </div>
        </button>
        <button
          type="button"
          onClick={() => navigate('/entries?filter=monthly')}
          className="group flex items-center gap-3 rounded-2xl bg-white border border-teal-100 p-4 text-start hover:border-teal-300 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-12px_rgba(0,198,167,0.35)] transition-all"
        >
          <Calendar3D size={48} tone="teal" />
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-wider text-teal-700 font-bold">{t('home.monthlyTickets')}</div>
            <div className="text-2xl font-black text-teal-900 tabular-nums">{formatNumber(DEMO_STATS.monthlyTicketsThisMonth, lang)}</div>
          </div>
        </button>
        <button
          type="button"
          onClick={() => navigate('/prizes')}
          className="group flex items-center gap-3 rounded-2xl bg-white border border-teal-100 p-4 text-start hover:border-teal-300 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-12px_rgba(0,198,167,0.35)] transition-all"
        >
          <Gift3D size={48} tone="gold" />
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-wider text-teal-700 font-bold">{t('home.totalWinnings')}</div>
            <div className="text-2xl font-black text-teal-900 tabular-nums">{formatCompactIQD(DEMO_STATS.lifetimeWinningsIqd, lang)}</div>
          </div>
        </button>
      </div>

      <div className="rounded-3xl bg-white border border-teal-100 p-5 md:p-6 shadow-[0_8px_24px_-16px_rgba(0,49,46,0.25)]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-black text-teal-900">{t('home.latestDraw')}</h3>
          <button
            type="button"
            onClick={() => navigate('/draws/results')}
            className="text-sm font-bold text-teal-700 hover:text-teal-900 transition-colors"
          >
            {t('common.viewAll')}
          </button>
        </div>
        <div className="flex items-center gap-4">
          <div
            className="flex size-14 items-center justify-center rounded-2xl text-white shadow-[0_8px_20px_-8px_rgba(0,198,167,0.6)]"
            style={{ background: 'linear-gradient(135deg, #00C6A7 0%, #00766A 100%)' }}
          >
            <Tv className="size-6" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-teal-900">{t('home.latestDrawTitle', { number: 142 })}</p>
            <p className="text-sm text-teal-800/70">{t('home.latestDrawSubtitle')}</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/draws/results')}
            className="inline-flex items-center gap-1.5 rounded-xl border border-teal-300 bg-teal-50 px-3 h-9 text-sm font-bold text-teal-800 hover:bg-teal-100 transition-colors"
          >
            {t('home.seeWinners')}
          </button>
        </div>
      </div>
    </ScreenWrapper>
  );
}

interface DemoSectionProps {
  type: 'weekly' | 'monthly';
  jackpotPrize: string;
  navigate: (to: string) => void;
  t: (key: string) => string;
}

function DemoSection({ type, jackpotPrize, navigate, t }: DemoSectionProps) {
  const sectionLabel = type === 'monthly' ? t('home.demoMonthlySection') : t('home.demoWeeklySection');
  const numbersHint = type === 'monthly' ? t('home.demoMonthlyHint') : t('home.demoWeeklyHint');
  const linkBase = `/draws/live?type=${type}`;
  const tiers = [
    { key: 'win_4', label: t('home.demoTier4'), prize: '10K' },
    { key: 'win_6', label: t('home.demoTier6'), prize: '250K' },
    { key: 'win_8', label: t('home.demoTier8'), prize: '5M' },
  ];

  return (
    <div className="rounded-2xl bg-white/85 backdrop-blur p-3 border border-teal-100">
      <div className="flex items-center justify-between mb-2.5 px-1">
        <span className="text-[11px] uppercase tracking-[0.2em] font-black text-teal-700">
          {sectionLabel}
        </span>
        <span className="text-[10px] text-teal-800/70">{numbersHint}</span>
      </div>
      <div className="grid sm:grid-cols-2 gap-2 mb-2">
        <button
          type="button"
          onClick={() => navigate(`${linkBase}&scenario=jackpot`)}
          className="group flex items-center gap-3 rounded-xl p-3 text-start shadow-[0_8px_22px_-8px_rgba(255,201,77,0.5)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-8px_rgba(255,201,77,0.7)]"
          style={{ background: 'linear-gradient(135deg, #FFE7A3 0%, #FFC94D 50%, #F2B324 100%)' }}
        >
          <Trophy3D size={40} />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-black text-ink-900">
              {t('home.demoJackpotShort')} · {jackpotPrize} {t('currency.iqd')}
            </div>
            <div className="text-[10px] text-ink-900/70">{t('home.demoJackpotSubtitle')}</div>
          </div>
          <ArrowRight className="size-3.5 text-ink-900 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
        </button>
        <button
          type="button"
          onClick={() => navigate(`${linkBase}&scenario=lose`)}
          className="group flex items-center gap-3 rounded-xl p-3 text-start shadow-[0_8px_22px_-8px_rgba(0,198,167,0.55)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-8px_rgba(0,198,167,0.7)]"
          style={{ background: 'linear-gradient(135deg, #00C6A7 0%, #00766A 60%, #00312E 100%)' }}
        >
          <LuckClover3D size={40} />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-black text-white">{t('home.demoLoseTitle')}</div>
            <div className="text-[10px] text-white/80">{t('home.demoLoseSubtitle')}</div>
          </div>
          <ArrowRight className="size-3.5 text-white rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
        </button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {tiers.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => navigate(`${linkBase}&scenario=${s.key}`)}
            className="group flex flex-col items-center justify-center rounded-lg bg-white border border-fawzgold-300/70 p-2 text-center hover:border-fawzgold-400 hover:-translate-y-0.5 transition-all"
          >
            <div className="text-[9px] uppercase tracking-wider font-bold text-fawzgold-600">
              {s.label}
            </div>
            <div className="text-xs font-black text-teal-900 tabular-nums">
              {s.prize}
              <span className="text-[9px] font-bold text-teal-800/60 ms-1">{t('currency.iqd')}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
