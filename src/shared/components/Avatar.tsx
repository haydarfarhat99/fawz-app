import { useState } from 'react';
import { cn } from '@core/utils/cn';

interface AvatarProps {
  src?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeMap = {
  xs: 'size-6 text-[10px]',
  sm: 'size-8 text-xs',
  md: 'size-10 text-sm',
  lg: 'size-12 text-base',
  xl: 'size-16 text-lg',
};

export function Avatar({ src, name = '', size = 'md', className }: AvatarProps) {
  const [imageError, setImageError] = useState(false);
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join('');

  return (
    <div
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full',
        'bg-gradient-to-br from-brand-500 to-brand-700 text-white font-semibold',
        sizeMap[size],
        className,
      )}
    >
      {src && !imageError ? (
        <img
          src={src}
          alt={name}
          className="size-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <span>{initials || '?'}</span>
      )}
    </div>
  );
}
