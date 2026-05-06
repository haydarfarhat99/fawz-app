import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@core/utils/cn';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  hideClose?: boolean;
}

const sizeMap = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  hideClose = false,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div
        className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        className={cn(
          'relative w-full bg-white rounded-3xl shadow-[0_30px_80px_-20px_rgba(15,23,42,0.4)]',
          'animate-scale-in',
          sizeMap[size],
        )}
      >
        {!hideClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 end-4 inline-flex size-9 items-center justify-center rounded-full text-ink-500 hover:bg-ink-100 hover:text-ink-900 transition-colors"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        )}
        {(title || description) && (
          <div className="px-6 pt-6 pb-3 pe-14">
            {title && (
              <h2 id="modal-title" className="text-xl font-bold text-ink-900">
                {title}
              </h2>
            )}
            {description && <p className="mt-1 text-sm text-ink-500">{description}</p>}
          </div>
        )}
        <div className="px-6 py-4">{children}</div>
        {footer && (
          <div className="px-6 py-4 border-t border-ink-100 bg-ink-50/50 rounded-b-3xl flex items-center justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
