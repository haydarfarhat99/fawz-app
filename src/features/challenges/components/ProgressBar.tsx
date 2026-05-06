import { cn } from '@core/utils/cn';
import type { Checkpoint } from '../types/challenge.types';

interface ProgressBarProps {
  current: number;
  target: number;
  checkpoints?: Checkpoint[];
  size?: 'sm' | 'md' | 'lg';
  variant?: 'brand' | 'gold' | 'success';
  showCheckpoints?: boolean;
}

const heightMap = { sm: 'h-2', md: 'h-3', lg: 'h-4' };
const variantMap = {
  brand: 'from-brand-400 via-brand-500 to-brand-700',
  gold: 'from-gold-300 via-gold-400 to-gold-600',
  success: 'from-success-500 via-success-500 to-success-600',
};

export function ProgressBar({
  current,
  target,
  checkpoints,
  size = 'md',
  variant = 'brand',
  showCheckpoints = true,
}: ProgressBarProps) {
  const pct = target > 0 ? Math.min(100, Math.max(0, (current / target) * 100)) : 0;
  const finalVariant: keyof typeof variantMap = pct >= 100 ? 'success' : pct >= 80 ? 'gold' : variant;

  return (
    <div className="relative w-full">
      <div className={cn('relative w-full overflow-hidden rounded-full bg-ink-100', heightMap[size])}>
        <div
          className={cn(
            'h-full rounded-full bg-gradient-to-r transition-all duration-700 ease-out relative overflow-hidden',
            variantMap[finalVariant],
          )}
          style={{ width: `${pct}%` }}
        >
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
            style={{
              backgroundSize: '200% 100%',
              animation: 'shimmer 2.4s linear infinite',
            }}
          />
        </div>
      </div>

      {showCheckpoints && checkpoints && checkpoints.length > 0 && (
        <div className="absolute inset-0 pointer-events-none">
          {checkpoints.map((cp, i) => {
            const cpPct = target > 0 ? Math.min(100, (cp.threshold / target) * 100) : 0;
            const reached = current >= cp.threshold;
            return (
              <span
                key={i}
                className={cn(
                  'absolute top-1/2 -translate-y-1/2 size-3 rounded-full border-2 transition-all',
                  reached
                    ? cp.claimed
                      ? 'bg-gold-400 border-white shadow-md'
                      : 'bg-white border-gold-500 animate-pulse-glow'
                    : 'bg-white border-ink-300',
                )}
                style={{ insetInlineStart: `calc(${cpPct}% - 6px)` }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
