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
  xl: 'size-16 text-xl',
};

export function Avatar({ src, name = '', size = 'md', className }: AvatarProps) {
  const [imageError, setImageError] = useState(false);
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join('');

  const showImage = src && !imageError;

  return (
    <div
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full text-white font-black',
        sizeMap[size],
        className,
      )}
      style={
        showImage
          ? undefined
          : {
              background:
                'radial-gradient(circle at 30% 25%, #5EE5C2 0%, #00C6A7 35%, #00766A 75%, #00312E 100%)',
              boxShadow:
                'inset 0 2px 4px rgba(255,255,255,0.45), inset 0 -3px 8px rgba(10,15,14,0.45), 0 4px 14px -4px rgba(10,15,14,0.5)',
            }
      }
    >
      {showImage ? (
        <img
          src={src}
          alt={name}
          className="size-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <>
          <span className="absolute inset-0 rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 15%, rgba(255,255,255,0.5) 0%, transparent 55%)' }} />
          <span
            className="relative tracking-tight"
            style={{ textShadow: '0 1px 0 rgba(10,15,14,0.45), 0 0 8px rgba(255,231,163,0.35)' }}
          >
            {initials || '?'}
          </span>
        </>
      )}
    </div>
  );
}
