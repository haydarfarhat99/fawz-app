import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  UserPlus,
  Gift,
  Tv,
  User,
  LifeBuoy,
  Settings,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { PageHeader } from '@shared/components/PageHeader';
import { useAuth } from '@shared/hooks/useAuth';
import { usePageTitle } from '@shared/hooks/usePageTitle';
import { useUnreadCount } from '@features/notifications/services/notification.service';

interface MoreItem {
  to: string;
  icon: typeof Bell;
  titleKey: string;
  descriptionKey?: string;
  badge?: number;
  tone: 'teal' | 'gold' | 'mint';
}

const ITEMS: MoreItem[] = [
  { to: '/notifications',          icon: Bell,      titleKey: 'nav.notifications',     descriptionKey: 'more.notificationsDesc', tone: 'teal' },
  { to: '/referral',               icon: UserPlus,  titleKey: 'nav.referral',          descriptionKey: 'more.referralDesc',      tone: 'mint' },
  { to: '/prizes',                 icon: Gift,      titleKey: 'nav.prizes',            descriptionKey: 'more.prizesDesc',        tone: 'gold' },
  { to: '/draws/results',          icon: Tv,        titleKey: 'nav.draws',             descriptionKey: 'more.drawsDesc',         tone: 'teal' },
  { to: '/profile',                icon: User,      titleKey: 'nav.profile',           descriptionKey: 'more.profileDesc',       tone: 'teal' },
  { to: '/settings/notifications', icon: Settings,  titleKey: 'more.preferences',      descriptionKey: 'more.preferencesDesc',   tone: 'mint' },
  { to: '/support/disputes',       icon: LifeBuoy,  titleKey: 'nav.support',           descriptionKey: 'more.supportDesc',       tone: 'mint' },
];

const TONE_STYLES: Record<MoreItem['tone'], { iconBg: string; iconText: string }> = {
  teal: { iconBg: 'bg-gradient-to-br from-teal-100 to-teal-300/60', iconText: 'text-teal-700' },
  gold: { iconBg: 'bg-gradient-to-br from-gold-200 to-gold-400/70',  iconText: 'text-gold-700' },
  mint: { iconBg: 'bg-gradient-to-br from-mint-50 to-teal-100',      iconText: 'text-teal-700' },
};

export default function MorePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { data: unreadCount = 0 } = useUnreadCount();
  usePageTitle(t('more.title'));

  return (
    <ScreenWrapper>
      <PageHeader title={t('more.title')} description={t('more.subtitle')} />

      <div className="space-y-2.5 mb-6">
        {ITEMS.map((item) => {
          const tone = TONE_STYLES[item.tone];
          const badge = item.to === '/notifications' && unreadCount > 0 ? unreadCount : undefined;
          return (
            <button
              key={item.to}
              type="button"
              onClick={() => navigate(item.to)}
              className="group w-full flex items-center gap-3.5 rounded-2xl bg-white border border-teal-100 p-3.5 text-start hover:border-teal-300 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-12px_rgba(0,198,167,0.35)] transition-all"
            >
              <div className={`flex size-12 items-center justify-center rounded-2xl shrink-0 ${tone.iconBg}`}>
                <item.icon className={`size-5 ${tone.iconText}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-teal-900">{t(item.titleKey)}</span>
                  {badge !== undefined && (
                    <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-danger-500 text-[10px] font-black text-white px-1.5 tabular-nums">
                      {badge > 9 ? '9+' : badge}
                    </span>
                  )}
                </div>
                {item.descriptionKey && (
                  <p className="text-xs text-teal-800/70 mt-0.5 truncate">{t(item.descriptionKey)}</p>
                )}
              </div>
              <ChevronRight className="size-5 text-teal-400 rtl:rotate-180 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform" />
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={logout}
        className="w-full flex items-center justify-center gap-2 rounded-2xl border border-danger-500/30 bg-danger-50/50 p-3.5 text-sm font-bold text-danger-600 hover:bg-danger-50 hover:border-danger-500 transition-all"
      >
        <LogOut className="size-4 rtl:rotate-180" />
        {t('common.logout')}
      </button>
    </ScreenWrapper>
  );
}
