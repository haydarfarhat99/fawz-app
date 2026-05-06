import { Hash, Coins } from 'lucide-react';
import { cn } from '@core/utils/cn';
import { useUIStore } from '@stores/ui.store';
import { formatCompactIQD, formatNumber } from '@core/utils/formatters';

interface RewardChipProps {
  entries: number;
  cashIqd?: number;
  variant?: 'default' | 'inverted';
}

export function RewardChip({ entries, cashIqd, variant = 'default' }: RewardChipProps) {
  const lang = useUIStore((s) => s.language);
  return (
    <div className="inline-flex items-center gap-1.5">
      <span
        className={cn(
          'inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold',
          variant === 'inverted'
            ? 'bg-white/15 text-white border border-white/20'
            : 'bg-brand-100 text-brand-800',
        )}
      >
        <Hash className="size-3" />+{formatNumber(entries, lang)}
      </span>
      {cashIqd ? (
        <span
          className={cn(
            'inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold',
            variant === 'inverted'
              ? 'bg-gold-300/30 text-gold-100 border border-gold-300/40'
              : 'bg-gold-100 text-gold-700',
          )}
        >
          <Coins className="size-3" />+{formatCompactIQD(cashIqd, lang)}
        </span>
      ) : null}
    </div>
  );
}
