import { useEffect, useState } from 'react';

export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  finished: boolean;
}

export function useCountdown(target: Date | string | number | null): CountdownParts {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!target) return;
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, [target]);

  const targetMs = target ? new Date(target).getTime() : 0;
  const diffSeconds = Math.max(0, Math.floor((targetMs - now) / 1000));
  return {
    days: Math.floor(diffSeconds / 86400),
    hours: Math.floor((diffSeconds % 86400) / 3600),
    minutes: Math.floor((diffSeconds % 3600) / 60),
    seconds: diffSeconds % 60,
    totalSeconds: diffSeconds,
    finished: diffSeconds === 0,
  };
}
