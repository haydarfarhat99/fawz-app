import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { Input } from '@shared/components/Input';
import { Button } from '@shared/components/Button';
import { useAuth } from '@shared/hooks/useAuth';
import { usePageTitle } from '@shared/hooks/usePageTitle';
import { maskEmail } from '@core/utils/helpers';
import { AppError } from '@core/network/types/apiError';
import { AuthCard } from '../components/AuthCard';
import { OtpInput } from '../components/OtpInput';
import { PasswordStrength } from '../components/PasswordStrength';
import { useResetPassword } from '../services/auth.service';

interface FormErrors {
  code?: string;
  password?: string;
  confirmPassword?: string;
}

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { t } = useTranslation();
  const { setSession } = useAuth();
  const reset = useResetPassword();
  const email = params.get('email') ?? '';
  usePageTitle(t('auth.resetPassword'));

  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const next: FormErrors = {};
    if (code.length !== 6) next.code = t('auth.codeTooShort');
    if (password.length < 6) next.password = t('auth.passwordRequirements');
    if (confirmPassword !== password) next.confirmPassword = t('validation.match');
    setErrors(next);
    if (Object.keys(next).length) return;

    reset.mutate(
      {
        email,
        verify_code: code,
        new_password: password,
        confirm_new_password: confirmPassword,
        code_type: 'ResetCode',
      },
      {
        onSuccess: (data) => {
          const u = data.user;
          setSession(
            {
              id: u?.user_id ?? 'demo-user',
              email: u?.email ?? email,
              fullName: u ? `${u.first_name} ${u.last_name}` : 'Demo Player',
              role: 'consumer',
              entryCount: 12,
              isNew: false,
            },
            data.encrypted_token,
          );
          toast.success(t('auth.passwordReset'));
          navigate('/home', { replace: true });
        },
        onError: (err) => {
          if (err instanceof AppError && err.status === 400) {
            setErrors({ code: t('auth.invalidCode') });
          } else {
            toast.error(t('errors.generic'));
          }
        },
      },
    );
  };

  if (!email) {
    return (
      <AuthCard
        icon={<ShieldCheck className="size-7" />}
        title={t('auth.resetPassword')}
        subtitle={t('auth.noEmailProvided')}
      >
        <Button fullWidth onClick={() => navigate('/forgot-password')}>{t('auth.startOver')}</Button>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      icon={<ShieldCheck className="size-7" />}
      iconTone="from-success-500 to-brand-700"
      title={t('auth.resetPassword')}
      subtitle={t('auth.resetSubtitle', { email: maskEmail(email) })}
      footer={
        <p className="text-center text-sm text-ink-500">
          {t('auth.haveAccount')}{' '}
          <Link to="/login" className="font-bold text-brand-700 hover:text-brand-800 transition-colors">
            {t('auth.signIn')}
          </Link>
        </p>
      }
    >
      <form onSubmit={submit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-ink-700 mb-2 text-center">
            {t('auth.enterCode')}
          </label>
          <OtpInput
            value={code}
            onChange={(v) => {
              setCode(v);
              if (errors.code) setErrors((s) => ({ ...s, code: undefined }));
            }}
            error={!!errors.code}
            autoFocus
          />
          {errors.code && (
            <p className="text-center text-xs text-danger-600 mt-2">{errors.code}</p>
          )}
        </div>

        <div className="space-y-2">
          <Input
            type={showPassword ? 'text' : 'password'}
            label={t('auth.newPassword')}
            placeholder="••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors((s) => ({ ...s, password: undefined }));
            }}
            iconStart={<Lock className="size-4" />}
            iconEnd={
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="text-ink-400 hover:text-ink-700 transition-colors"
                aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            }
            error={errors.password}
            autoComplete="new-password"
            required
          />
          <PasswordStrength password={password} />
        </div>

        <Input
          type={showPassword ? 'text' : 'password'}
          label={t('auth.confirmPassword')}
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (errors.confirmPassword) setErrors((s) => ({ ...s, confirmPassword: undefined }));
          }}
          iconStart={<Lock className="size-4" />}
          error={errors.confirmPassword}
          autoComplete="new-password"
          required
        />

        <Button
          type="submit"
          fullWidth
          size="lg"
          loading={reset.isPending}
          iconEnd={!reset.isPending ? <ArrowRight className="size-4 rtl:rotate-180" /> : undefined}
        >
          {t('auth.resetPassword')}
        </Button>
      </form>
    </AuthCard>
  );
}
