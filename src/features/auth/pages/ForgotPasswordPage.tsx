import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, KeyRound, ArrowRight, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { Input } from '@shared/components/Input';
import { Button } from '@shared/components/Button';
import { usePageTitle } from '@shared/hooks/usePageTitle';
import { AppError } from '@core/network/types/apiError';
import { AuthCard } from '../components/AuthCard';
import { useForgotPassword } from '../services/auth.service';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const forgot = useForgotPassword();
  usePageTitle(t('auth.forgotPassword'));

  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | undefined>();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setError(t('validation.email'));
      return;
    }
    forgot.mutate(email, {
      onSuccess: () => {
        toast.success(t('auth.codeSent'));
        navigate(`/reset-password?email=${encodeURIComponent(email)}`);
      },
      onError: (err) => {
        if (err instanceof AppError && err.status === 404) {
          setError(t('auth.emailNotFound'));
        } else {
          toast.error(t('errors.generic'));
        }
      },
    });
  };

  return (
    <AuthCard
      icon={<KeyRound className="size-7" />}
      iconTone="from-warning-500 to-gold-500"
      title={t('auth.forgotPassword')}
      subtitle={t('auth.forgotSubtitle')}
      footer={
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-800 transition-colors"
        >
          <ArrowLeft className="size-4 rtl:rotate-180" />
          {t('auth.backToSignIn')}
        </Link>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <Input
          type="email"
          label={t('auth.email')}
          placeholder="you@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError(undefined);
          }}
          iconStart={<Mail className="size-4" />}
          error={error}
          autoComplete="email"
          required
          autoFocus
        />
        <Button
          type="submit"
          fullWidth
          size="lg"
          loading={forgot.isPending}
          iconEnd={!forgot.isPending ? <ArrowRight className="size-4 rtl:rotate-180" /> : undefined}
        >
          {t('auth.sendResetCode')}
        </Button>
      </form>
    </AuthCard>
  );
}
