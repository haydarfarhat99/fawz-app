import { useQuery } from '@tanstack/react-query';
import { apiClient, withFallback } from '@core/network/apiClient';
import type { Challenge, OnboardingProgress } from '../types/challenge.types';

export const challengeKeys = {
  all: ['challenges'] as const,
  lists: () => [...challengeKeys.all, 'list'] as const,
  detail: (id: string) => [...challengeKeys.all, 'detail', id] as const,
  onboarding: () => [...challengeKeys.all, 'onboarding'] as const,
};

const inDays = (n: number) => new Date(Date.now() + n * 86_400_000).toISOString();
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();

const DUMMY_CHALLENGES: Challenge[] = [
  {
    id: 'ch-spark',
    name: 'Weekly Spark',
    description: 'Make at least one SuperQi transaction on 5 different days this week.',
    nameKey: 'challenges.items.spark.name',
    descriptionKey: 'challenges.items.spark.description',
    category: 'weekly_spark',
    metric: 'unique_days',
    targetValue: 5,
    currentValue: 3,
    unit: 'days',
    rewardEntries: 100,
    startsAt: daysAgo(3),
    endsAt: inDays(4),
    completed: false,
    expired: false,
    iconHint: 'flame',
    checkpoints: [
      { threshold: 1, rewardEntries: 5, claimed: true },
      { threshold: 3, rewardEntries: 25, claimed: true },
      { threshold: 5, rewardEntries: 100, claimed: false },
    ],
  },
  {
    id: 'ch-fuel',
    name: 'Fuel Up',
    description: 'Spend 25,000 IQD on fuel transactions to score this month\'s bonus.',
    nameKey: 'challenges.items.fuel.name',
    descriptionKey: 'challenges.items.fuel.description',
    category: 'monthly_rotating',
    metric: 'transaction_amount',
    targetValue: 25_000,
    currentValue: 12_500,
    unit: 'IQD',
    rewardEntries: 250,
    rewardCashIqd: 5_000,
    startsAt: daysAgo(8),
    endsAt: inDays(22),
    completed: false,
    expired: false,
    categoryFilter: 'fuel',
    iconHint: 'fuel',
    checkpoints: [
      { threshold: 5_000, rewardEntries: 25, claimed: true },
      { threshold: 15_000, rewardEntries: 75, claimed: false },
      { threshold: 25_000, rewardEntries: 250, claimed: false },
    ],
  },
  {
    id: 'ch-recharge',
    name: 'Top Up Champion',
    description: 'Recharge your phone 4 times this week.',
    nameKey: 'challenges.items.recharge.name',
    descriptionKey: 'challenges.items.recharge.description',
    category: 'monthly_rotating',
    metric: 'category_transactions',
    targetValue: 4,
    currentValue: 1,
    unit: 'recharges',
    rewardEntries: 80,
    startsAt: daysAgo(2),
    endsAt: inDays(5),
    completed: false,
    expired: false,
    categoryFilter: 'recharge',
    iconHint: 'phone',
  },
  {
    id: 'ch-merchant',
    name: 'Explore Merchants',
    description: 'Pay at 3 different merchants this month.',
    nameKey: 'challenges.items.merchant.name',
    descriptionKey: 'challenges.items.merchant.description',
    category: 'monthly_rotating',
    metric: 'merchant_count',
    targetValue: 3,
    currentValue: 3,
    unit: 'merchants',
    rewardEntries: 150,
    startsAt: daysAgo(15),
    endsAt: inDays(15),
    completed: true,
    completedAt: daysAgo(1),
    expired: false,
    iconHint: 'cart',
  },
  {
    id: 'ch-special',
    name: 'Eid Bonanza',
    description: 'Earn 3x entries on every transaction during Eid week.',
    nameKey: 'challenges.items.special.name',
    descriptionKey: 'challenges.items.special.description',
    category: 'special',
    metric: 'transactions_count',
    targetValue: 10,
    currentValue: 10,
    unit: 'transactions',
    rewardEntries: 500,
    rewardCashIqd: 10_000,
    startsAt: daysAgo(20),
    endsAt: daysAgo(2),
    completed: true,
    completedAt: daysAgo(2),
    expired: false,
    iconHint: 'sparkles',
  },
];

const DUMMY_ONBOARDING: OnboardingProgress = {
  total: 4,
  completed: 1,
  challenges: [
    {
      id: 'ob-1',
      name: 'First Steps',
      description: 'Make your first SuperQi transaction.',
      nameKey: 'challenges.items.ob_first.name',
      descriptionKey: 'challenges.items.ob_first.description',
      category: 'onboarding',
      metric: 'transactions_count',
      targetValue: 1,
      currentValue: 1,
      unit: 'transaction',
      rewardEntries: 25,
      startsAt: daysAgo(2),
      endsAt: inDays(28),
      completed: true,
      completedAt: daysAgo(1),
      expired: false,
      iconHint: 'sparkles',
    },
    {
      id: 'ob-2',
      name: 'Build a Streak',
      description: 'Complete transactions on 3 different days.',
      nameKey: 'challenges.items.ob_streak.name',
      descriptionKey: 'challenges.items.ob_streak.description',
      category: 'onboarding',
      metric: 'unique_days',
      targetValue: 3,
      currentValue: 1,
      unit: 'days',
      rewardEntries: 50,
      startsAt: daysAgo(2),
      endsAt: inDays(28),
      completed: false,
      expired: false,
      iconHint: 'flame',
    },
    {
      id: 'ob-3',
      name: 'Invite a Friend',
      description: 'Share your Golden Ticket with a friend.',
      nameKey: 'challenges.items.ob_invite.name',
      descriptionKey: 'challenges.items.ob_invite.description',
      category: 'onboarding',
      metric: 'transactions_count',
      targetValue: 1,
      currentValue: 0,
      unit: 'invite',
      rewardEntries: 50,
      startsAt: daysAgo(2),
      endsAt: inDays(28),
      completed: false,
      expired: false,
      iconHint: 'users',
    },
    {
      id: 'ob-4',
      name: 'Watch a Live Draw',
      description: 'Tune in to the next live draw broadcast.',
      nameKey: 'challenges.items.ob_live.name',
      descriptionKey: 'challenges.items.ob_live.description',
      category: 'onboarding',
      metric: 'transactions_count',
      targetValue: 1,
      currentValue: 0,
      unit: 'view',
      rewardEntries: 25,
      startsAt: daysAgo(2),
      endsAt: inDays(28),
      completed: false,
      expired: false,
      iconHint: 'gift',
    },
  ],
};

export function useChallenges() {
  return useQuery({
    queryKey: challengeKeys.lists(),
    queryFn: () =>
      withFallback(
        () => apiClient.get<Challenge[]>('/fawz_challenge_system/challenge/list').then((r) => r.data),
        DUMMY_CHALLENGES,
        'challenges',
      ),
  });
}

export function useChallenge(id: string | undefined) {
  return useQuery({
    queryKey: challengeKeys.detail(id ?? ''),
    enabled: !!id,
    queryFn: async () => {
      try {
        return await apiClient
          .get<Challenge>(`/fawz_challenge_system/challenge/${id}/progress`)
          .then((r) => r.data);
      } catch {
        const dummy =
          DUMMY_CHALLENGES.find((c) => c.id === id) ??
          DUMMY_ONBOARDING.challenges.find((c) => c.id === id);
        if (!dummy) throw new Error('CHALLENGE_NOT_FOUND');
        return dummy;
      }
    },
    retry: false,
  });
}

export function useOnboarding() {
  return useQuery({
    queryKey: challengeKeys.onboarding(),
    queryFn: () =>
      withFallback(
        () => apiClient.get<OnboardingProgress>('/fawz_challenge_system/challenge/onboarding').then((r) => r.data),
        DUMMY_ONBOARDING,
        'onboarding',
      ),
  });
}
