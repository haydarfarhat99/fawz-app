import { useQuery } from '@tanstack/react-query';
import { apiClient, withFallback } from '@core/network/apiClient';
import { DEMO_STATS } from '@core/mocks/demoStats';
import type { FawzProfile } from '../types/profile.types';

export const profileKeys = {
  all: ['profile'] as const,
  me: () => [...profileKeys.all, 'me'] as const,
};

const DUMMY_PROFILE: FawzProfile = {
  displayName: 'Demo Player',
  partialName: 'De*** Pl***',
  email: 'test@fawz.io',
  tier: 'member',
  isNew: false,
  lifetimeEntries: DEMO_STATS.lifetimeEntries,
  totalWins: DEMO_STATS.totalWins,
  totalWinningsIqd: DEMO_STATS.lifetimeWinningsIqd,
  referralCount: 11,
  weeklySparkStreak: 3,
  joinedAt: new Date(Date.now() - 90 * 86_400_000).toISOString(),
  mediaConsentGiven: false,
  shariaAccepted: true,
  badges: [
    { id: 'explorer', earned: true, earnedAt: new Date(Date.now() - 80 * 86_400_000).toISOString() },
    { id: 'streaker', earned: true, earnedAt: new Date(Date.now() - 50 * 86_400_000).toISOString() },
    { id: 'first_win', earned: true, earnedAt: new Date(Date.now() - 30 * 86_400_000).toISOString() },
    { id: 'inviter', earned: true, earnedAt: new Date(Date.now() - 15 * 86_400_000).toISOString() },
    { id: 'big_spender', earned: false },
    { id: 'jackpot_dreamer', earned: false },
  ],
};

export function useProfile() {
  return useQuery({
    queryKey: profileKeys.me(),
    queryFn: () =>
      withFallback(
        () => apiClient.get<FawzProfile>('/fawz_user_management/user/fawz-profile').then((r) => r.data),
        DUMMY_PROFILE,
        'fawzProfile',
      ),
  });
}
