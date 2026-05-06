import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { MediaConsentModal } from '@features/onboarding/components/MediaConsentModal';
import {
  Bell,
  Globe,
  ChevronRight,
  Award,
  Flame,
  UserPlus,
  LogOut,
  LifeBuoy,
  Camera,
  FileText,
} from 'lucide-react';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { PageHeader } from '@shared/components/PageHeader';
import { Card } from '@shared/components/Card';
import { Skeleton } from '@shared/components/Skeleton';
import { ErrorState } from '@shared/components/ErrorState';
import { Button } from '@shared/components/Button';
import { usePageTitle } from '@shared/hooks/usePageTitle';
import { useUIStore } from '@stores/ui.store';
import { useAuth } from '@shared/hooks/useAuth';
import { setLanguage } from '@core/i18n';
import { formatNumber } from '@core/utils/formatters';
import { ProfileHero } from '../components/ProfileHero';
import { BadgeChip } from '../components/BadgeChip';
import { useProfile } from '../services/profile.service';

export default function ProfilePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const language = useUIStore((s) => s.language);
  const setStoreLanguage = useUIStore((s) => s.setLanguage);
  const [consentOpen, setConsentOpen] = useState(false);
  usePageTitle(t('profile.title'));

  const { data: profile, isLoading, isError, refetch } = useProfile();

  const toggleLanguage = () => {
    const next = language === 'en' ? 'ar' : 'en';
    setStoreLanguage(next);
    setLanguage(next);
  };

  if (isLoading) {
    return (
      <ScreenWrapper>
        <PageHeader title={t('profile.title')} />
        <Card variant="gradient" padding="lg" className="mb-5">
          <div className="flex items-start gap-4 mb-5">
            <Skeleton className="size-16" rounded="full" />
            <div className="flex-1 pt-2">
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-6 w-40 mb-1" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
          </div>
        </Card>
      </ScreenWrapper>
    );
  }

  if (isError || !profile) {
    return (
      <ScreenWrapper>
        <PageHeader title={t('profile.title')} />
        <ErrorState
          title={t('states.error.title')}
          subtitle={t('states.error.subtitle')}
          retryLabel={t('common.retry')}
          onRetry={() => refetch()}
        />
      </ScreenWrapper>
    );
  }

  const earnedBadges = profile.badges.filter((b) => b.earned).length;

  return (
    <ScreenWrapper>
      <PageHeader title={t('profile.title')} description={t('profile.subtitle')} />

      <ProfileHero profile={profile} />

      <Card padding="lg" className="mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-ink-900 inline-flex items-center gap-2">
            <Award className="size-5 text-gold-500" />
            {t('profile.badgesTitle')}
          </h2>
          <span className="text-xs font-bold text-ink-500 tabular-nums">
            {earnedBadges} / {profile.badges.length}
          </span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 md:gap-3">
          {profile.badges.map((b) => (
            <BadgeChip key={b.id} badge={b} />
          ))}
        </div>
      </Card>

      <div className="grid sm:grid-cols-2 gap-3 mb-4">
        <Card padding="md" className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-danger-500 to-gold-500 text-white icon-3d">
            <Flame className="size-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] uppercase tracking-wider font-bold text-ink-500">
              {t('profile.weeklySpark')}
            </div>
            <div className="text-base font-bold text-ink-900">
              {t('profile.daysStreak', { count: profile.weeklySparkStreak })}
            </div>
          </div>
        </Card>
        <Card padding="md" className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-success-500 to-brand-600 text-white icon-3d">
            <UserPlus className="size-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] uppercase tracking-wider font-bold text-ink-500">
              {t('profile.referrals')}
            </div>
            <div className="text-base font-bold text-ink-900">
              {t('profile.peopleInvited', { count: profile.referralCount, formatted: formatNumber(profile.referralCount, language) })}
            </div>
          </div>
        </Card>
      </div>

      <Card padding="none" className="mb-4 overflow-hidden">
        <SettingsRow
          icon={<Bell className="size-5 text-white" />}
          iconTone="from-brand-500 to-brand-700"
          label={t('profile.settings.notifications')}
          description={t('profile.settings.notificationsDesc')}
          onClick={() => navigate('/settings/notifications')}
        />
        <SettingsRow
          icon={<Globe className="size-5 text-white" />}
          iconTone="from-info-500 to-info-500/80"
          label={t('common.language')}
          description={language === 'en' ? 'English' : 'العربية'}
          rightLabel={language === 'en' ? 'AR' : 'EN'}
          onClick={toggleLanguage}
        />
        <SettingsRow
          icon={<Camera className="size-5 text-white" />}
          iconTone="from-success-500 to-brand-600"
          label={t('profile.settings.mediaConsent')}
          description={
            profile.mediaConsentGiven
              ? t('profile.settings.mediaConsentGiven')
              : t('profile.settings.mediaConsentNotGiven')
          }
          onClick={() => setConsentOpen(true)}
        />
        <SettingsRow
          icon={<FileText className="size-5 text-white" />}
          iconTone="from-ink-700 to-ink-900"
          label={t('profile.settings.terms')}
          description={t('profile.settings.termsDesc')}
          onClick={() => navigate('/profile')}
          last
        />
      </Card>

      <Card padding="none" className="mb-4 overflow-hidden">
        <SettingsRow
          icon={<LifeBuoy className="size-5 text-white" />}
          iconTone="from-warning-500 to-warning-600"
          label={t('profile.settings.support')}
          description={t('profile.settings.supportDesc')}
          onClick={() => navigate('/support/disputes')}
          last
        />
      </Card>

      <Button
        variant="outline"
        fullWidth
        onClick={logout}
        iconStart={<LogOut className="size-4 rtl:rotate-180" />}
        className="!border-danger-200 !text-danger-600 hover:!bg-danger-50 hover:!border-danger-300"
      >
        {t('common.logout')}
      </Button>

      <MediaConsentModal
        open={consentOpen}
        onClose={() => setConsentOpen(false)}
        onSubmit={() => {
          setConsentOpen(false);
          toast.success(t('notifPrefs.saved'));
        }}
      />

      <p className="mt-6 text-center text-xs text-ink-400">
        {t('profile.memberSince', {
          date: new Date(profile.joinedAt).toLocaleDateString(language === 'ar' ? 'ar-IQ' : 'en-US', {
            month: 'long',
            year: 'numeric',
          }),
        })}
      </p>
    </ScreenWrapper>
  );
}

function SettingsRow({
  icon,
  iconTone,
  label,
  description,
  rightLabel,
  onClick,
  last,
}: {
  icon: React.ReactNode;
  iconTone: string;
  label: string;
  description?: string;
  rightLabel?: string;
  onClick: () => void;
  last?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex w-full items-center gap-3 px-4 py-3.5 text-start transition-colors hover:bg-ink-50/60 ${last ? '' : 'border-b border-ink-100'}`}
    >
      <div className={`flex size-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br icon-3d ${iconTone}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-bold text-ink-900">{label}</div>
        {description && <div className="text-xs text-ink-500 truncate">{description}</div>}
      </div>
      {rightLabel && (
        <span className="text-xs font-bold text-brand-700 bg-brand-50 rounded-md px-2 py-1">
          {rightLabel}
        </span>
      )}
      <ChevronRight className="size-4 text-ink-300 rtl:rotate-180 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform" />
    </button>
  );
}
