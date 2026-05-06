import { useEffect, type ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { queryClient } from '@config/queryClient';
import '@core/i18n';
import { useUIStore } from '@stores/ui.store';
import { setLanguage } from '@core/i18n';
import { useAuthStore } from '@stores/auth.store';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const language = useUIStore((s) => s.language);

  useEffect(() => {
    setLanguage(language);
  }, [language]);

  useEffect(() => {
    const handler = () => useAuthStore.getState().logout();
    window.addEventListener('auth:logout', handler);
    return () => window.removeEventListener('auth:logout', handler);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            borderRadius: '12px',
            background: '#0F172A',
            color: '#fff',
            fontSize: '14px',
            padding: '10px 14px',
            boxShadow: '0 10px 30px -8px rgba(15,23,42,0.4)',
          },
          success: { iconTheme: { primary: '#10B981', secondary: '#fff' } },
          error: { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
        }}
      />
    </QueryClientProvider>
  );
}
