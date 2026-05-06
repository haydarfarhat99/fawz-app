import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { Database, FlaskConical } from 'lucide-react';
import { useUIStore } from '@stores/ui.store';
import { cn } from '@core/utils/cn';

interface DataSourceToggleProps {
  variant?: 'pill' | 'compact';
  className?: string;
}

export function DataSourceToggle({ variant = 'pill', className }: DataSourceToggleProps) {
  const { t } = useTranslation();
  const dataSource = useUIStore((s) => s.dataSource);
  const toggleDataSource = useUIStore((s) => s.toggleDataSource);
  const qc = useQueryClient();
  const isReal = dataSource === 'real';

  const handle = () => {
    toggleDataSource();
    qc.invalidateQueries();
  };

  const label = isReal ? t('common.dataSource.real') : t('common.dataSource.mock');
  const tooltip = isReal
    ? t('common.dataSource.tooltipReal')
    : t('common.dataSource.tooltipMock');
  const switchLabel = isReal
    ? t('common.dataSource.switchToMock')
    : t('common.dataSource.switchToReal');

  if (variant === 'compact') {
    return (
      <button
        type="button"
        onClick={handle}
        title={tooltip}
        aria-label={switchLabel}
        className={cn(
          'inline-flex h-10 items-center gap-1.5 px-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors',
          isReal
            ? 'bg-success-50 text-success-600 hover:bg-success-100'
            : 'bg-gold-50 text-gold-700 hover:bg-gold-100',
          className,
        )}
      >
        {isReal ? <Database className="size-4" /> : <FlaskConical className="size-4" />}
        <span className="hidden sm:inline">{label}</span>
      </button>
    );
  }

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full p-0.5 bg-ink-100 text-xs font-bold',
        className,
      )}
      role="group"
      aria-label={t('common.dataSource.label')}
    >
      <button
        type="button"
        onClick={() => isReal || handle()}
        className={cn(
          'inline-flex items-center gap-1 rounded-full px-2.5 h-7 transition-colors',
          isReal ? 'bg-success-500 text-white shadow' : 'text-ink-500 hover:text-ink-900',
        )}
        aria-pressed={isReal}
        title={t('common.dataSource.tooltipReal')}
      >
        <Database className="size-3" />
        {t('common.dataSource.real')}
      </button>
      <button
        type="button"
        onClick={() => !isReal || handle()}
        className={cn(
          'inline-flex items-center gap-1 rounded-full px-2.5 h-7 transition-colors',
          !isReal ? 'bg-gold-500 text-ink-900 shadow' : 'text-ink-500 hover:text-ink-900',
        )}
        aria-pressed={!isReal}
        title={t('common.dataSource.tooltipMock')}
      >
        <FlaskConical className="size-3" />
        {t('common.dataSource.mock')}
      </button>
    </div>
  );
}
