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
    titleKey: 'notifications.items.prizeWin.title',
    bodyKey: 'notifications.items.prizeWin.body',
    i18nVars: { amount: '10,000', drawNumber: 142 },
    createdAt: hoursAgo(2),
    isRead: false,
    deepLink: '/prizes',
  },
  {
    id: 'n2',
    type: 'draw_results',
    title: 'Weekly Draw #142 results are in',
    body: 'See if your numbers came up. Three winning numbers revealed.',
    titleKey: 'notifications.items.drawResults.title',
    bodyKey: 'notifications.items.drawResults.body',
    i18nVars: { drawNumber: 142 },
    createdAt: hoursAgo(3),
    isRead: false,
    deepLink: '/draws/draw-142',
  },
  {
    id: 'n3',
    type: 'entry_earned',
    title: '+5 Fawz numbers',
    body: 'From your purchase at Carrefour for 12,500 IQD.',
    titleKey: 'notifications.items.entryEarned.title',
    bodyKey: 'notifications.items.entryEarned.body',
    i18nVars: { count: 5, merchant: 'Carrefour', amount: '12,500' },
    createdAt: hoursAgo(8),
    isRead: false,
    deepLink: '/entries',
  },
  {
    id: 'n4',
    type: 'challenge_progress',
    title: 'Weekly Spark — 3/5 days',
    body: "Two more transaction days and you'll bag 100 entries.",
    titleKey: 'notifications.items.challengeProgress.title',
    bodyKey: 'notifications.items.challengeProgress.body',
    i18nVars: { current: 3, target: 5, reward: 100 },
    createdAt: hoursAgo(20),
    isRead: true,
    deepLink: '/challenges/ch-spark',
  },
  {
    id: 'n5',
    type: 'draw_reminder',
    title: 'Live draw in 2 hours',
    body: 'Get ready — the weekly draw broadcasts at 9:00 PM.',
    titleKey: 'notifications.items.drawReminder.title',
    bodyKey: 'notifications.items.drawReminder.body',
    createdAt: daysAgo(1),
    isRead: true,
    deepLink: '/draws/live',
  },
  {
    id: 'n6',
    type: 'referral_reward',
    title: 'Referral reward · +50 entries · 5,000 IQD',
    body: 'Ahmad qualified through your Golden Ticket.',
    titleKey: 'notifications.items.referralReward.title',
    bodyKey: 'notifications.items.referralReward.body',
    i18nVars: { entries: 50, amount: '5,000', name: 'Ahmad' },
    createdAt: daysAgo(2),
    isRead: true,
    deepLink: '/referral/history',
  },
  {
    id: 'n7',
    type: 'challenge_completed',
    title: 'Eid Bonanza completed',
    body: 'You earned +500 entries and 10,000 IQD bonus.',
    titleKey: 'notifications.items.challengeCompleted.title',
    bodyKey: 'notifications.items.challengeCompleted.body',
    i18nVars: { entries: 500, amount: '10,000' },
    createdAt: daysAgo(2),
    isRead: true,
    deepLink: '/challenges/ch-special',
  },
  {
    id: 'n8',
    type: 'system_alert',
    title: 'New terms accepted',
    body: 'You agreed to the updated rewards terms on Apr 12.',
    titleKey: 'notifications.items.termsAccepted.title',
    bodyKey: 'notifications.items.termsAccepted.body',
    i18nVars: { date: 'Apr 12' },
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

interface NotificationListResponse {
  notifications_list: Array<{
    notification_id: string;
    notification_type?: string;
    title?: string;
    body?: string;
    deep_link?: string | null;
    is_read?: boolean;
    date_created?: string;
  }>;
  total_notifications: number;
  page: number;
  page_size: number;
}

function adaptApiNotification(raw: NotificationListResponse['notifications_list'][number]): FawzNotification {
  return {
    id: raw.notification_id,
    type: (raw.notification_type as FawzNotification['type']) ?? 'system_alert',
    title: raw.title ?? '',
    body: raw.body ?? '',
    createdAt: raw.date_created ?? new Date().toISOString(),
    isRead: raw.is_read ?? false,
    deepLink: raw.deep_link ?? undefined,
  };
}

export function useNotifications() {
  return useQuery({
    queryKey: notifKeys.list(),
    queryFn: () =>
      withFallback(
        async () => {
          const { data } = await apiClient.get<NotificationListResponse>(
            '/fawz_consumer_engagement/notifications',
            { params: { page: 1, page_size: 50 } },
          );
          if (!data.notifications_list?.length) return DUMMY_NOTIFS;
          return data.notifications_list.map(adaptApiNotification);
        },
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
        async () => {
          const { data } = await apiClient.get<NotificationListResponse>(
            '/fawz_consumer_engagement/notifications',
            { params: { page: 1, page_size: 1, is_read: false } },
          );
          return data.total_notifications ?? 0;
        },
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
        await apiClient.patch(`/fawz_consumer_engagement/notifications/${id}`, { is_read: true });
      } catch {
        /* fallback: optimistic-only */
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
