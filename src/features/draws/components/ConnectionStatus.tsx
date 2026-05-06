import { Wifi, WifiOff, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@core/utils/cn';
import type { ConnectionState } from '../types/draw.types';

interface ConnectionStatusProps {
  state: ConnectionState;
}

export function ConnectionStatus({ state }: ConnectionStatusProps) {
  const { t } = useTranslation();
  const config = {
    connecting: { icon: Loader2, label: t('draws.connecting'), tone: 'text-white/70 bg-white/10', spin: true },
    connected: { icon: Wifi, label: t('draws.connected'), tone: 'text-success-500 bg-success-500/10', spin: false },
    degraded: { icon: Wifi, label: t('draws.degraded'), tone: 'text-warning-500 bg-warning-500/15', spin: false },
    disconnected: { icon: WifiOff, label: t('draws.disconnected'), tone: 'text-danger-500 bg-danger-500/15', spin: false },
  } as const;
  const c = config[state];
  const Icon = c.icon;
  return (
    <div className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold backdrop-blur-sm', c.tone)}>
      <Icon className={cn('size-3', c.spin && 'animate-spin')} />
      <span>{c.label}</span>
    </div>
  );
}
