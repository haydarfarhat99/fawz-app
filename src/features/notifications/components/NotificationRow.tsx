import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useUIStore } from '@stores/ui.store';
import { cn } from '@core/utils/cn';
import { formatRelative } from '@core/utils/formatters';
import { NotificationIcon } from './NotificationIcon';
import type { FawzNotification } from '../types/notification.types';

interface NotificationRowProps {
  notification: FawzNotification;
  onClick?: () => void;
}

export function NotificationRow({ notification, onClick }: NotificationRowProps) {
  const navigate = useNavigate();
  const lang = useUIStore((s) => s.language);

  const handle = () => {
    onClick?.();
    if (notification.deepLink) navigate(notification.deepLink);
  };

  return (
    <button
      type="button"
      onClick={handle}
      className={cn(
        'group relative flex w-full items-start gap-3 rounded-2xl p-3 md:p-4 text-start transition-all duration-200',
        notification.isRead
          ? 'bg-white border border-ink-100 hover:border-brand-200'
          : 'bg-gradient-to-br from-brand-50 to-white border border-brand-200 shadow-[0_2px_12px_-4px_rgba(124,58,237,0.15)]',
      )}
    >
      {!notification.isRead && (
        <span
          className="absolute top-3 bottom-3 w-1 rounded-full bg-gradient-to-b from-brand-500 to-brand-700"
          style={{ insetInlineStart: '4px' }}
          aria-hidden="true"
        />
      )}

      <NotificationIcon type={notification.type} />

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2 mb-0.5">
          <h3 className={cn('text-sm leading-tight truncate', notification.isRead ? 'font-semibold text-ink-700' : 'font-bold text-ink-900')}>
            {notification.title}
          </h3>
          <span className="text-[11px] text-ink-400 tabular-nums shrink-0 whitespace-nowrap">
            {formatRelative(notification.createdAt, lang)}
          </span>
        </div>
        <p className="text-xs text-ink-500 line-clamp-2 leading-relaxed">{notification.body}</p>
      </div>

      {notification.deepLink && (
        <ChevronRight className="size-4 text-ink-300 shrink-0 mt-1 rtl:rotate-180 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform" />
      )}
    </button>
  );
}
