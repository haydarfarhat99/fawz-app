import type { ReactNode } from 'react';
import { cn } from '@core/utils/cn';

interface ScreenWrapperProps {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  noPadding?: boolean;
}

export function ScreenWrapper({ children, className, contentClassName, noPadding }: ScreenWrapperProps) {
  return (
    <div className={cn('min-h-full animate-fade-in', className)}>
      <div
        className={cn(
          'mx-auto w-full max-w-7xl',
          !noPadding && 'px-4 md:px-6 lg:px-8 py-6 md:py-8',
          contentClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}
