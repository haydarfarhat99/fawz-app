import { Loader2 } from 'lucide-react';
import { cn } from '@core/utils/cn';

interface LoadingOverlayProps {
  visible: boolean;
  label?: string;
  fullscreen?: boolean;
}

export function LoadingOverlay({ visible, label, fullscreen = true }: LoadingOverlayProps) {
  if (!visible) return null;
  return (
    <div
      className={cn(
        'flex items-center justify-center gap-3 bg-white/70 backdrop-blur-sm z-50',
        fullscreen ? 'fixed inset-0' : 'absolute inset-0',
      )}
    >
      <Loader2 className="size-5 animate-spin text-brand-600" />
      {label && <span className="text-sm font-medium text-ink-700">{label}</span>}
    </div>
  );
}
