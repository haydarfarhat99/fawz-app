import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LifeBuoy, Plus } from 'lucide-react';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { PageHeader } from '@shared/components/PageHeader';
import { Card } from '@shared/components/Card';
import { Skeleton } from '@shared/components/Skeleton';
import { EmptyState } from '@shared/components/EmptyState';
import { ErrorState } from '@shared/components/ErrorState';
import { Button } from '@shared/components/Button';
import { usePageTitle } from '@shared/hooks/usePageTitle';
import { DisputeRow } from '../components/DisputeRow';
import { useDisputes } from '../services/dispute.service';

export default function DisputeHistoryPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  usePageTitle(t('disputes.historyTitle'));

  const { data, isLoading, isError, refetch } = useDisputes();

  return (
    <ScreenWrapper>
      <PageHeader
        title={t('disputes.historyTitle')}
        description={t('disputes.historySubtitle')}
        actions={
          <Button
            size="sm"
            onClick={() => navigate('/support/dispute')}
            iconStart={<Plus className="size-4" />}
          >
            {t('disputes.newDispute')}
          </Button>
        }
      />

      {isLoading ? (
        <div className="space-y-2.5">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} padding="md">
              <div className="flex items-start gap-3">
                <Skeleton className="size-10" rounded="2xl" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-40 mb-2" />
                  <Skeleton className="h-3 w-full mb-1" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : isError ? (
        <ErrorState
          title={t('states.error.title')}
          subtitle={t('states.error.subtitle')}
          retryLabel={t('common.retry')}
          onRetry={() => refetch()}
        />
      ) : !data || data.length === 0 ? (
        <Card variant="elevated" padding="lg">
          <EmptyState
            icon={<LifeBuoy className="size-9" />}
            title={t('disputes.emptyTitle')}
            subtitle={t('disputes.emptySubtitle')}
            action={
              <Button onClick={() => navigate('/support/dispute')} iconStart={<Plus className="size-4" />}>
                {t('disputes.newDispute')}
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="space-y-2.5">
          {data.map((d) => (
            <DisputeRow key={d.id} dispute={d} />
          ))}
        </div>
      )}
    </ScreenWrapper>
  );
}
