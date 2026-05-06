import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, ArrowRight, RotateCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { Button } from '@shared/components/Button';
import { useAuth } from '@shared/hooks/useAuth';
import { usePageTitle } from '@shared/hooks/usePageTitle';
import { maskEmail } from '@core/utils/helpers';
import { AppError } from '@core/network/types/apiError';
import { AuthCard } from '../components/AuthCard';
import { OtpInput } from '../components/OtpInput';
import { useRequestCode, useVerifyEmail } from '../services/auth.service';

const RESEND_COOLDOWN = 30;

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { t } = useTranslation();
  const { setSession } = useAuth();
  const verify = useVerifyEmail();
  const requestCode = useRequestCode();
  const email = params.get('email') ?? '';
  usePageTitle(t('auth.verifyEmail'));

  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const [resendIn, setResendIn] = useState(RESEND_COOLDOWN);

  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = window.setInterval(() => setResendIn((n) => Math.max(0, n - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [resendIn]);

  const handleVerify = (full: string) => {
    setError(false);
    verify.mutate(
      { email, verify_code: full },
      {
        onSuccess: (data) => {
          const u = data.user;
          setSession(
            {
              id: u?.user_id ?? 'demo-user',
              email: u?.email ?? email,
              fullName: u ? `${u.first_name} ${u.last_name}` : 'New Player',
              role: 'consumer',
              entryCount: 0,
              isNew: true,
            },
            data.encrypted_token,
          );
          toast.success(t('auth.verified'));
          navigate('/home', { replace: true });
        },
        onError: (err) => {
          setError(true);
          if (err instanceof AppError && err.status === 400) {
            toast.error(t('auth.invalidCode'));
          } else {
            toast.error(t('errors.generic'));
          }
        },
      },
    );
  };

  const handleResend = () => {
    requestCode.mutate(
      { email, code_type: 'EmailVerification' },
      {
        onSuccess: () => {
          toast.success(t('auth.codeResent'));
          setResendIn(RESEND_COOLDOWN);
        },
        onError: () => toast.error(t('errors.generic')),
      },
    );
  };

  if (!email) {
    return (
      <AuthCard
        icon={<Mail className="size-7" />}
        title={t('auth.verifyEmail')}
        subtitle={t('auth.noEmailProvided')}
        footer={
          <Link to="/signup" className="block text-center text-sm font-bold text-brand-700">
            {t('auth.backToSignup')}
          </Link>
        }
      >
        <Button fullWidth onClick={() => navigate('/signup')}>{t('auth.signUp')}</Button>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      icon={<Mail className="size-7" />}
      iconTone="from-info-500 to-brand-700"
      title={t('auth.verifyEmail')}
      subtitle={t('auth.verifySubtitle', { email: maskEmail(email) })}
      footer={
        <p className="text-center text-sm text-ink-500">
          {t('auth.wrongEmail')}{' '}
          <Link to="/signup" className="font-bold text-brand-700 hover:text-brand-800 transition-colors">
            {t('auth.changeEmail')}
          </Link>
        </p>
      }
    >
      <div className="space-y-5">
        <OtpInput
          value={code}
          onChange={(v) => {
            setCode(v);
            setError(false);
          }}
          onComplete={handleVerify}
          disabled={verify.isPending}
          error={error}
        />
        <Button
          fullWidth
          size="lg"
          loading={verify.isPending}
          disabled={code.length < 6}
          onClick={() => handleVerify(code)}
          iconEnd={!verify.isPending ? <ArrowRight className="size-4 rtl:rotate-180" /> : undefined}
        >
          {t('auth.verify')}
        </Button>
        <div className="text-center">
          <button
            type="button"
            onClick={handleResend}
            disabled={resendIn > 0 || requestCode.isPending}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-800 disabled:text-ink-400 disabled:cursor-not-allowed transition-colors"
          >
            <RotateCcw className="size-3.5" />
            {resendIn > 0
              ? t('auth.resendIn', { count: resendIn })
              : t('auth.resendCode')}
          </button>
        </div>
      </div>
    </AuthCard>
  );
}
