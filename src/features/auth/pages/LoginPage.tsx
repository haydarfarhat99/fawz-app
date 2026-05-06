import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { Input } from '@shared/components/Input';
import { useAuth } from '@shared/hooks/useAuth';
import { usePageTitle } from '@shared/hooks/usePageTitle';
import { env } from '@config/env';
import { AppError, ValidationError } from '@core/network/types/apiError';
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
              avatarUrl: u?.profile_image_url ?? undefined,
              entryCount: u?.total_entries ?? 0,
              isNew: (u?.total_entries ?? 0) === 0,
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
    <div className="animate-slide-up">
      <div className="flex flex-col items-center mb-8">
        <div className="relative">
          <div className="absolute inset-0 -z-10 blur-3xl rounded-full scale-110 bg-teal-500/30" />
          <img
            src="/brand/fawz-logo.png"
            alt="FAWZ"
            width={200}
            height={252}
            className="drop-shadow-[0_24px_48px_rgba(0,198,167,0.25)]"
          />
        </div>
      </div>

      <div className="rounded-3xl bg-white/95 backdrop-blur-xl shadow-[0_24px_64px_-12px_rgba(0,0,0,0.4)] border border-white/40 p-6 md:p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black text-ink-900 mb-1 tracking-tight">
            {t('auth.welcomeTitle')}
          </h1>
          <p className="text-sm text-ink-500">{t('auth.welcomeSubtitle')}</p>
        </div>

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
              className="text-xs font-semibold text-teal-700 hover:text-teal-900 transition-colors"
            >
              {t('auth.forgotPassword')}
            </Link>
          </div>
          <button
            type="submit"
            disabled={login.isPending}
            className="group relative w-full h-12 rounded-2xl font-bold text-white overflow-hidden shadow-[0_12px_32px_-8px_rgba(0,198,167,0.6)] disabled:opacity-60 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
            style={{ background: 'linear-gradient(135deg, #00C6A7 0%, #009E86 60%, #00312E 100%)' }}
          >
            <span className="absolute inset-0 -z-10 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="inline-flex items-center justify-center gap-2 tracking-wide">
              {login.isPending ? (
                <span className="size-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              ) : (
                <>
                  {t('auth.signIn')}
                  <ArrowRight className="size-4 rtl:rotate-180" />
                </>
              )}
            </span>
          </button>
          <p className="text-center text-[11px] text-ink-400 pt-1">
            {t('auth.testCredsHint')}
          </p>
        </form>

        <div className="mt-6 pt-5 border-t border-ink-100">
          <p className="text-center text-sm text-ink-500">
            {t('auth.noAccount')}{' '}
            <Link to="/signup" className="font-bold text-teal-700 hover:text-teal-900 transition-colors">
              {t('auth.signUp')}
            </Link>
          </p>
        </div>
      </div>

    </div>
  );
}
