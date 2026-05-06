import { useTranslation } from 'react-i18next';
import { ShieldCheck, Sparkles } from 'lucide-react';
import { Modal } from '@shared/components/Modal';
import { Button } from '@shared/components/Button';

interface ShariaDisclosureModalProps {
  open: boolean;
  onAccept: () => void;
  onDismiss: () => void;
}

export function ShariaDisclosureModal({ open, onAccept, onDismiss }: ShariaDisclosureModalProps) {
  const { t } = useTranslation();
  return (
    <Modal
      open={open}
      onClose={onDismiss}
      hideClose
      size="md"
      title={
        <span className="inline-flex items-center gap-2.5">
          <span className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-success-500 to-brand-700 text-white icon-3d">
            <ShieldCheck className="size-5" />
          </span>
          {t('consent.shariaTitle')}
        </span>
      }
      footer={
        <>
          <Button variant="ghost" onClick={onDismiss}>
            {t('common.close')}
          </Button>
          <Button variant="primary" onClick={onAccept} iconStart={<Sparkles className="size-4" />}>
            {t('consent.shariaAccept')}
          </Button>
        </>
      }
    >
      <div className="space-y-3 text-sm text-ink-700 leading-relaxed">
        <p className="font-bold text-ink-900">{t('consent.shariaIntro')}</p>
        <p>{t('consent.shariaBody1')}</p>
        <p>{t('consent.shariaBody2')}</p>
        <ul className="space-y-2 ms-4 list-disc text-ink-600 marker:text-brand-500">
          <li>{t('consent.shariaPoint1')}</li>
          <li>{t('consent.shariaPoint2')}</li>
          <li>{t('consent.shariaPoint3')}</li>
        </ul>
      </div>
    </Modal>
  );
}
