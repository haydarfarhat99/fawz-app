import { useTranslation } from 'react-i18next';
import { Tv, Sparkles, ArrowRight, Eye } from 'lucide-react';
import { Trophy3D, Ticket3D, Calendar3D, Gift3D, Clover3D } from '@shared/components/Icon3D';
import { useNavigate } from 'react-router-dom';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { Card } from '@shared/components/Card';
import { Badge } from '@shared/components/Badge';
import { Button } from '@shared/components/Button';
import { useAuth } from '@shared/hooks/useAuth';
import { usePageTitle } from '@shared/hooks/usePageTitle';
import { useCountdown } from '@shared/hooks/useCountdown';
import { useUIStore } from '@stores/ui.store';
import { formatCompactIQD, formatNumber } from '@core/utils/formatters';

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
      <div className="mb-6">
        <p className="text-sm text-ink-500">{t('home.welcomeBack')}</p>
        <h1 className="text-2xl font-bold text-ink-900">
          {user?.fullName ?? t('home.playerFallback')}
        </h1>
      </div>

      <Card variant="gradient" padding="lg" className="relative overflow-hidden mb-6">
        <div className="absolute -top-8 -end-8 size-40 rounded-full bg-gold-300/40 blur-3xl" />
        <div className="absolute -bottom-8 -start-8 size-40 rounded-full bg-brand-300/40 blur-3xl" />
        <div className="relative grid md:grid-cols-2 gap-6 items-center">
          <div>
            <Badge tone="gold" pulse className="mb-3">
              <Sparkles className="size-3" />
              {t('home.nextDraw')}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-black text-ink-900 mb-2">
              <span className="text-gradient-gold">{formatCompactIQD(50_000_000, lang)}</span>
            </h2>
            <p className="text-sm text-ink-600 mb-4">{t('home.jackpotSubtitle')}</p>
            <div className="grid grid-cols-4 gap-2 max-w-sm">
              {[
                { label: t('home.units.days'), value: countdown.days },
                { label: t('home.units.hours'), value: countdown.hours },
                { label: t('home.units.minutes'), value: countdown.minutes },
                { label: t('home.units.seconds'), value: countdown.seconds },
              ].map((s) => (
                <div key={s.label} className="text-center bg-white/70 backdrop-blur rounded-xl py-2">
                  <div className="text-xl font-bold text-ink-900 tabular-nums">
                    {String(s.value).padStart(2, '0')}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-ink-500">{s.label}</div>
                </div>
              ))}
            </div>
            <Button
              size="lg"
              variant="gold"
              className="mt-5"
              iconEnd={<ArrowRight className="size-4 rtl:rotate-180" />}
              onClick={() => navigate('/draws/live')}
            >
              {t('draws.watchLive')}
            </Button>
          </div>
          <div className="relative h-48 md:h-56 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center animate-float">
              <Trophy3D size={160} />
            </div>
          </div>
        </div>
      </Card>

      <Card variant="elevated" padding="lg" className="relative overflow-hidden mb-6 border-2 border-dashed border-brand-300/60 !bg-gradient-to-br !from-brand-50/60 !via-white !to-gold-50/60">
        <div className="absolute -top-8 -end-8 size-32 rounded-full bg-brand-300/30 blur-3xl" />
        <div className="absolute -bottom-8 -start-8 size-32 rounded-full bg-gold-300/30 blur-3xl" />

        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-600 text-white px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.18em]">
              <Eye className="size-3" />
              {t('home.demoBadge')}
            </span>
            <span className="text-xs text-ink-500 font-medium">{t('home.demoSubtitle')}</span>
          </div>
          <h3 className="text-lg md:text-xl font-black text-ink-900 mb-1">
            {t('home.demoTitle')}
          </h3>
          <p className="text-sm text-ink-600 mb-4 max-w-md">{t('home.demoDescription')}</p>

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
      </Card>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <Card interactive onClick={() => navigate('/entries?filter=weekly')} padding="md">
          <div className="flex items-center gap-3">
            <Ticket3D size={48} />
            <div className="min-w-0">
              <div className="text-xs uppercase tracking-wider text-ink-500">{t('home.weeklyTickets')}</div>
              <div className="text-2xl font-bold text-ink-900 tabular-nums">
                {formatNumber(47, lang)}
              </div>
            </div>
          </div>
        </Card>
        <Card interactive onClick={() => navigate('/entries?filter=monthly')} padding="md">
          <div className="flex items-center gap-3">
            <Calendar3D size={48} />
            <div className="min-w-0">
              <div className="text-xs uppercase tracking-wider text-ink-500">{t('home.monthlyTickets')}</div>
              <div className="text-2xl font-bold text-ink-900 tabular-nums">{formatNumber(18, lang)}</div>
            </div>
          </div>
        </Card>
        <Card interactive onClick={() => navigate('/prizes')} padding="md">
          <div className="flex items-center gap-3">
            <Gift3D size={48} />
            <div className="min-w-0">
              <div className="text-xs uppercase tracking-wider text-ink-500">{t('home.totalWinnings')}</div>
              <div className="text-2xl font-bold text-ink-900 tabular-nums">{formatCompactIQD(0, lang)}</div>
            </div>
          </div>
        </Card>
      </div>

      <Card padding="lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-ink-900">{t('home.latestDraw')}</h3>
          <Button variant="ghost" size="sm" onClick={() => navigate('/draws/results')}>
            {t('common.viewAll')}
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white">
            <Tv className="size-6" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-ink-900">{t('home.latestDrawTitle', { number: 142 })}</p>
            <p className="text-sm text-ink-500">{t('home.latestDrawSubtitle')}</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate('/draws/results')}>
            {t('home.seeWinners')}
          </Button>
        </div>
      </Card>
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
    <div className="rounded-2xl bg-white/60 backdrop-blur p-3 border border-ink-100">
      <div className="flex items-center justify-between mb-2.5 px-1">
        <span className="text-[11px] uppercase tracking-[0.2em] font-black text-brand-700">
          {sectionLabel}
        </span>
        <span className="text-[10px] text-ink-500">{numbersHint}</span>
      </div>
      <div className="grid sm:grid-cols-2 gap-2 mb-2">
        <button
          type="button"
          onClick={() => navigate(`${linkBase}&scenario=jackpot`)}
          className="group flex items-center gap-3 rounded-xl bg-gradient-to-br from-danger-500 via-gold-500 to-brand-700 p-3 text-start shadow-[0_6px_18px_-6px_rgba(251,191,36,0.5)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_22px_-6px_rgba(251,191,36,0.7)]"
        >
          <Trophy3D size={40} />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-black text-white">
              {t('home.demoJackpotShort')} · {jackpotPrize} {t('currency.iqd')}
            </div>
            <div className="text-[10px] text-white/80">{t('home.demoJackpotSubtitle')}</div>
          </div>
          <ArrowRight className="size-3.5 text-white rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
        </button>
        <button
          type="button"
          onClick={() => navigate(`${linkBase}&scenario=lose`)}
          className="group flex items-center gap-3 rounded-xl bg-gradient-to-br from-brand-500 via-brand-600 to-brand-800 p-3 text-start shadow-[0_6px_18px_-6px_rgba(124,58,237,0.55)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_22px_-6px_rgba(124,58,237,0.7)]"
        >
          <Clover3D size={40} />
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
            className="group flex flex-col items-center justify-center rounded-lg bg-white border border-gold-300/60 p-2 text-center hover:border-gold-400 hover:-translate-y-0.5 transition-all"
          >
            <div className="text-[9px] uppercase tracking-wider font-bold text-gold-700">
              {s.label}
            </div>
            <div className="text-xs font-black text-ink-900 tabular-nums">
              {s.prize}
              <span className="text-[9px] font-bold text-ink-500 ms-1">{t('currency.iqd')}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
