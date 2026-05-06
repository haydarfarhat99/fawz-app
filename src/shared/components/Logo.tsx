import { cn } from '@core/utils/cn';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  withWordmark?: boolean;
}

const sizeMap = {
  sm: { mark: 'size-8', text: 'text-lg' },
  md: { mark: 'size-10', text: 'text-xl' },
  lg: { mark: 'size-14', text: 'text-3xl' },
  xl: { mark: 'size-20', text: 'text-5xl' },
};

export function Logo({ size = 'md', className, withWordmark = true }: LogoProps) {
  const s = sizeMap[size];
  return (
    <div className={cn('inline-flex items-center gap-2.5', className)}>
      <div
        className={cn(
          'relative flex items-center justify-center rounded-2xl',
          'bg-gradient-to-br from-brand-500 via-brand-600 to-brand-800',
          'shadow-[0_8px_24px_-6px_rgba(124,58,237,0.55),inset_0_1px_0_rgba(255,255,255,0.35)]',
          s.mark,
        )}
      >
        <div className="absolute inset-0.5 rounded-[14px] bg-gradient-to-br from-white/15 to-transparent" />
        <span className="relative font-black text-white text-[1.05em]" style={{ fontSize: 'inherit' }}>
          ف
        </span>
      </div>
      {withWordmark && (
        <span
          className={cn(
            'font-black tracking-tight text-gradient-brand',
            s.text,
          )}
        >
          FAWZ
        </span>
      )}
    </div>
  );
}
