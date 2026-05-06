import { WifiOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNetworkStatus } from '@shared/hooks/useNetworkStatus';

export function OfflineBanner() {
  const isOnline = useNetworkStatus();
  const { t } = useTranslation();

  if (isOnline) return null;

  return (
    <div className="fixed top-0 inset-x-0 z-50 bg-gradient-to-r from-warning-500 to-gold-500 text-ink-900 shadow-lg animate-slide-up">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-center gap-2 text-sm font-medium">
        <WifiOff className="size-4" />
        <span>{t('errors.network')}</span>
      </div>
    </div>
  );
}
