import { Trophy } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useUIStore } from '@stores/ui.store';
import { formatNumber } from '@core/utils/formatters';

interface JackpotTickerProps {
  baseAmount: number;
  /** Kept for back-compat — the amount is always shown as a fixed value now. */
  active?: boolean;
}

export function JackpotTicker({ baseAmount }: JackpotTickerProps) {
  const { t } = useTranslation();
  const lang = useUIStore((s) => s.language);

  return (
    <div className="relative inline-flex items-center gap-3 rounded-2xl bg-gradient-to-br from-gold-300/20 via-gold-400/15 to-gold-600/20 border border-gold-300/30 backdrop-blur-md px-4 py-2.5 shadow-[0_8px_24px_-6px_rgba(251,191,36,0.3)]">
      <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-gold-300 to-gold-500 text-ink-900 icon-3d">
        <Trophy className="size-5" />
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-[0.2em] text-gold-300 font-bold">
          {t('draws.jackpot')}
        </div>
        <div className="text-lg md:text-xl font-black text-white tabular-nums leading-tight">
          {formatNumber(baseAmount, lang)}{' '}
          <span className="text-gold-300 text-sm">{t('currency.iqd')}</span>
        </div>
      </div>
    </div>
  );
}
