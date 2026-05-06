import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Trophy, Share2, Download, Copy } from 'lucide-react';
import toast from 'react-hot-toast';
import { useUIStore } from '@stores/ui.store';
import { Button } from '@shared/components/Button';
import { usePageTitle } from '@shared/hooks/usePageTitle';
import { Confetti } from '../components/Confetti';
import { copyToClipboard } from '@core/utils/helpers';
import { formatCompactIQD } from '@core/utils/formatters';

interface SessionWin {
  tier: 'last_4' | 'last_6' | 'last_8' | 'last_10';
  prize: number;
  fawzNumber: string;
}

function readSessionWin(): SessionWin {
  try {
    const raw = sessionStorage.getItem('fawz.lastDraw.win');
    if (raw) return JSON.parse(raw) as SessionWin;
  } catch {
    /* ignore */
  }
  return { tier: 'last_4', prize: 10_000, fawzNumber: '0000000000' };
}

export default function WinnerSharePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const lang = useUIStore((s) => s.language);
  usePageTitle(t('draws.shareWin'));

  const win = readSessionWin();
  const tierLabel = t(`draws.tier_${win.tier}` as const);
  const shareText = `🎉 ${t('draws.iJustWon')} ${formatCompactIQD(win.prize, lang)} ${t('draws.onFawz')}!`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'FAWZ', text: shareText, url: window.location.origin });
      } catch {
        /* canceled */
      }
    } else {
      await copyToClipboard(shareText);
      toast.success(t('common.copied'));
    }
  };

  return (
    <div className="relative min-h-dvh bg-gradient-to-br from-gold-700 via-brand-900 to-ink-950 text-white overflow-hidden">
      <div className="absolute inset-0 -z-10 gradient-mesh opacity-50" />
      <Confetti count={40} />

      <div className="relative max-w-md mx-auto px-4 py-5 pb-24">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex size-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md text-white border border-white/15 hover:bg-white/15 transition-colors mb-6"
          aria-label={t('common.back')}
        >
          <ArrowLeft className="size-5 rtl:rotate-180" />
        </button>

        <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-7 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)] animate-scale-in">
          <div className="text-center">
            <div className="inline-flex size-20 items-center justify-center rounded-3xl bg-gradient-to-br from-gold-300 to-gold-600 text-ink-900 icon-3d mb-4 animate-bounce-soft">
              <Trophy className="size-10 drop-shadow-lg" />
            </div>
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/15 text-gold-200 text-[11px] font-bold uppercase tracking-wider mb-3">
              {t('draws.fawzWinnerBadge')}
            </div>
            <p className="text-white/80 mb-1 text-sm">{t('draws.iJustWon')}</p>
            <h1 className="text-5xl font-black text-gradient-gold mb-1 tabular-nums">
              {formatCompactIQD(win.prize, lang)}
            </h1>
            <p className="text-white/60 text-sm mb-5">{t('draws.onFawz')}</p>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <div className="text-[10px] uppercase tracking-[0.2em] text-gold-300 font-bold mb-1">
                {t('draws.matchTier')}
              </div>
              <div className="text-2xl font-black text-white">{tierLabel}</div>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-2.5">
          <Button variant="gold" size="xl" fullWidth onClick={handleShare} iconStart={<Share2 className="size-5" />}>
            {t('draws.shareNow')}
          </Button>
          <div className="grid grid-cols-2 gap-2.5">
            <Button
              variant="outline"
              fullWidth
              className="!bg-white/10 !text-white !border-white/20 hover:!bg-white/15"
              onClick={() => toast.success(t('draws.imageDownloaded'))}
              iconStart={<Download className="size-4" />}
            >
              {t('common.save')}
            </Button>
            <Button
              variant="outline"
              fullWidth
              className="!bg-white/10 !text-white !border-white/20 hover:!bg-white/15"
              onClick={async () => {
                await copyToClipboard(shareText);
                toast.success(t('common.copied'));
              }}
              iconStart={<Copy className="size-4" />}
            >
              {t('common.copy')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
