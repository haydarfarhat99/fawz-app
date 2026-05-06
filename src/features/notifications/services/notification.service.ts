import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient, withFallback } from '@core/network/apiClient';
import type {
  FawzNotification,
  NotificationPreferences,
  PreferenceKey,
} from '../types/notification.types';

export const notifKeys = {
  all: ['notifications'] as const,
  list: () => [...notifKeys.all, 'list'] as const,
  unreadCount: () => [...notifKeys.all, 'unread'] as const,
  preferences: () => [...notifKeys.all, 'preferences'] as const,
};

const hoursAgo = (n: number) => new Date(Date.now() - n * 3_600_000).toISOString();
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();

const DUMMY_NOTIFS: FawzNotification[] = [
  {
    id: 'n1',
    type: 'prize_credited',
    title: '🎉 You won 10,000 IQD!',
    body: 'Last-4 match in Weekly Draw #142. Credited to your wallet.',
    createdAt: hoursAgo(2),
    isRead: false,
    deepLink: '/prizes',
  },
  {
    id: 'n2',
    type: 'draw_results',
    title: 'Weekly Draw #142 results are in',
    body: 'See if your numbers came up. Three winning numbers revealed.',
    createdAt: hoursAgo(3),
    isRead: false,
    deepLink: '/draws/draw-142',
  },
  {
    id: 'n3',
    type: 'entry_earned',
    title: '+5 Fawz numbers',
    body: 'From your purchase at Carrefour for 12,500 IQD.',
    createdAt: hoursAgo(8),
    isRead: false,
    deepLink: '/entries',
  },
  {
    id: 'n4',
    type: 'challenge_progress',
    title: 'Weekly Spark — 3/5 days',
    body: 'Two more transaction days and you\'ll bag 100 entries.',
    createdAt: hoursAgo(20),
    isRead: true,
    deepLink: '/challenges/ch-spark',
  },
  {
    id: 'n5',
    type: 'draw_reminder',
    title: 'Live draw in 2 hours',
    body: 'Get ready — the weekly draw broadcasts at 9:00 PM.',
    createdAt: daysAgo(1),
    isRead: true,
    deepLink: '/draws/live',
  },
  {
    id: 'n6',
    type: 'referral_reward',
    title: 'Referral reward · +50 entries · 5,000 IQD',
    body: 'Ahmad qualified through your Golden Ticket.',
    createdAt: daysAgo(2),
    isRead: true,
    deepLink: '/referral/history',
  },
  {
    id: 'n7',
    type: 'challenge_completed',
    title: 'Eid Bonanza completed',
    body: 'You earned +500 entries and 10,000 IQD bonus.',
    createdAt: daysAgo(2),
    isRead: true,
    deepLink: '/challenges/ch-special',
  },
  {
    id: 'n8',
    type: 'system_alert',
    title: 'New terms accepted',
    body: 'You agreed to the updated rewards terms on Apr 12.',
    createdAt: daysAgo(8),
    isRead: true,
  },
];

const DUMMY_PREFS: NotificationPreferences = {
  drawReminders: true,
  drawResults: true,
  entryEarned: true,
  challengeUpdates: true,
  referralRewards: true,
  prizeCredited: true,
  systemCritical: true,
};

export function useNotifications() {
  return useQuery({
    queryKey: notifKeys.list(),
    queryFn: () =>
      withFallback(
        () => apiClient.get<FawzNotification[]>('/fawz_consumer_engagement/notification/list').then((r) => r.data),
        DUMMY_NOTIFS,
        'notifications',
      ),
  });
}

export function useUnreadCount() {
  return useQuery({
    queryKey: notifKeys.unreadCount(),
    queryFn: () =>
      withFallback(
        () => apiClient.get<{ count: number }>('/fawz_consumer_engagement/notification/unread-count').then((r) => r.data.count),
        DUMMY_NOTIFS.filter((n) => !n.isRead).length,
        'unreadCount',
      ),
  });
}

export function useMarkAllRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      try {
        await apiClient.patch('/fawz_consumer_engagement/notification/mark-all-read');
      } catch {
        /* dummy mode */
      }
    },
    onSuccess: () => {
      qc.setQueryData<FawzNotification[]>(notifKeys.list(), (old) =>
        old?.map((n) => ({ ...n, isRead: true })) ?? [],
      );
      qc.setQueryData(notifKeys.unreadCount(), 0);
    },
  });
}

export function useMarkRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      try {
        await apiClient.patch(`/fawz_consumer_engagement/notification/${id}/read`);
      } catch {
        /* dummy mode */
      }
      return id;
    },
    onSuccess: (id) => {
      qc.setQueryData<FawzNotification[]>(notifKeys.list(), (old) =>
        old?.map((n) => (n.id === id ? { ...n, isRead: true } : n)) ?? [],
      );
    },
  });
}

export function useNotificationPreferences() {
  return useQuery({
    queryKey: notifKeys.preferences(),
    queryFn: () =>
      withFallback(
        () => apiClient.get<NotificationPreferences>('/fawz_consumer_engagement/notification/preferences').then((r) => r.data),
        DUMMY_PREFS,
        'preferences',
      ),
  });
}

export function useUpdatePreference() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ key, value }: { key: PreferenceKey; value: boolean }) => {
      try {
        await apiClient.patch('/fawz_consumer_engagement/notification/preferences', { [key]: value });
      } catch {
        /* dummy mode */
      }
      return { key, value };
    },
    onSuccess: ({ key, value }) => {
      qc.setQueryData<NotificationPreferences>(notifKeys.preferences(), (old) =>
        old ? { ...old, [key]: value } : old,
      );
    },
  });
}
