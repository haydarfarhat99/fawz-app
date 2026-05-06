import { useTranslation } from 'react-i18next';
import { Calendar, CalendarDays, TrendingUp, Trophy, Sparkles } from 'lucide-react';
import { useUIStore } from '@stores/ui.store';
import { Card } from '@shared/components/Card';
import { formatCompactIQD, formatNumber } from '@core/utils/formatters';
import type { EntrySummary } from '../types/entry.types';

interface SummaryCardProps {
  summary: EntrySummary;
}

export function SummaryCard({ summary }: SummaryCardProps) {
  const { t } = useTranslation();
  const lang = useUIStore((s) => s.language);
  return (
    <Card variant="gradient" padding="lg" className="relative overflow-hidden mb-5">
      <div className="absolute -top-12 -end-12 size-48 rounded-full bg-brand-300/40 blur-3xl" />
      <div className="absolute -bottom-12 -start-12 size-48 rounded-full bg-gold-300/30 blur-3xl" />

      <div className="relative">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-white/80 backdrop-blur px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-700 mb-4">
          <Sparkles className="size-3" />
          {t('entries.activeTickets')}
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="rounded-2xl bg-white/85 backdrop-blur p-4 shadow-[0_4px_18px_-6px_rgba(124,58,237,0.18)]">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white icon-3d">
                <Calendar className="size-4" />
              </div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-brand-700">
                {t('entries.weeklyTickets')}
              </span>
            </div>
            <div className="text-3xl md:text-4xl font-black text-gradient-brand tabular-nums leading-none">
              {formatNumber(summary.weeklyThisWeek, lang)}
            </div>
            <div className="text-[11px] text-ink-500 mt-1">
              {t('entries.weeklyTotalLifetime', { formatted: formatNumber(summary.weeklyTotal, lang) })}
            </div>
          </div>

          <div className="rounded-2xl bg-white/85 backdrop-blur p-4 shadow-[0_4px_18px_-6px_rgba(251,191,36,0.25)]">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 text-ink-900 icon-3d">
                <CalendarDays className="size-4" />
              </div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-gold-700">
                {t('entries.monthlyTickets')}
              </span>
            </div>
            <div className="text-3xl md:text-4xl font-black text-gradient-gold tabular-nums leading-none">
              {formatNumber(summary.monthlyThisMonth, lang)}
            </div>
            <div className="text-[11px] text-ink-500 mt-1">
              {t('entries.monthlyTotalLifetime', { formatted: formatNumber(summary.monthlyTotal, lang) })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 md:gap-3">
          <div className="rounded-xl bg-white/70 backdrop-blur p-3">
            <div className="flex items-center gap-1.5 mb-1.5">
              <div className="flex size-7 items-center justify-center rounded-lg bg-gradient-to-br from-gold-200 to-gold-400 text-gold-700 icon-3d">
                <Trophy className="size-3.5" />
              </div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-ink-500">
                {t('entries.wonShort')}
              </span>
            </div>
            <div className="text-xl font-black text-ink-900 tabular-nums">
              {formatNumber(summary.won, lang)}
            </div>
          </div>
          <div className="rounded-xl bg-white/70 backdrop-blur p-3">
            <div className="flex items-center gap-1.5 mb-1.5">
              <div className="flex size-7 items-center justify-center rounded-lg bg-gradient-to-br from-success-50 to-success-500/30 text-success-600 icon-3d">
                <TrendingUp className="size-3.5" />
              </div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-ink-500">
                {t('entries.winningsShort')}
              </span>
            </div>
            <div className="text-base font-black text-ink-900 tabular-nums">
              {formatCompactIQD(summary.lifetimeWinningsIqd, lang)}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
