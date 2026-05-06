import type { ReactNode } from 'react';
import { Card } from '@shared/components/Card';
import { cn } from '@core/utils/cn';

interface AuthCardProps {
  title: ReactNode;
  subtitle?: ReactNode;
  badge?: ReactNode;
  icon?: ReactNode;
  iconTone?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function AuthCard({
  title,
  subtitle,
  badge,
  icon,
  iconTone = 'from-brand-500 to-brand-700',
  children,
  footer,
  className,
}: AuthCardProps) {
  return (
    <Card variant="elevated" padding="lg" className={cn('animate-slide-up', className)}>
      <div className="text-center mb-6">
        {icon ? (
          <div className="mb-4">
            <div
              className={cn(
                'mx-auto inline-flex size-16 items-center justify-center rounded-3xl text-white icon-3d shadow-[0_18px_36px_-12px_rgba(124,58,237,0.55)]',
                'bg-gradient-to-br',
                iconTone,
              )}
            >
              {icon}
            </div>
          </div>
        ) : null}
        {badge && (
          <div className="mb-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-50 text-gold-700 text-xs font-semibold">
            {badge}
          </div>
        )}
        <h1 className="text-2xl font-black text-ink-900 mb-1 tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-ink-500">{subtitle}</p>}
      </div>
      {children}
      {footer && <div className="mt-6">{footer}</div>}
    </Card>
  );
}
