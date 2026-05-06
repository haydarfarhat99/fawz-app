import type { ReactNode } from 'react';
import { Inbox } from 'lucide-react';
import { cn } from '@core/utils/cn';

interface EmptyStateProps {
  icon?: ReactNode;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, subtitle, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center px-6 py-14',
        className,
      )}
    >
      <div className="relative mb-5">
        <div className="absolute inset-0 -z-10 blur-2xl opacity-50 bg-brand-300 rounded-full" />
        <div className="flex size-20 items-center justify-center rounded-3xl bg-gradient-to-br from-brand-50 to-brand-100 text-brand-600 icon-3d">
          {icon ?? <Inbox className="size-9" />}
        </div>
      </div>
      {title && <h3 className="text-lg font-bold text-ink-900 mb-1.5">{title}</h3>}
      {subtitle && <p className="text-sm text-ink-500 max-w-sm">{subtitle}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
