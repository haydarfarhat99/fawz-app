import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Camera, Tv, Lock } from 'lucide-react';
import { Modal } from '@shared/components/Modal';
import { Button } from '@shared/components/Button';
import { cn } from '@core/utils/cn';

interface MediaConsentModalProps {
  open: boolean;
  onSubmit: (consent: boolean) => void;
  onClose: () => void;
}

export function MediaConsentModal({ open, onSubmit, onClose }: MediaConsentModalProps) {
  const { t } = useTranslation();
  const [choice, setChoice] = useState<boolean | null>(null);

  const submit = () => {
    if (choice === null) return;
    onSubmit(choice);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="md"
      title={
        <span className="inline-flex items-center gap-2.5">
          <span className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-300 to-gold-600 text-ink-900 icon-3d">
            <Camera className="size-5" />
          </span>
          {t('consent.mediaTitle')}
        </span>
      }
      description={t('consent.mediaSubtitle')}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button variant="primary" onClick={submit} disabled={choice === null}>
            {t('common.save')}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="rounded-2xl bg-info-50 border border-info-500/20 p-3 flex items-start gap-2.5">
          <Lock className="size-4 text-info-500 shrink-0 mt-0.5" />
          <p className="text-xs text-ink-700 leading-relaxed">{t('consent.mediaNotConditional')}</p>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-ink-700 leading-relaxed">{t('consent.mediaBody')}</p>
          <ul className="space-y-1.5 ms-4 list-disc text-xs text-ink-600 marker:text-brand-500">
            <li>{t('consent.mediaPoint1')}</li>
            <li>{t('consent.mediaPoint2')}</li>
            <li>{t('consent.mediaPoint3')}</li>
          </ul>
        </div>

        <div className="space-y-2.5">
          <ConsentOption
            checked={choice === true}
            label={t('consent.mediaAgree')}
            description={t('consent.mediaAgreeDesc')}
            iconTone="from-success-500 to-brand-600"
            icon={<Tv className="size-5 text-white" />}
            onClick={() => setChoice(true)}
          />
          <ConsentOption
            checked={choice === false}
            label={t('consent.mediaDecline')}
            description={t('consent.mediaDeclineDesc')}
            iconTone="from-ink-700 to-ink-900"
            icon={<Lock className="size-5 text-white" />}
            onClick={() => setChoice(false)}
          />
        </div>
      </div>
    </Modal>
  );
}

function ConsentOption({
  checked,
  label,
  description,
  icon,
  iconTone,
  onClick,
}: {
  checked: boolean;
  label: string;
  description: string;
  icon: React.ReactNode;
  iconTone: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-start gap-3 rounded-2xl border-2 p-3 text-start transition-all',
        checked
          ? 'border-brand-500 bg-brand-50 shadow-[0_4px_12px_-4px_rgba(124,58,237,0.25)]'
          : 'border-ink-200 bg-white hover:border-brand-300',
      )}
    >
      <span className={cn('flex size-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br icon-3d', iconTone)}>
        {icon}
      </span>
      <span className="flex-1 min-w-0">
        <span className="block text-sm font-bold text-ink-900">{label}</span>
        <span className="block text-xs text-ink-500 mt-0.5">{description}</span>
      </span>
      <span
        className={cn(
          'mt-1 flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-all',
          checked ? 'border-brand-500 bg-brand-500' : 'border-ink-300',
        )}
      >
        {checked && <span className="size-2 rounded-full bg-white" />}
      </span>
    </button>
  );
}
