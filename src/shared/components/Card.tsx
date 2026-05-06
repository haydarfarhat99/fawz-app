import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@core/utils/cn';

type CardVariant = 'default' | 'elevated' | 'outlined' | 'glass' | 'gradient' | 'gold';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  interactive?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const variantStyles: Record<CardVariant, string> = {
  default: 'bg-white border border-ink-100 shadow-[0_1px_3px_rgba(15,23,42,0.06)]',
  elevated: 'bg-white shadow-[0_10px_30px_-10px_rgba(15,23,42,0.18)]',
  outlined: 'bg-white border-2 border-ink-200',
  glass: 'glass',
  gradient:
    'gradient-mesh border border-white/40 shadow-[0_10px_40px_-10px_rgba(124,58,237,0.25)]',
  gold:
    'bg-gradient-to-br from-gold-50 via-white to-gold-100 border border-gold-200 shadow-[0_12px_32px_-12px_rgba(251,191,36,0.4)]',
};

const paddingStyles = { none: '', sm: 'p-3', md: 'p-5', lg: 'p-7' };

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { className, variant = 'default', interactive = false, padding = 'md', children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        'rounded-2xl transition-all duration-300',
        variantStyles[variant],
        paddingStyles[padding],
        interactive &&
          'cursor-pointer hover:-translate-y-1 hover:shadow-[0_18px_44px_-12px_rgba(15,23,42,0.18)]',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
});
