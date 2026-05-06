import { cn } from '@core/utils/cn';

export interface TabItem {
  key: string;
  label: string;
  count?: number;
}

interface TabsProps {
  items: TabItem[];
  active: string;
  onChange: (key: string) => void;
  variant?: 'default' | 'pills';
  className?: string;
}

export function Tabs({ items, active, onChange, variant = 'default', className }: TabsProps) {
  if (variant === 'pills') {
    return (
      <div className={cn('inline-flex gap-1 rounded-full bg-ink-100 p-1', className)}>
        {items.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => onChange(item.key)}
            className={cn(
              'px-4 py-1.5 rounded-full text-sm font-medium transition-all',
              active === item.key
                ? 'bg-white text-ink-900 shadow-sm'
                : 'text-ink-500 hover:text-ink-900',
            )}
          >
            {item.label}
            {item.count !== undefined && (
              <span className="ms-1.5 text-xs opacity-70">{item.count}</span>
            )}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={cn('flex border-b border-ink-200', className)}>
      {items.map((item) => (
        <button
          key={item.key}
          type="button"
          onClick={() => onChange(item.key)}
          className={cn(
            'relative px-4 py-3 text-sm font-medium transition-colors',
            active === item.key ? 'text-brand-700' : 'text-ink-500 hover:text-ink-900',
          )}
        >
          <span className="inline-flex items-center gap-2">
            {item.label}
            {item.count !== undefined && (
              <span
                className={cn(
                  'inline-flex h-5 min-w-5 items-center justify-center rounded-full text-[11px] font-semibold px-1.5',
                  active === item.key ? 'bg-brand-100 text-brand-700' : 'bg-ink-100 text-ink-600',
                )}
              >
                {item.count}
              </span>
            )}
          </span>
          {active === item.key && (
            <span className="absolute inset-x-0 -bottom-px h-0.5 bg-gradient-to-r from-brand-500 to-brand-700 rounded-full" />
          )}
        </button>
      ))}
    </div>
  );
}
