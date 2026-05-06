import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Send, AlertCircle, CheckCircle2, Hash, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { PageHeader } from '@shared/components/PageHeader';
import { Card } from '@shared/components/Card';
import { Input } from '@shared/components/Input';
import { Button } from '@shared/components/Button';
import { Skeleton } from '@shared/components/Skeleton';
import { usePageTitle } from '@shared/hooks/usePageTitle';
import { cn } from '@core/utils/cn';
import { useDisputeQuota, useSubmitDispute } from '../services/dispute.service';
import type { DisputeType } from '../types/dispute.types';

const TYPES: DisputeType[] = ['missing_prize', 'incorrect_entries', 'referral_reward', 'challenge_progress', 'other'];

export default function DisputeSubmissionPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  usePageTitle(t('disputes.submitTitle'));

  const quotaQ = useDisputeQuota();
  const submit = useSubmitDispute();

  const [type, setType] = useState<DisputeType>('missing_prize');
  const [fawzNumber, setFawzNumber] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{ description?: string; fawzNumber?: string }>({});

  const blocked = quotaQ.data ? quotaQ.data.used >= quotaQ.data.limit : false;
  const remaining = (quotaQ.data?.limit ?? 3) - (quotaQ.data?.used ?? 0);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (description.trim().length < 10) next.description = t('disputes.descriptionTooShort');
    if (description.length > 500) next.description = t('disputes.descriptionTooLong');
    if (fawzNumber && !/^\d{10}$/.test(fawzNumber)) next.fawzNumber = t('validation.fawzNumber');
    setErrors(next);
    if (Object.keys(next).length) return;

    submit.mutate(
      {
        type,
        description: description.trim(),
        fawz_number: fawzNumber || undefined,
      },
      {
        onSuccess: () => {
          toast.success(t('disputes.submittedSuccess'));
          navigate('/support/disputes');
        },
        onError: () => toast.error(t('errors.generic')),
      },
    );
  };

  if (quotaQ.isLoading) {
    return (
      <ScreenWrapper>
        <PageHeader title={t('disputes.submitTitle')} back />
        <Card padding="lg">
          <Skeleton className="h-32 w-full mb-4" />
          <Skeleton className="h-12 w-full mb-3" />
          <Skeleton className="h-32 w-full mb-4" />
          <Skeleton className="h-12 w-full" />
        </Card>
      </ScreenWrapper>
    );
  }

  if (blocked) {
    return (
      <ScreenWrapper>
        <PageHeader title={t('disputes.submitTitle')} back />
        <Card variant="elevated" padding="lg" className="!bg-gradient-to-br !from-warning-500/10 !to-white !border-warning-500/30">
          <div className="text-center">
            <div className="mx-auto inline-flex size-16 items-center justify-center rounded-3xl bg-gradient-to-br from-warning-500 to-gold-500 text-white icon-3d mb-4">
              <Lock className="size-7" />
            </div>
            <h2 className="text-xl font-black text-ink-900 mb-2">{t('disputes.limitReachedTitle')}</h2>
            <p className="text-sm text-ink-600 mb-5 max-w-sm mx-auto">
              {t('disputes.limitReachedDesc', { limit: quotaQ.data?.limit ?? 3 })}
            </p>
            <Button variant="outline" onClick={() => navigate('/support/disputes')}>
              {t('disputes.viewMyDisputes')}
            </Button>
          </div>
        </Card>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <PageHeader title={t('disputes.submitTitle')} description={t('disputes.submitSubtitle')} back />

      <Card padding="md" className="mb-4 !bg-info-50 border-info-500/20">
        <div className="flex items-start gap-2.5">
          <AlertCircle className="size-4 text-info-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs text-ink-700 leading-relaxed">
              {t('disputes.quotaInfo', { remaining, limit: quotaQ.data?.limit ?? 3 })}
            </p>
          </div>
        </div>
      </Card>

      <Card padding="lg">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-2">
              {t('disputes.typeLabel')}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {TYPES.map((tk) => (
                <button
                  key={tk}
                  type="button"
                  onClick={() => setType(tk)}
                  className={cn(
                    'rounded-xl border px-3 py-2.5 text-start text-sm font-semibold transition-all',
                    type === tk
                      ? 'border-brand-500 bg-brand-50 text-brand-800 shadow-[0_2px_8px_-2px_rgba(124,58,237,0.25)]'
                      : 'border-ink-200 bg-white text-ink-700 hover:border-brand-300',
                  )}
                >
                  <span className="flex items-center gap-2">
                    <span
                      className={cn(
                        'flex size-4 items-center justify-center rounded-full border-2 transition-all',
                        type === tk ? 'border-brand-500 bg-brand-500' : 'border-ink-300',
                      )}
                    >
                      {type === tk && <CheckCircle2 className="size-3 text-white" />}
                    </span>
                    {t(`disputes.type.${tk}`)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <Input
            label={t('disputes.fawzNumberLabel')}
            placeholder="0000000000"
            value={fawzNumber}
            onChange={(e) => {
              setFawzNumber(e.target.value.replace(/\D/g, '').slice(0, 10));
              if (errors.fawzNumber) setErrors((s) => ({ ...s, fawzNumber: undefined }));
            }}
            iconStart={<Hash className="size-4" />}
            error={errors.fawzNumber}
            helper={!errors.fawzNumber ? t('disputes.fawzNumberHelper') : undefined}
            inputMode="numeric"
            maxLength={10}
          />

          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">
              {t('disputes.descriptionLabel')}
            </label>
            <textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) setErrors((s) => ({ ...s, description: undefined }));
              }}
              placeholder={t('disputes.descriptionPlaceholder')}
              maxLength={500}
              rows={5}
              className={cn(
                'w-full rounded-xl border bg-white py-3 px-4 text-sm text-ink-900 placeholder:text-ink-400 outline-none resize-none transition-all',
                'border-ink-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-100',
                errors.description && 'border-danger-500 focus:border-danger-500 focus:ring-danger-100',
              )}
            />
            <div className="flex items-center justify-between mt-1.5">
              {errors.description ? (
                <span className="text-xs text-danger-600">{errors.description}</span>
              ) : (
                <span className="text-xs text-ink-500">{t('disputes.descriptionHelper')}</span>
              )}
              <span className={cn('text-xs tabular-nums', description.length > 480 ? 'text-warning-600 font-bold' : 'text-ink-400')}>
                {description.length} / 500
              </span>
            </div>
          </div>

          <Button
            type="submit"
            fullWidth
            size="lg"
            loading={submit.isPending}
            iconStart={!submit.isPending ? <Send className="size-4" /> : undefined}
          >
            {t('disputes.submitCta')}
          </Button>
        </form>
      </Card>
    </ScreenWrapper>
  );
}
