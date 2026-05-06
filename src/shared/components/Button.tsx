import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@core/utils/cn';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'gold';
type Size = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
  iconStart?: ReactNode;
  iconEnd?: ReactNode;
}

const variantStyles: Record<Variant, string> = {
  primary:
    'bg-gradient-to-br from-brand-600 to-brand-800 text-white shadow-[0_8px_24px_-8px_rgba(0, 198, 167,0.55)] hover:shadow-[0_12px_28px_-8px_rgba(0, 198, 167,0.7)] hover:-translate-y-0.5 active:translate-y-0',
  secondary:
    'bg-ink-900 text-white shadow-md hover:bg-ink-800 hover:-translate-y-0.5 active:translate-y-0',
  outline:
    'bg-white text-ink-900 border border-ink-200 hover:border-brand-400 hover:text-brand-700 hover:bg-brand-50',
  ghost: 'text-ink-700 hover:bg-ink-100 hover:text-ink-900',
  destructive:
    'bg-gradient-to-br from-danger-500 to-danger-600 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0',
  gold:
    'bg-gradient-to-br from-gold-300 via-gold-400 to-gold-600 text-ink-900 shadow-[0_10px_30px_-8px_rgba(251,191,36,0.55)] hover:shadow-[0_14px_34px_-8px_rgba(251,191,36,0.75)] hover:-translate-y-0.5 active:translate-y-0',
};

const sizeStyles: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm gap-1.5',
  md: 'h-11 px-5 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2',
  xl: 'h-14 px-8 text-base gap-2.5',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className,
    variant = 'primary',
    size = 'md',
    loading = false,
    fullWidth = false,
    iconStart,
    iconEnd,
    disabled,
    children,
    ...rest
  },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 select-none',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        className,
      )}
      disabled={disabled ?? loading}
      {...rest}
    >
      {loading ? (
        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
      ) : (
        iconStart && <span className="shrink-0">{iconStart}</span>
      )}
      {children}
      {!loading && iconEnd && <span className="shrink-0">{iconEnd}</span>}
    </button>
  );
});
