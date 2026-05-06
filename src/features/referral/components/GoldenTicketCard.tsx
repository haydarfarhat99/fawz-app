import { useState } from 'react';
import { Copy, Check, Ticket, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { copyToClipboard } from '@core/utils/helpers';
import { useCountdown } from '@shared/hooks/useCountdown';
import { cn } from '@core/utils/cn';
import { QrPattern } from './QrPattern';
import type { ReferralLink } from '../types/referral.types';

interface GoldenTicketCardProps {
  link: ReferralLink;
}

export function GoldenTicketCard({ link }: GoldenTicketCardProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const countdown = useCountdown(link.expiresAt);

  const handleCopy = async () => {
    try {
      await copyToClipboard(link.url);
      setCopied(true);
      toast.success(t('common.copied'));
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      toast.error(t('errors.generic'));
    }
  };

  const expiryLabel =
    countdown.days > 0
      ? t('referral.expiresInDays', { count: countdown.days })
      : countdown.hours > 0
        ? t('referral.expiresInHours', { count: countdown.hours })
        : t('referral.expiresSoon');

  return (
    <div className="relative">
      <div className="absolute -inset-3 -z-10 bg-gradient-to-br from-gold-300/40 via-gold-400/20 to-brand-400/30 blur-3xl rounded-[2rem]" />

      <div
        className={cn(
          'group/card relative overflow-hidden rounded-3xl',
          'bg-gradient-to-br from-gold-200 via-gold-300 to-gold-500',
          'shadow-[0_30px_60px_-15px_rgba(251,191,36,0.5),inset_0_2px_0_rgba(255,255,255,0.7)]',
          'border border-gold-200',
        )}
      >
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              'repeating-linear-gradient(135deg, rgba(255,255,255,0.4) 0px, rgba(255,255,255,0.4) 1px, transparent 1px, transparent 14px)',
          }}
        />

        {/* One-shot gold glow sweep on hover */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 -inset-x-1/2 opacity-0 group-hover/card:opacity-100 group-hover/card:animate-glow-sweep"
          style={{
            background:
              'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.95) 48%, rgba(255,250,200,0.9) 52%, transparent 70%)',
            filter: 'blur(2px)',
            willChange: 'transform',
          }}
        />

        <span className="absolute -top-6 start-1/2 -translate-x-1/2 size-12 rounded-full bg-ink-50 shadow-[0_4px_8px_rgba(0,0,0,0.1)_inset]" />
        <span className="absolute -bottom-6 start-1/2 -translate-x-1/2 size-12 rounded-full bg-ink-50 shadow-[0_-4px_8px_rgba(0,0,0,0.1)_inset]" />

        <div className="relative p-6 md:p-7">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex size-9 items-center justify-center rounded-xl bg-ink-900/15 text-ink-900 backdrop-blur icon-3d">
              <Ticket className="size-5" />
            </div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-black text-ink-900/80">
              {t('referral.goldenTicket')}
            </span>
          </div>

          <div className="flex items-center gap-4 mb-5">
            <QrPattern seed={link.code} size={104} />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold uppercase tracking-wider text-ink-900/60 mb-1">
                {t('referral.yourCode')}
              </div>
              <div
                dir="ltr"
                className="font-mono text-2xl md:text-3xl font-black text-ink-900 tabular-nums tracking-tight mb-2 break-all"
              >
                {link.code}
              </div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-ink-900/70">
                <Clock className="size-3.5" />
                {expiryLabel}
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white/40 backdrop-blur-sm p-3 mb-3 border border-white/40">
            <div className="text-[10px] uppercase tracking-wider font-bold text-ink-900/60 mb-1">
              {t('referral.shareLink')}
            </div>
            <div dir="ltr" className="text-sm font-mono text-ink-900 truncate">
              {link.url.replace(/^https?:\/\//, '')}
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className={cn(
              'group relative inline-flex w-full items-center justify-center gap-2 rounded-2xl py-3 px-5 font-bold transition-all duration-300',
              'bg-ink-900 text-white shadow-[0_8px_20px_-6px_rgba(15,23,42,0.5)] hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-6px_rgba(15,23,42,0.6)] active:translate-y-0',
            )}
          >
            <span className={cn('inline-flex items-center gap-2 transition-all', copied && 'opacity-0 -translate-y-2')}>
              <Copy className="size-4" />
              {t('referral.copyLink')}
            </span>
            <span
              className={cn(
                'absolute inset-0 inline-flex items-center justify-center gap-2 transition-all',
                copied ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2',
              )}
            >
              <Check className="size-4 text-success-500" />
              {t('referral.copied')}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
