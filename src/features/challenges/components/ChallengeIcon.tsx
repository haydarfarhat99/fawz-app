import { Flame, Fuel, ShoppingCart, Target, Phone, Sparkles, Gift, Users } from 'lucide-react';
import { cn } from '@core/utils/cn';
import type { Challenge } from '../types/challenge.types';

const iconMap = {
  flame: Flame,
  fuel: Fuel,
  cart: ShoppingCart,
  target: Target,
  phone: Phone,
  sparkles: Sparkles,
  gift: Gift,
  users: Users,
};

const toneMap = {
  flame: 'from-danger-500 to-gold-500 text-white',
  fuel: 'from-info-500 to-brand-700 text-white',
  cart: 'from-brand-400 to-brand-700 text-white',
  target: 'from-success-500 to-success-700 text-white',
  phone: 'from-info-500 to-info-500/80 text-white',
  sparkles: 'from-gold-300 to-gold-600 text-ink-900',
  gift: 'from-danger-500 to-brand-700 text-white',
  users: 'from-success-500 to-brand-600 text-white',
};

interface ChallengeIconProps {
  challenge: Challenge;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: { box: 'size-9', icon: 'size-4' },
  md: { box: 'size-12', icon: 'size-6' },
  lg: { box: 'size-16', icon: 'size-8' },
};

export function ChallengeIcon({ challenge, size = 'md', className }: ChallengeIconProps) {
  const hint = challenge.iconHint ?? 'target';
  const Icon = iconMap[hint];
  const tone = toneMap[hint];
  const s = sizeMap[size];
  return (
    <div
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br icon-3d',
        tone,
        s.box,
        challenge.completed && 'opacity-60 grayscale-[40%]',
        className,
      )}
    >
      <Icon className={s.icon} />
    </div>
  );
}
