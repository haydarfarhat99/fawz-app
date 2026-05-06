import type { ReactNode } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@core/utils/cn';

interface PageHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  back?: boolean;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({ title, description, back, actions, className }: PageHeaderProps) {
  const navigate = useNavigate();
  return (
    <div className={cn('flex items-start justify-between gap-4 mb-6', className)}>
      <div className="flex items-center gap-3 min-w-0">
        {back && (
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex size-10 items-center justify-center rounded-xl border border-ink-200 bg-white text-ink-700 hover:border-brand-300 hover:text-brand-700 transition-colors"
            aria-label="Back"
          >
            <ChevronLeft className="size-5 rtl:rotate-180" />
          </button>
        )}
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-ink-900 tracking-tight truncate">{title}</h1>
          {description && <p className="text-sm text-ink-500 mt-1">{description}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}
