import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@core/utils/cn';

type Tone = 'neutral' | 'brand' | 'gold' | 'success' | 'danger' | 'info' | 'warning';
type Size = 'sm' | 'md';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  size?: Size;
  icon?: ReactNode;
  pulse?: boolean;
}

const toneStyles: Record<Tone, string> = {
  neutral: 'bg-ink-100 text-ink-700',
  brand: 'bg-brand-100 text-brand-800',
  gold: 'bg-gold-100 text-gold-700',
  success: 'bg-success-50 text-success-600',
  danger: 'bg-danger-50 text-danger-600',
  info: 'bg-info-50 text-info-500',
  warning: 'bg-warning-500/10 text-warning-600',
};

export function Badge({ className, tone = 'neutral', size = 'sm', icon, pulse, children, ...rest }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-medium',
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs',
        toneStyles[tone],
        className,
      )}
      {...rest}
    >
      {pulse && (
        <span className="relative flex size-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-60" />
          <span className="relative inline-flex size-2 rounded-full bg-current" />
        </span>
      )}
      {icon}
      {children}
    </span>
  );
}
