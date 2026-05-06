export type ChallengeCategory =
  | 'onboarding'
  | 'weekly_spark'
  | 'monthly_rotating'
  | 'special'
  | 'fuel'
  | 'merchant'
  | 'recharge';

export type ChallengeMetric =
  | 'transactions_count'
  | 'unique_days'
  | 'transaction_amount'
  | 'category_transactions'
  | 'merchant_count';

export interface Checkpoint {
  threshold: number;
  rewardEntries: number;
  rewardCashIqd?: number;
  claimed: boolean;
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  category: ChallengeCategory;
  metric: ChallengeMetric;
  targetValue: number;
  currentValue: number;
  unit: string;
  rewardEntries: number;
  rewardCashIqd?: number;
  startsAt: string;
  endsAt: string;
  completed: boolean;
  completedAt?: string;
  expired: boolean;
  checkpoints?: Checkpoint[];
  categoryFilter?: string;
  iconHint?: 'flame' | 'fuel' | 'cart' | 'target' | 'phone' | 'sparkles' | 'gift' | 'users';
}

export interface OnboardingProgress {
  total: number;
  completed: number;
  challenges: Challenge[];
}
