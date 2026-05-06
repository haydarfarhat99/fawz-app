import { useId } from 'react';
import { Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@core/utils/cn';

interface PreferenceRowProps {
  label: string;
  description?: string;
  icon: React.ReactNode;
  iconTone: string;
  checked: boolean;
  onChange: (next: boolean) => void;
  locked?: boolean;
  disabled?: boolean;
}

export function PreferenceRow({
  label,
  description,
  icon,
  iconTone,
  checked,
  onChange,
  locked,
  disabled,
}: PreferenceRowProps) {
  const inputId = useId();
  const { t } = useTranslation();
  return (
    <label
      htmlFor={inputId}
      className={cn(
        'group flex items-start gap-3 rounded-2xl border bg-white p-4 transition-all duration-200',
        locked || disabled
          ? 'opacity-90 cursor-not-allowed border-ink-100'
          : 'border-ink-100 hover:border-brand-200 hover:shadow-[0_4px_12px_-4px_rgba(0, 198, 167,0.15)] cursor-pointer',
      )}
    >
      <div
        className={cn(
          'flex size-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br icon-3d',
          iconTone,
        )}
      >
        {icon}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-bold text-ink-900">{label}</span>
          {locked && (
            <span className="inline-flex items-center gap-1 rounded-full bg-ink-100 text-ink-600 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
              <Lock className="size-2.5" />
              {t('notifPrefs.required')}
            </span>
          )}
        </div>
        {description && <p className="text-xs text-ink-500 mt-0.5">{description}</p>}
      </div>

      <span className="relative inline-flex shrink-0 items-center self-center">
        <input
          id={inputId}
          type="checkbox"
          checked={checked}
          onChange={(e) => !locked && !disabled && onChange(e.target.checked)}
          disabled={locked || disabled}
          className="peer sr-only"
        />
        <span
          className={cn(
            'inline-flex h-7 w-12 rounded-full transition-colors duration-200',
            checked ? 'bg-gradient-to-br from-brand-500 to-brand-700' : 'bg-ink-300',
            (locked || disabled) && 'opacity-70',
          )}
        >
          <span
            className={cn(
              'mt-0.5 size-6 rounded-full bg-white shadow-md transition-transform duration-300',
              checked ? 'translate-x-5 ms-0.5 rtl:-translate-x-5' : 'ms-0.5',
            )}
          />
        </span>
      </span>
    </label>
  );
}
