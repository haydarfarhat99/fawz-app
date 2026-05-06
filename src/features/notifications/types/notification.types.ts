export type NotificationType =
  | 'entry_earned'
  | 'challenge_progress'
  | 'challenge_completed'
  | 'draw_reminder'
  | 'draw_results'
  | 'prize_credited'
  | 'referral_reward'
  | 'system_alert';

export interface FawzNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  createdAt: string;
  isRead: boolean;
  deepLink?: string;
}

export interface NotificationPreferences {
  drawReminders: boolean;
  drawResults: boolean;
  entryEarned: boolean;
  challengeUpdates: boolean;
  referralRewards: boolean;
  prizeCredited: boolean;
  systemCritical: boolean;
}

export type PreferenceKey = keyof NotificationPreferences;
