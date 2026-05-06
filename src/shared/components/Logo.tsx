import { cn } from '@core/utils/cn';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  withWordmark?: boolean;
  variant?: 'wordmark' | 'lockup' | 'mark' | 'text';
}

const heightMap = {
  sm: 24,
  md: 32,
  lg: 48,
  xl: 72,
};

const textSizeMap = {
  sm: 'text-base',
  md: 'text-xl',
  lg: 'text-3xl',
  xl: 'text-5xl',
};

const SOURCES = {
  wordmark: '/brand/fawz-wordmark.png',
  lockup: '/brand/fawz-lockup.png',
  mark: '/brand/fawz-mark.png',
} as const;

export function Logo({ size = 'md', className, withWordmark = true, variant = 'text' }: LogoProps) {
  if (!withWordmark) return null;

  if (variant === 'text') {
    return (
      <span
        className={cn(
          'inline-block font-black tracking-tight select-none bg-clip-text text-transparent',
          textSizeMap[size],
          className,
        )}
        style={{
          backgroundImage:
            'linear-gradient(135deg, #00C6A7 0%, #00766A 35%, #FFC94D 75%, #F2B324 100%)',
        }}
      >
        FAWZ
      </span>
    );
  }

  const h = heightMap[size];
  return (
    <img
      src={SOURCES[variant]}
      alt="FAWZ"
      height={h}
      style={{ height: h, width: 'auto' }}
      className={cn('inline-block select-none', className)}
    />
  );
}
