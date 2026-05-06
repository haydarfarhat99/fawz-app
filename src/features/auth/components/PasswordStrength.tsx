import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@core/utils/cn';

interface PasswordStrengthProps {
  password: string;
}

interface Strength {
  score: 0 | 1 | 2 | 3 | 4;
  labelKey: 'weak' | 'fair' | 'good' | 'strong';
  tone: string;
}

function evaluate(pw: string): Strength {
  let score = 0;
  if (pw.length >= 8) score += 1;
  if (/[A-Z]/.test(pw)) score += 1;
  if (/[a-z]/.test(pw)) score += 1;
  if (/[0-9]/.test(pw)) score += 1;
  if (/[^A-Za-z0-9]/.test(pw)) score += 1;
  if (pw.length >= 12) score += 1;
  const capped = Math.min(4, Math.floor(score / 1.5)) as 0 | 1 | 2 | 3 | 4;
  if (capped <= 1) return { score: capped, labelKey: 'weak', tone: 'from-danger-500 to-danger-600' };
  if (capped === 2) return { score: capped, labelKey: 'fair', tone: 'from-warning-500 to-gold-500' };
  if (capped === 3) return { score: capped, labelKey: 'good', tone: 'from-info-500 to-brand-500' };
  return { score: capped, labelKey: 'strong', tone: 'from-success-500 to-success-600' };
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const { t } = useTranslation();
  const strength = useMemo(() => evaluate(password), [password]);
  if (!password) return null;

  return (
    <div className="space-y-1.5">
      <div className="flex gap-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <span
            key={i}
            className={cn(
              'flex-1 h-1.5 rounded-full transition-all duration-300',
              i < strength.score ? `bg-gradient-to-r ${strength.tone}` : 'bg-ink-100',
            )}
          />
        ))}
      </div>
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-ink-500">{t('auth.passwordStrength')}</span>
        <span
          className={cn(
            'font-bold',
            strength.labelKey === 'weak' && 'text-danger-600',
            strength.labelKey === 'fair' && 'text-warning-600',
            strength.labelKey === 'good' && 'text-info-500',
            strength.labelKey === 'strong' && 'text-success-600',
          )}
        >
          {t(`auth.strength.${strength.labelKey}`)}
        </span>
      </div>
    </div>
  );
}
