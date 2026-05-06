import type { HTMLAttributes } from 'react';
import { cn } from '@core/utils/cn';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export function Skeleton({ className, rounded = 'lg', ...rest }: SkeletonProps) {
  return (
    <div
      className={cn(
        'shimmer-bg',
        {
          sm: 'rounded-sm',
          md: 'rounded-md',
          lg: 'rounded-lg',
          xl: 'rounded-xl',
          '2xl': 'rounded-2xl',
          full: 'rounded-full',
        }[rounded],
        className,
      )}
      aria-hidden="true"
      {...rest}
    />
  );
}
