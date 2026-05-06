import { useTranslation } from 'react-i18next';
import { Tv, Trophy, Hash, Target, UserPlus, Coins, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { PageHeader } from '@shared/components/PageHeader';
import { Card } from '@shared/components/Card';
import { Skeleton } from '@shared/components/Skeleton';
import { ErrorState } from '@shared/components/ErrorState';
import { usePageTitle } from '@shared/hooks/usePageTitle';
import { PreferenceRow } from '../components/PreferenceRow';
import {
  useNotificationPreferences,
  useUpdatePreference,
} from '../services/notification.service';
import type { PreferenceKey } from '../types/notification.types';

export default function NotificationPreferencesPage() {
  const { t } = useTranslation();
  const { data, isLoading, isError, refetch } = useNotificationPreferences();
  const update = useUpdatePreference();
  usePageTitle(t('notifPrefs.title'));

  const handleToggle = (key: PreferenceKey, value: boolean) => {
    update.mutate(
      { key, value },
      {
        onSuccess: () => toast.success(t('notifPrefs.saved')),
        onError: () => toast.error(t('errors.generic')),
      },
    );
  };

  const items: {
    key: PreferenceKey;
    icon: React.ReactNode;
    iconTone: string;
    locked?: boolean;
  }[] = [
    {
      key: 'drawReminders',
      icon: <Tv className="size-5 text-white" />,
      iconTone: 'from-danger-500 to-brand-700',
    },
    {
      key: 'drawResults',
      icon: <Trophy className="size-5 text-ink-900" />,
      iconTone: 'from-gold-300 to-gold-600',
    },
    {
      key: 'entryEarned',
      icon: <Hash className="size-5 text-white" />,
      iconTone: 'from-brand-400 to-brand-700',
    },
    {
      key: 'challengeUpdates',
      icon: <Target className="size-5 text-white" />,
      iconTone: 'from-info-500 to-brand-700',
    },
    {
      key: 'referralRewards',
      icon: <UserPlus className="size-5 text-white" />,
      iconTone: 'from-success-500 to-brand-600',
    },
    {
      key: 'prizeCredited',
      icon: <Coins className="size-5 text-ink-900" />,
      iconTone: 'from-gold-300 to-gold-500',
    },
    {
      key: 'systemCritical',
      icon: <AlertCircle className="size-5 text-white" />,
      iconTone: 'from-ink-700 to-ink-900',
      locked: true,
    },
  ];

  return (
    <ScreenWrapper>
      <PageHeader
        title={t('notifPrefs.title')}
        description={t('notifPrefs.subtitle')}
        back
      />

      {isLoading ? (
        <div className="space-y-2.5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3 rounded-2xl bg-white border border-ink-100 p-4">
              <Skeleton className="size-10" rounded="2xl" />
              <div className="flex-1">
                <Skeleton className="h-4 w-40 mb-2" />
                <Skeleton className="h-3 w-2/3" />
              </div>
              <Skeleton className="h-7 w-12" rounded="full" />
            </div>
          ))}
        </div>
      ) : isError || !data ? (
        <ErrorState
          title={t('states.error.title')}
          subtitle={t('states.error.subtitle')}
          retryLabel={t('common.retry')}
          onRetry={() => refetch()}
        />
      ) : (
        <>
          <Card padding="md" className="mb-4 !bg-info-50 border-info-500/20">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="size-4 text-info-500 shrink-0 mt-0.5" />
              <p className="text-xs text-ink-700 leading-relaxed">
                {t('notifPrefs.autoSaveHint')}
              </p>
            </div>
          </Card>
          <div className="space-y-2.5">
            {items.map((it) => (
              <PreferenceRow
                key={it.key}
                label={t(`notifPrefs.${it.key}.label`)}
                description={t(`notifPrefs.${it.key}.description`)}
                icon={it.icon}
                iconTone={it.iconTone}
                checked={data[it.key]}
                onChange={(v) => handleToggle(it.key, v)}
                locked={it.locked}
                disabled={update.isPending}
              />
            ))}
          </div>
        </>
      )}
    </ScreenWrapper>
  );
}
