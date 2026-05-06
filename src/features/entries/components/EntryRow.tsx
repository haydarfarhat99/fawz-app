import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Trophy, ShoppingBag, Target, UserPlus, Clock, ChevronRight, Sparkles } from 'lucide-react';
import { cn } from '@core/utils/cn';
import { useUIStore } from '@stores/ui.store';
import { formatFawzNumber, formatRelative } from '@core/utils/formatters';
import type { EntrySource, FawzEntry } from '../types/entry.types';

const sourceConfig: Record<EntrySource, { icon: typeof Trophy; tone: string; bg: string }> = {
  transaction: {
    icon: ShoppingBag,
    tone: 'text-brand-700',
    bg: 'bg-gradient-to-br from-brand-100 to-brand-200',
  },
  challenge: {
    icon: Target,
    tone: 'text-info-500',
    bg: 'bg-gradient-to-br from-info-50 to-info-500/20',
  },
  referral: {
    icon: UserPlus,
    tone: 'text-success-600',
    bg: 'bg-gradient-to-br from-success-50 to-success-500/30',
  },
  retroactive: {
    icon: Clock,
    tone: 'text-ink-700',
    bg: 'bg-gradient-to-br from-ink-100 to-ink-200',
  },
};

interface EntryRowProps {
  entry: FawzEntry;
}

export function EntryRow({ entry }: EntryRowProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const lang = useUIStore((s) => s.language);
  const isWin = entry.outcome === 'won';
  const config = sourceConfig[entry.source];
  const Icon = config.icon;
  const clickable = isWin;

  const handle = () => {
    if (clickable) navigate(`/draws/${entry.drawId}`);
  };

  return (
    <div
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : -1}
      onClick={handle}
      onKeyDown={(e) => {
        if (clickable && (e.key === 'Enter' || e.key === ' ')) handle();
      }}
      className={cn(
        'group flex items-center gap-3 rounded-2xl p-3 md:p-4 transition-all duration-200',
        isWin
          ? 'bg-gradient-to-br from-gold-50 via-white to-gold-50 border border-gold-200 shadow-[0_4px_18px_-6px_rgba(251,191,36,0.3)] hover:shadow-[0_8px_24px_-6px_rgba(251,191,36,0.45)] hover:-translate-y-0.5'
          : 'bg-white border border-ink-100 hover:border-brand-200',
        clickable && 'cursor-pointer',
      )}
    >
      <div
        className={cn(
          'flex size-11 md:size-12 shrink-0 items-center justify-center rounded-2xl icon-3d',
          isWin ? 'bg-gradient-to-br from-gold-300 to-gold-500 text-ink-900' : config.bg,
        )}
      >
        {isWin ? <Trophy className="size-5" /> : <Icon className={cn('size-5', config.tone)} />}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
          <span dir="ltr" className="font-mono text-sm md:text-base font-bold text-ink-900 tabular-nums">
            {formatFawzNumber(entry.fawzNumber)}
          </span>
          <span
            className={cn(
              'inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md',
              entry.drawType === 'monthly'
                ? 'text-gold-700 bg-gold-100'
                : 'text-brand-700 bg-brand-100',
            )}
          >
            {t(`entries.drawType.${entry.drawType}`)}
          </span>
          {isWin && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-success-700 bg-success-50 px-1.5 py-0.5 rounded-md">
              <Sparkles className="size-3" />
              {t('entries.won')}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-ink-500">
          <span>{t(`entries.source.${entry.source}`)}</span>
          <span className="size-1 rounded-full bg-ink-300" />
          <span>{formatRelative(entry.createdAt, lang)}</span>
        </div>
      </div>

      {clickable && (
        <ChevronRight className="size-4 text-ink-400 rtl:rotate-180 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
      )}
    </div>
  );
}
