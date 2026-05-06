import { cn } from '@core/utils/cn';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  withWordmark?: boolean;
}

const sizeMap = {
  sm: { mark: 24, text: 'text-lg', gap: 'gap-2' },
  md: { mark: 28, text: 'text-xl', gap: 'gap-2.5' },
  lg: { mark: 40, text: 'text-3xl', gap: 'gap-3' },
  xl: { mark: 56, text: 'text-5xl', gap: 'gap-4' },
};

export function Logo({ size = 'md', className, withWordmark = true }: LogoProps) {
  const s = sizeMap[size];
  return (
    <div className={cn('inline-flex items-center', s.gap, className)}>
      <LogoMark size={s.mark} />
      {withWordmark && (
        <span className={cn('font-black tracking-tight text-gradient-brand', s.text)}>FAWZ</span>
      )}
    </div>
  );
}

/**
 * Abstract diamond-cut mark — no letterforms, scales cleanly.
 * Two stacked rhombi suggest a winning ticket; gradient + inner highlight gives depth.
 */
function LogoMark({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="logo-mark-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#A78BFA" />
          <stop offset="50%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#4C1D95" />
        </linearGradient>
        <linearGradient id="logo-mark-shine" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="0.4" />
          <stop offset="60%" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="logo-mark-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FCD34D" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="32" height="32" rx="8" fill="url(#logo-mark-bg)" />
      <rect x="0" y="0" width="32" height="32" rx="8" fill="url(#logo-mark-shine)" />
      <path
        d="M16 7 L23 16 L16 25 L9 16 Z"
        fill="url(#logo-mark-gold)"
        stroke="white"
        strokeWidth="0.5"
        strokeOpacity="0.4"
      />
      <path d="M16 7 L23 16 L16 12 Z" fill="white" fillOpacity="0.25" />
    </svg>
  );
}
