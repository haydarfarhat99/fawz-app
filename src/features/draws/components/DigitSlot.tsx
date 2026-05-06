import { useEffect, useState } from 'react';
import { cn } from '@core/utils/cn';

interface DigitSlotProps {
  value: number | null;
  spinning?: boolean;
  isMatched?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: 'size-8 text-base',
  md: 'size-11 text-xl md:size-12 md:text-2xl',
  lg: 'size-14 text-2xl md:size-16 md:text-3xl',
};

export function DigitSlot({ value, spinning = false, isMatched = false, size = 'md' }: DigitSlotProps) {
  const filled = value !== null;
  const [spinValue, setSpinValue] = useState(0);

  useEffect(() => {
    if (!spinning || filled) return;
    const interval = window.setInterval(() => {
      setSpinValue((v) => (v + 1) % 10);
    }, 70);
    return () => window.clearInterval(interval);
  }, [spinning, filled]);

  const displayValue = filled ? value : spinning ? spinValue : null;

  return (
    <div
      className={cn(
        'relative flex items-center justify-center rounded-xl font-black tabular-nums overflow-hidden',
        'transition-all duration-300',
        sizeMap[size],
        filled
          ? isMatched
            ? 'bg-gradient-to-br from-gold-300 via-gold-400 to-gold-600 text-ink-900 shadow-[0_8px_24px_-6px_rgba(251,191,36,0.6),inset_0_1px_0_rgba(255,255,255,0.5)]'
            : 'bg-gradient-to-br from-brand-600 to-brand-800 text-white shadow-[0_8px_20px_-6px_rgba(124,58,237,0.45),inset_0_1px_0_rgba(255,255,255,0.2)]'
          : spinning
            ? 'bg-gradient-to-br from-brand-700/60 to-brand-950/80 text-white border border-brand-400/40 shadow-[0_4px_12px_-4px_rgba(124,58,237,0.5),inset_0_1px_0_rgba(255,255,255,0.15)]'
            : 'bg-white/5 border border-white/10 text-white/30',
      )}
      aria-label={filled ? `Digit ${value}` : spinning ? 'Spinning' : 'Empty digit slot'}
    >
      {spinning && !filled && (
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-300/20 to-transparent animate-spin-glow"
        />
      )}
      <span
        key={`${filled}-${displayValue}`}
        className={cn(
          'relative inline-block',
          filled && 'animate-digit-land',
          spinning && !filled && 'opacity-80 blur-[0.5px]',
        )}
      >
        {displayValue !== null ? displayValue : '·'}
      </span>
      {isMatched && (
        <span className="absolute inset-0 rounded-xl pointer-events-none animate-pulse-glow" />
      )}
    </div>
  );
}
