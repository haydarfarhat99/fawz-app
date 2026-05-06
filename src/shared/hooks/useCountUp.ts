import { useEffect, useRef, useState } from 'react';

interface UseCountUpOptions {
  durationMs?: number;
  delayMs?: number;
  easing?: (t: number) => number;
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export function useCountUp(target: number, opts: UseCountUpOptions = {}): number {
  const { durationMs = 1400, delayMs = 0, easing = easeOutCubic } = opts;
  // Track the "previous target" so we can derive a reset during render rather than via effect setState.
  const [prevTarget, setPrevTarget] = useState(target);
  const [value, setValue] = useState(0);
  const rafRef = useRef<number | null>(null);

  if (prevTarget !== target) {
    setPrevTarget(target);
    setValue(0);
  }

  useEffect(() => {
    let cancelled = false;
    let start = 0;

    const startTimer = window.setTimeout(() => {
      const tick = (ts: number) => {
        if (cancelled) return;
        if (!start) start = ts;
        const elapsed = ts - start;
        const t = Math.min(1, elapsed / durationMs);
        setValue(Math.round(easing(t) * target));
        if (t < 1) rafRef.current = window.requestAnimationFrame(tick);
      };
      rafRef.current = window.requestAnimationFrame(tick);
    }, delayMs);

    return () => {
      cancelled = true;
      window.clearTimeout(startTimer);
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    };
  }, [target, durationMs, delayMs, easing]);

  return value;
}
