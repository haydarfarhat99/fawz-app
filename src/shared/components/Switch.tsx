import { useId } from 'react';
import { cn } from '@core/utils/cn';

interface SwitchProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  id?: string;
}

export function Switch({ checked, onChange, label, description, disabled, id }: SwitchProps) {
  const fallbackId = useId();
  const inputId = id ?? fallbackId;
  return (
    <label
      htmlFor={inputId}
      className={cn(
        'flex items-start justify-between gap-4 cursor-pointer',
        disabled && 'opacity-60 cursor-not-allowed',
      )}
    >
      <div className="flex-1 min-w-0">
        {label && <span className="block text-sm font-medium text-ink-900">{label}</span>}
        {description && <span className="block text-xs text-ink-500 mt-0.5">{description}</span>}
      </div>
      <span className="relative inline-flex shrink-0 items-center">
        <input
          id={inputId}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="peer sr-only"
        />
        <span
          className={cn(
            'inline-flex h-6 w-11 rounded-full transition-colors duration-200',
            'peer-focus-visible:ring-4 peer-focus-visible:ring-brand-200',
            checked ? 'bg-gradient-to-br from-brand-500 to-brand-700' : 'bg-ink-300',
          )}
        >
          <span
            className={cn(
              'mt-0.5 size-5 rounded-full bg-white shadow-md transition-transform duration-200',
              checked ? 'translate-x-5 ms-0.5 rtl:-translate-x-5' : 'ms-0.5',
            )}
          />
        </span>
      </span>
    </label>
  );
}
