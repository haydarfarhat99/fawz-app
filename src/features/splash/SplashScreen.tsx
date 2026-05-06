import { useEffect, useState } from 'react';
import { Trophy, Sparkles } from 'lucide-react';
import { cn } from '@core/utils/cn';
import { playSplashWhoosh } from '@core/utils/sound';

interface SplashScreenProps {
  onComplete: () => void;
  duration?: number;
}

export function SplashScreen({ onComplete, duration = 1900 }: SplashScreenProps) {
  const [phase, setPhase] = useState<'enter' | 'shine' | 'exit'>('enter');

  useEffect(() => {
    playSplashWhoosh();
    const t1 = window.setTimeout(() => setPhase('shine'), 600);
    const t2 = window.setTimeout(() => setPhase('exit'), duration - 350);
    const t3 = window.setTimeout(onComplete, duration);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, [duration, onComplete]);

  return (
    <div
      className={cn(
        'fixed inset-0 z-[300] overflow-hidden flex items-center justify-center transition-opacity duration-300',
        phase === 'exit' && 'opacity-0',
      )}
      style={{ background: 'radial-gradient(ellipse at center, #4C1D95 0%, #1E1B4B 60%, #020617 100%)' }}
    >
      <div className="absolute inset-0 -z-10 gradient-mesh opacity-40" />
      <div className="absolute -top-32 start-1/4 size-[480px] rounded-full bg-brand-500/30 blur-[140px] animate-pulse" />
      <div className="absolute -bottom-32 end-1/4 size-[480px] rounded-full bg-gold-400/20 blur-[140px] animate-pulse" style={{ animationDelay: '0.4s' }} />

      {Array.from({ length: 20 }).map((_, i) => (
        <Particle key={i} index={i} phase={phase} />
      ))}

      <div
        className={cn(
          'relative flex flex-col items-center transition-all duration-700',
          phase === 'enter' && 'scale-50 opacity-0',
          phase === 'shine' && 'scale-100 opacity-100',
          phase === 'exit' && 'scale-110 opacity-0',
        )}
        style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        <div className="relative mb-6">
          <div className="absolute inset-0 -z-10 blur-3xl bg-gold-400/60 rounded-full scale-150 animate-pulse-glow" />
          <div className="relative flex size-32 items-center justify-center rounded-[2.25rem] bg-gradient-to-br from-brand-400 via-brand-600 to-brand-800 shadow-[0_30px_60px_-15px_rgba(124,58,237,0.7),inset_0_2px_0_rgba(255,255,255,0.4)]">
            <div className="absolute inset-1 rounded-[1.95rem] bg-gradient-to-br from-white/20 to-transparent" />
            <span className="relative font-black text-white text-7xl drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]">ف</span>
            <span className="absolute -top-2 -end-2 flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-gold-300 to-gold-500 shadow-[0_8px_18px_-6px_rgba(251,191,36,0.7)] ring-3 ring-white/30 animate-bounce-soft">
              <Sparkles className="size-5 text-ink-900" />
            </span>
          </div>
        </div>

        <h1
          className={cn(
            'text-6xl md:text-7xl font-black tracking-tight mb-2',
            'bg-gradient-to-br from-white via-gold-200 to-gold-400 bg-clip-text text-transparent',
            'drop-shadow-[0_4px_24px_rgba(251,191,36,0.4)]',
          )}
        >
          FAWZ
        </h1>
        <p className="text-sm font-bold tracking-[0.5em] uppercase text-white/60 mb-8">فــوز</p>

        <div className="flex items-center gap-1.5">
          <Trophy className="size-3.5 text-gold-400" />
          <span className="text-[11px] font-semibold tracking-wider text-white/50">WIN CASH PRIZES WEEKLY</span>
          <Trophy className="size-3.5 text-gold-400" />
        </div>
      </div>

      <div className="absolute bottom-12 inset-x-0 flex justify-center">
        <div className={cn('flex gap-1.5 transition-opacity duration-500', phase === 'enter' && 'opacity-0')}>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="size-1.5 rounded-full bg-white/40 animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Particle({ index, phase }: { index: number; phase: 'enter' | 'shine' | 'exit' }) {
  const [params] = useState(() => ({
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 1.2,
    size: 2 + Math.random() * 4,
    color: index % 3 === 0 ? '#FBBF24' : index % 3 === 1 ? '#A78BFA' : '#FFFFFF',
  }));

  return (
    <span
      aria-hidden="true"
      className={cn(
        'absolute rounded-full transition-opacity duration-700',
        phase === 'enter' && 'opacity-0',
        phase === 'shine' && 'opacity-80',
        phase === 'exit' && 'opacity-0',
      )}
      style={{
        insetInlineStart: `${params.left}%`,
        top: `${params.top}%`,
        width: params.size,
        height: params.size,
        background: params.color,
        boxShadow: `0 0 ${params.size * 4}px ${params.color}`,
        animation: `float 3s ease-in-out ${params.delay}s infinite`,
      }}
    />
  );
}
