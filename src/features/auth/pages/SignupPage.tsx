import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, UserPlus, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { Input } from '@shared/components/Input';
import { Button } from '@shared/components/Button';
import { usePageTitle } from '@shared/hooks/usePageTitle';
import { AppError, ValidationError } from '@core/network/types/apiError';
import { AuthCard } from '../components/AuthCard';
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
    <AuthCard
      icon={<UserPlus className="size-7" />}
      iconTone="from-brand-500 to-brand-700"
      title={t('auth.createAccount')}
      subtitle={t('auth.createAccountSubtitle')}
      footer={
        <p className="text-center text-sm text-ink-500">
          {t('auth.haveAccount')}{' '}
          <Link to="/login" className="font-bold text-brand-700 hover:text-brand-800 transition-colors">
            {t('auth.signIn')}
          </Link>
        </p>
      }
    >
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
        <Button
          type="submit"
          fullWidth
          size="lg"
          loading={signup.isPending}
          iconEnd={!signup.isPending ? <ArrowRight className="size-4 rtl:rotate-180" /> : undefined}
        >
          {t('auth.createAccount')}
        </Button>
      </form>
    </AuthCard>
  );
}
