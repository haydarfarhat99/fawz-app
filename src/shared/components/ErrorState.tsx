import type { ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { cn } from '@core/utils/cn';
import { Button } from './Button';

interface ErrorStateProps {
  icon?: ReactNode;
  title?: string;
  subtitle?: string;
  retryLabel?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  icon,
  title,
  subtitle,
  retryLabel = 'Retry',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn('flex flex-col items-center justify-center text-center px-6 py-14', className)}
    >
      <div className="relative mb-5">
        <div className="absolute inset-0 -z-10 blur-2xl opacity-50 bg-danger-500/30 rounded-full" />
        <div className="flex size-20 items-center justify-center rounded-3xl bg-gradient-to-br from-danger-50 to-danger-500/10 text-danger-600 icon-3d">
          {icon ?? <AlertTriangle className="size-9" />}
        </div>
      </div>
      {title && <h3 className="text-lg font-bold text-ink-900 mb-1.5">{title}</h3>}
      {subtitle && <p className="text-sm text-ink-500 max-w-sm">{subtitle}</p>}
      {onRetry && (
        <Button
          variant="outline"
          className="mt-5"
          onClick={onRetry}
          iconStart={<RotateCcw className="size-4" />}
        >
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
