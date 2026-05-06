import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Bell, CheckCheck, Settings2 } from 'lucide-react';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { PageHeader } from '@shared/components/PageHeader';
import { Card } from '@shared/components/Card';
import { Skeleton } from '@shared/components/Skeleton';
import { EmptyState } from '@shared/components/EmptyState';
import { ErrorState } from '@shared/components/ErrorState';
import { Button } from '@shared/components/Button';
import { usePageTitle } from '@shared/hooks/usePageTitle';
import { NotificationRow } from '../components/NotificationRow';
import {
  useMarkAllRead,
  useMarkRead,
  useNotifications,
  useUnreadCount,
} from '../services/notification.service';

export default function NotificationsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  usePageTitle(t('notifications.title'));

  const { data, isLoading, isError, refetch } = useNotifications();
  const unreadQ = useUnreadCount();
  const markAllRead = useMarkAllRead();
  const markRead = useMarkRead();

  const unreadCount = unreadQ.data ?? 0;

  return (
    <ScreenWrapper>
      <PageHeader
        title={t('notifications.title')}
        description={
          unreadCount > 0
            ? t('notifications.unreadCount', { count: unreadCount })
            : t('notifications.allCaughtUp')
        }
        actions={
          <>
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => markAllRead.mutate()}
                loading={markAllRead.isPending}
                iconStart={<CheckCheck className="size-4" />}
              >
                {t('notifications.markAllRead')}
              </Button>
            )}
            <button
              type="button"
              onClick={() => navigate('/settings/notifications')}
              className="inline-flex size-10 items-center justify-center rounded-xl border border-ink-200 bg-white text-ink-700 hover:border-brand-300 hover:text-brand-700 transition-colors"
              aria-label={t('common.settings')}
            >
              <Settings2 className="size-5" />
            </button>
          </>
        }
      />

      {isLoading ? (
        <div className="space-y-2.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3 rounded-2xl bg-white border border-ink-100 p-4">
              <Skeleton className="size-11" rounded="2xl" />
              <div className="flex-1">
                <Skeleton className="h-4 w-44 mb-2" />
                <Skeleton className="h-3 w-full mb-1" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <ErrorState
          title={t('states.error.title')}
          subtitle={t('states.error.subtitle')}
          retryLabel={t('common.retry')}
          onRetry={() => refetch()}
        />
      ) : !data || data.length === 0 ? (
        <Card variant="elevated" padding="lg">
          <EmptyState
            icon={<Bell className="size-9" />}
            title={t('notifications.emptyTitle')}
            subtitle={t('notifications.emptySubtitle')}
          />
        </Card>
      ) : (
        <div className="space-y-2.5">
          {data.map((n) => (
            <NotificationRow
              key={n.id}
              notification={n}
              onClick={() => {
                if (!n.isRead) markRead.mutate(n.id);
              }}
            />
          ))}
        </div>
      )}
    </ScreenWrapper>
  );
}
