import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { Input } from '@shared/components/Input';
import { Button } from '@shared/components/Button';
import { useAuth } from '@shared/hooks/useAuth';
import { usePageTitle } from '@shared/hooks/usePageTitle';
import { env } from '@config/env';
import { AppError, ValidationError } from '@core/network/types/apiError';
import { AuthCard } from '../components/AuthCard';
import { useLogin } from '../services/auth.service';

export default function LoginPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { setSession } = useAuth();
  const login = useLogin();
  usePageTitle(t('auth.signIn'));

  const [email, setEmail] = useState(env.testEmail);
  const [password, setPassword] = useState(env.testPassword);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!email.includes('@')) next.email = t('validation.email');
    if (password.length < 6) next.password = t('validation.password');
    setErrors(next);
    if (Object.keys(next).length) return;

    login.mutate(
      { email, password },
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
          toast.success(t('auth.welcomeBack'));
          navigate('/home', { replace: true });
        },
        onError: (err) => {
          if (err instanceof ValidationError) {
            setErrors({
              email: err.fieldErrors?.email,
              password: err.fieldErrors?.password,
            });
          } else if (err instanceof AppError && err.status === 401) {
            toast.error(t('auth.invalidCredentials'));
          } else {
            toast.error(t('errors.generic'));
          }
        },
      },
    );
  };

  return (
    <AuthCard
      icon={<Sparkles className="size-7" />}
      iconTone="from-gold-300 to-gold-600"
      badge={
        <>
          <Sparkles className="size-3.5" />
          {t('auth.winCashWeekly')}
        </>
      }
      title={t('auth.welcomeTitle')}
      subtitle={t('auth.welcomeSubtitle')}
      footer={
        <p className="text-center text-sm text-ink-500">
          {t('auth.noAccount')}{' '}
          <Link to="/signup" className="font-bold text-brand-700 hover:text-brand-800 transition-colors">
            {t('auth.signUp')}
          </Link>
        </p>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <Input
          type="email"
          label={t('auth.email')}
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          iconStart={<Mail className="size-4" />}
          error={errors.email}
          autoComplete="email"
          required
        />
        <Input
          type={showPassword ? 'text' : 'password'}
          label={t('auth.password')}
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
          autoComplete="current-password"
          required
        />
        <div className="flex items-center justify-end">
          <Link
            to="/forgot-password"
            className="text-xs font-semibold text-brand-700 hover:text-brand-800 transition-colors"
          >
            {t('auth.forgotPassword')}
          </Link>
        </div>
        <Button
          type="submit"
          fullWidth
          size="lg"
          loading={login.isPending}
          iconEnd={!login.isPending ? <ArrowRight className="size-4 rtl:rotate-180" /> : undefined}
        >
          {t('auth.signIn')}
        </Button>
        <p className="text-center text-[11px] text-ink-400 pt-1">
          {t('auth.testCredsHint')}
        </p>
      </form>
    </AuthCard>
  );
}
