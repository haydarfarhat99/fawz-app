import { Trophy, Tv, Hash, Target, CheckCircle2, UserPlus, AlertCircle, Coins } from 'lucide-react';
import { cn } from '@core/utils/cn';
import type { NotificationType } from '../types/notification.types';

const config: Record<NotificationType, { icon: typeof Trophy; tone: string }> = {
  prize_credited: { icon: Coins, tone: 'from-gold-300 to-gold-600 text-ink-900' },
  draw_results: { icon: Tv, tone: 'from-brand-500 to-brand-700 text-white' },
  draw_reminder: { icon: Tv, tone: 'from-danger-500 to-brand-700 text-white' },
  entry_earned: { icon: Hash, tone: 'from-brand-400 to-brand-700 text-white' },
  challenge_progress: { icon: Target, tone: 'from-info-500 to-brand-700 text-white' },
  challenge_completed: { icon: CheckCircle2, tone: 'from-success-500 to-success-600 text-white' },
  referral_reward: { icon: UserPlus, tone: 'from-success-500 to-brand-600 text-white' },
  system_alert: { icon: AlertCircle, tone: 'from-ink-700 to-ink-900 text-white' },
};

interface NotificationIconProps {
  type: NotificationType;
  size?: 'sm' | 'md';
}

export function NotificationIcon({ type, size = 'md' }: NotificationIconProps) {
  const c = config[type];
  const Icon = c.icon;
  return (
    <div
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br icon-3d',
        size === 'md' ? 'size-11' : 'size-9',
        c.tone,
      )}
    >
      <Icon className={size === 'md' ? 'size-5' : 'size-4'} />
    </div>
  );
}
