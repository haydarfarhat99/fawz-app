export type FawzBadgeId =
  | 'explorer'
  | 'streaker'
  | 'inviter'
  | 'first_win'
  | 'big_spender'
  | 'jackpot_dreamer';

export type AccountTier = 'starter' | 'member' | 'plus';

export interface FawzBadge {
  id: FawzBadgeId;
  earned: boolean;
  earnedAt?: string;
}

export interface FawzProfile {
  displayName: string;
  partialName: string;
  avatarUrl?: string;
  email: string;
  tier: AccountTier;
  isNew: boolean;
  lifetimeEntries: number;
  totalWins: number;
  totalWinningsIqd: number;
  referralCount: number;
  weeklySparkStreak: number;
  badges: FawzBadge[];
  mediaConsentGiven: boolean;
  shariaAccepted: boolean;
  joinedAt: string;
}
