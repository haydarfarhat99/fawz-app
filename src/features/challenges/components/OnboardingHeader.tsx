import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sparkles, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Card } from '@shared/components/Card';
import { ProgressBar } from './ProgressBar';
import { ChallengeIcon } from './ChallengeIcon';
import type { OnboardingProgress } from '../types/challenge.types';

interface OnboardingHeaderProps {
  progress: OnboardingProgress;
}

export function OnboardingHeader({ progress }: OnboardingHeaderProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Card variant="gradient" padding="lg" className="relative overflow-hidden mb-5">
      <div className="absolute -top-12 -end-12 size-48 rounded-full bg-gold-300/40 blur-3xl" />
      <div className="absolute -bottom-12 -start-12 size-48 rounded-full bg-brand-300/40 blur-3xl" />

      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/80 backdrop-blur px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-700">
            <Sparkles className="size-3" />
            {t('challenges.welcomePack')}
          </div>
          <span className="text-sm font-bold text-ink-900 tabular-nums">
            {progress.completed} / {progress.total}
          </span>
        </div>

        <h2 className="text-xl font-black text-ink-900 mb-1">
          {t('challenges.startStrong')}
        </h2>
        <p className="text-sm text-ink-600 mb-4">{t('challenges.completeTheseToEarn')}</p>

        <ProgressBar
          current={progress.completed}
          target={progress.total}
          variant="brand"
          size="md"
          showCheckpoints={false}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
          {progress.challenges.map((c) => (
            <button
              type="button"
              key={c.id}
              onClick={() => navigate(`/challenges/${c.id}`)}
              className="group flex items-center gap-2.5 rounded-xl bg-white/70 backdrop-blur p-2.5 text-start hover:bg-white transition-all"
            >
              <ChallengeIcon challenge={c} size="sm" />
              <span className="flex-1 text-xs font-semibold text-ink-900 truncate">{c.name}</span>
              {c.completed ? (
                <CheckCircle2 className="size-4 text-success-600" />
              ) : (
                <ChevronRight className="size-4 text-ink-400 rtl:rotate-180 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform" />
              )}
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}
