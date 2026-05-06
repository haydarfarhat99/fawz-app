import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@core/utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helper?: string;
  error?: string;
  iconStart?: ReactNode;
  iconEnd?: ReactNode;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, label, helper, error, iconStart, iconEnd, fullWidth = true, id, ...rest },
  ref,
) {
  const fallbackId = useId();
  const inputId = id ?? fallbackId;
  return (
    <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full')}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-ink-700">
          {label}
        </label>
      )}
      <div
        className={cn(
          'group relative flex items-center rounded-xl border-2 bg-white transition-all duration-150',
          'border-ink-200 focus-within:border-brand-500 focus-within:shadow-[0_0_0_3px_rgba(0,198,167,0.18)]',
          error && 'border-danger-500 focus-within:border-danger-500 focus-within:shadow-[0_0_0_3px_rgba(239,68,68,0.18)]',
        )}
      >
        {iconStart && <span className="ps-3 text-ink-400">{iconStart}</span>}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'flex-1 border-0 bg-transparent py-3 px-3 text-sm text-ink-900 placeholder:text-ink-400 outline-none focus:outline-none focus:ring-0 focus:shadow-none appearance-none',
            'disabled:cursor-not-allowed disabled:opacity-60',
            iconStart && 'ps-2',
            iconEnd && 'pe-2',
            className,
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : helper ? `${inputId}-helper` : undefined}
          {...rest}
        />
        {iconEnd && <span className="pe-3 text-ink-400">{iconEnd}</span>}
      </div>
      {error ? (
        <span id={`${inputId}-error`} className="text-xs text-danger-600">
          {error}
        </span>
      ) : helper ? (
        <span id={`${inputId}-helper`} className="text-xs text-ink-500">
          {helper}
        </span>
      ) : null}
    </div>
  );
});
