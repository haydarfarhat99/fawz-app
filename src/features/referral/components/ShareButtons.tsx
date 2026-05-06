import { useTranslation } from 'react-i18next';
import { Share2 } from 'lucide-react';
import { SiWhatsapp, SiTelegram, SiGmail } from 'react-icons/si';
import type { IconType } from 'react-icons';
import toast from 'react-hot-toast';
import { copyToClipboard } from '@core/utils/helpers';
import { cn } from '@core/utils/cn';

interface ShareButtonsProps {
  url: string;
  message?: string;
}

export function ShareButtons({ url, message }: ShareButtonsProps) {
  const { t } = useTranslation();
  const fullText = `${message ?? t('referral.shareMessage')}\n${url}`;

  const handleNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'FAWZ', text: message, url });
      } catch {
        /* user canceled */
      }
    } else {
      await copyToClipboard(fullText);
      toast.success(t('common.copied'));
    }
  };

  const channels: { key: string; Icon: IconType; tone: string; label: string; href: string }[] = [
    {
      key: 'whatsapp',
      Icon: SiWhatsapp,
      tone: 'from-[#25D366] to-[#128C7E]',
      label: t('referral.shareWhatsapp'),
      href: `https://wa.me/?text=${encodeURIComponent(fullText)}`,
    },
    {
      key: 'telegram',
      Icon: SiTelegram,
      tone: 'from-[#41B6EE] to-[#0088CC]',
      label: t('referral.shareTelegram'),
      href: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(message ?? '')}`,
    },
    {
      key: 'email',
      Icon: SiGmail,
      tone: 'from-[#EF4444] to-[#9B1C1C]',
      label: t('referral.shareEmail'),
      href: `mailto:?subject=${encodeURIComponent(t('referral.emailSubject'))}&body=${encodeURIComponent(fullText)}`,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
      {channels.map(({ key, Icon, tone, label, href }) => (
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noreferrer"
          className={cn(
            'group flex flex-col items-center justify-center gap-1.5 rounded-2xl p-3 text-white shadow-[0_8px_20px_-6px_rgba(15,23,42,0.2)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-6px_rgba(15,23,42,0.3)]',
            'bg-gradient-to-br',
            tone,
          )}
        >
          <span className="flex size-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm icon-3d">
            <Icon className="size-5" />
          </span>
          <span className="text-xs font-bold">{label}</span>
        </a>
      ))}
      <button
        type="button"
        onClick={handleNative}
        className="group flex flex-col items-center justify-center gap-1.5 rounded-2xl p-3 text-white shadow-[0_8px_20px_-6px_rgba(124,58,237,0.4)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-6px_rgba(124,58,237,0.55)] bg-gradient-to-br from-brand-500 to-brand-700 col-span-2 sm:col-span-1"
      >
        <span className="flex size-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm icon-3d">
          <Share2 className="size-5" />
        </span>
        <span className="text-xs font-bold">{t('referral.shareMore')}</span>
      </button>
    </div>
  );
}
