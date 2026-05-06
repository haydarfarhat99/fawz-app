import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { Input } from '@shared/components/Input';
import { usePageTitle } from '@shared/hooks/usePageTitle';
import { AppError, ValidationError } from '@core/network/types/apiError';
import { PasswordStrength } from '../components/PasswordStrength';
import { useRequestCode, useSignup } from '../services/auth.service';

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface ErrorState {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function SignupPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const signup = useSignup();
  const requestCode = useRequestCode();
  usePageTitle(t('auth.signUp'));

  const [form, setForm] = useState<FormState>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<ErrorState>({});

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((s) => ({ ...s, [key]: value }));
    if (errors[key]) setErrors((s) => ({ ...s, [key]: undefined }));
  };

  const validate = (): ErrorState => {
    const next: ErrorState = {};
    if (form.firstName.trim().length < 1) next.firstName = t('validation.required');
    if (form.lastName.trim().length < 1) next.lastName = t('validation.required');
    if (!form.email.includes('@')) next.email = t('validation.email');
    if (form.password.length < 6) next.password = t('auth.passwordRequirements');
    if (form.confirmPassword !== form.password) next.confirmPassword = t('validation.match');
    return next;
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;

    signup.mutate(
      {
        first_name: form.firstName,
        last_name: form.lastName,
        email: form.email,
        password: form.password,
        confirm_password: form.confirmPassword,
      },
      {
        onSuccess: () => {
          requestCode.mutate({ email: form.email, code_type: 'EmailVerification' });
          toast.success(t('auth.codeSent'));
          navigate(`/verify-email?email=${encodeURIComponent(form.email)}`);
        },
        onError: (err) => {
          if (err instanceof ValidationError) {
            setErrors({
              firstName: err.fieldErrors?.first_name,
              lastName: err.fieldErrors?.last_name,
              email: err.fieldErrors?.email,
              password: err.fieldErrors?.password,
              confirmPassword: err.fieldErrors?.confirm_password,
            });
          } else if (err instanceof AppError && err.status === 409) {
            setErrors({ email: t('auth.emailTaken') });
          } else {
            toast.error(t('errors.generic'));
          }
        },
      },
    );
  };

  return (
    <div className="animate-slide-up">
      <div className="flex flex-col items-center mb-8">
        <div className="relative">
          <div className="absolute inset-0 -z-10 blur-3xl rounded-full scale-110 bg-teal-500/30" />
          <img
            src="/brand/fawz-logo.png"
            alt="FAWZ"
            width={180}
            height={228}
            className="drop-shadow-[0_24px_48px_rgba(0,198,167,0.25)]"
          />
        </div>
      </div>

      <div className="rounded-3xl bg-white/95 backdrop-blur-xl shadow-[0_24px_64px_-12px_rgba(0,0,0,0.4)] border border-white/40 p-6 md:p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black text-ink-900 mb-1 tracking-tight">
            {t('auth.createAccount')}
          </h1>
          <p className="text-sm text-ink-500">{t('auth.createAccountSubtitle')}</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label={t('auth.firstName')}
            placeholder="Ahmed"
            value={form.firstName}
            onChange={(e) => setField('firstName', e.target.value)}
            iconStart={<User className="size-4" />}
            error={errors.firstName}
            autoComplete="given-name"
            required
          />
          <Input
            label={t('auth.lastName')}
            placeholder="Hassan"
            value={form.lastName}
            onChange={(e) => setField('lastName', e.target.value)}
            error={errors.lastName}
            autoComplete="family-name"
            required
          />
        </div>
        <Input
          type="email"
          label={t('auth.email')}
          placeholder="you@example.com"
          value={form.email}
          onChange={(e) => setField('email', e.target.value)}
          iconStart={<Mail className="size-4" />}
          error={errors.email}
          autoComplete="email"
          required
        />
        <div className="space-y-2">
          <Input
            type={showPassword ? 'text' : 'password'}
            label={t('auth.password')}
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setField('password', e.target.value)}
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
            helper={!errors.password ? t('auth.passwordRequirements') : undefined}
            autoComplete="new-password"
            required
          />
          <PasswordStrength password={form.password} />
        </div>
        <Input
          type={showPassword ? 'text' : 'password'}
          label={t('auth.confirmPassword')}
          placeholder="••••••••"
          value={form.confirmPassword}
          onChange={(e) => setField('confirmPassword', e.target.value)}
          iconStart={<Lock className="size-4" />}
          error={errors.confirmPassword}
          autoComplete="new-password"
          required
        />
        <p className="text-[11px] text-ink-400 leading-relaxed">{t('auth.termsHint')}</p>
        <button
          type="submit"
          disabled={signup.isPending}
          className="group relative w-full h-12 rounded-2xl font-bold text-white overflow-hidden shadow-[0_12px_32px_-8px_rgba(0,198,167,0.6)] disabled:opacity-60 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
          style={{ background: 'linear-gradient(135deg, #00C6A7 0%, #009E86 60%, #00312E 100%)' }}
        >
          <span className="inline-flex items-center justify-center gap-2 tracking-wide">
            {signup.isPending ? (
              <span className="size-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
            ) : (
              <>
                {t('auth.createAccount')}
                <ArrowRight className="size-4 rtl:rotate-180" />
              </>
            )}
          </span>
        </button>
        </form>

        <div className="mt-6 pt-5 border-t border-ink-100">
          <p className="text-center text-sm text-ink-500">
            {t('auth.haveAccount')}{' '}
            <Link to="/login" className="font-bold text-teal-700 hover:text-teal-900 transition-colors">
              {t('auth.signIn')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
