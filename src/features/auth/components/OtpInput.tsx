import { useEffect, useRef } from 'react';
import { cn } from '@core/utils/cn';

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (next: string) => void;
  onComplete?: (full: string) => void;
  disabled?: boolean;
  error?: boolean;
  autoFocus?: boolean;
}

export function OtpInput({
  length = 6,
  value,
  onChange,
  onComplete,
  disabled,
  error,
  autoFocus = true,
}: OtpInputProps) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (autoFocus) inputsRef.current[0]?.focus();
  }, [autoFocus]);

  const setDigit = (index: number, digit: string) => {
    const cleaned = digit.replace(/\D/g, '').slice(0, 1);
    const next = (value.padEnd(length, ' ').slice(0, length).split('') as string[]);
    next[index] = cleaned || ' ';
    const joined = next.join('').replace(/\s/g, '');
    onChange(joined);
    if (cleaned && index < length - 1) inputsRef.current[index + 1]?.focus();
    if (joined.length === length) onComplete?.(joined);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) inputsRef.current[index - 1]?.focus();
    if (e.key === 'ArrowRight' && index < length - 1) inputsRef.current[index + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (pasted) {
      e.preventDefault();
      onChange(pasted);
      const focusIndex = Math.min(pasted.length, length - 1);
      inputsRef.current[focusIndex]?.focus();
      if (pasted.length === length) onComplete?.(pasted);
    }
  };

  return (
    <div dir="ltr" className="flex items-center justify-center gap-2 sm:gap-2.5">
      {Array.from({ length }).map((_, i) => {
        const ch = value[i] ?? '';
        const filled = !!ch;
        return (
          <input
            key={i}
            ref={(el) => {
              inputsRef.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={1}
            value={ch}
            disabled={disabled}
            onChange={(e) => setDigit(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            onPaste={handlePaste}
            className={cn(
              'size-12 sm:size-14 rounded-xl border text-center font-black text-2xl tabular-nums transition-all duration-200',
              'bg-white shadow-[0_2px_4px_rgba(15,23,42,0.04),inset_0_1px_0_rgba(255,255,255,0.6)]',
              'focus:outline-none focus:ring-4',
              error
                ? 'border-danger-500 text-danger-600 focus:border-danger-500 focus:ring-danger-100'
                : filled
                  ? 'border-brand-500 text-brand-700 focus:border-brand-500 focus:ring-brand-100'
                  : 'border-ink-200 text-ink-900 focus:border-brand-500 focus:ring-brand-100',
              disabled && 'opacity-60 cursor-not-allowed',
            )}
          />
        );
      })}
    </div>
  );
}
