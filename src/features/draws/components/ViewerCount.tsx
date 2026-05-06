import { Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useUIStore } from '@stores/ui.store';
import { formatNumber } from '@core/utils/formatters';

interface ViewerCountProps {
  count: number;
}

export function ViewerCount({ count }: ViewerCountProps) {
  const { t } = useTranslation();
  const lang = useUIStore((s) => s.language);
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 px-3 py-1.5 text-white">
      <span className="relative flex size-2">
        <span className="absolute inset-0 rounded-full bg-danger-500 animate-ping opacity-70" />
        <span className="relative inline-flex size-2 rounded-full bg-danger-500" />
      </span>
      <Users className="size-3.5" />
      <span className="text-xs font-semibold tabular-nums">
        {formatNumber(count, lang)}
      </span>
      <span className="text-xs text-white/60 hidden sm:inline">{t('draws.watching')}</span>
    </div>
  );
}
