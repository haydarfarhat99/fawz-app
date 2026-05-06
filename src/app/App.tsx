import { useCallback, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { Providers } from './providers';
import { router } from '@routes/index';
import { SplashScreen } from '@features/splash/SplashScreen';

const SPLASH_KEY = 'fawz.splash.shown';

function getSplashDuration(): number {
  if (typeof window === 'undefined') return 1900;
  const param = new URLSearchParams(window.location.search).get('splash_ms');
  const n = param ? parseInt(param, 10) : NaN;
  return Number.isFinite(n) && n > 0 ? n : 1900;
}

export default function App() {
  const alreadyShown =
    typeof sessionStorage !== 'undefined' && sessionStorage.getItem(SPLASH_KEY) === '1';
  const [splashDone, setSplashDone] = useState(alreadyShown);
  const [duration] = useState(getSplashDuration);

  const finish = useCallback(() => {
    sessionStorage.setItem(SPLASH_KEY, '1');
    setSplashDone(true);
  }, []);

  return (
    <Providers>
      {!splashDone && <SplashScreen onComplete={finish} duration={duration} />}
      <RouterProvider router={router} />
    </Providers>
  );
}
