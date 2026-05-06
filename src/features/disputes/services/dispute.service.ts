import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient, withFallback } from '@core/network/apiClient';
import { sleep } from '@core/utils/helpers';
import type {
  Dispute,
  DisputeQuota,
  SubmitDisputeRequest,
} from '../types/dispute.types';

export const disputeKeys = {
  all: ['disputes'] as const,
  list: () => [...disputeKeys.all, 'list'] as const,
  quota: () => [...disputeKeys.all, 'quota'] as const,
};

const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hoursAgo = (n: number) => new Date(Date.now() - n * 3_600_000).toISOString();

const DUMMY_DISPUTES: Dispute[] = [
  {
    id: 'd1',
    type: 'missing_prize',
    description: 'Won Last-4 in Weekly #142, prize never credited.',
    drawId: 'draw-142',
    fawzNumber: '9387541206',
    status: 'auto_resolved',
    resolution: 'Verified — prize credited to wallet within 60 seconds.',
    submittedAt: daysAgo(2),
    resolvedAt: daysAgo(2),
  },
  {
    id: 'd2',
    type: 'incorrect_entries',
    description: 'Made a 5,000 IQD purchase but didn\'t receive any Fawz numbers.',
    status: 'in_review',
    submittedAt: hoursAgo(4),
  },
];

const DUMMY_QUOTA: DisputeQuota = {
  used: 2,
  limit: 3,
  resetsAt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString(),
};

export function useDisputes() {
  return useQuery({
    queryKey: disputeKeys.list(),
    queryFn: () =>
      withFallback(
        () => apiClient.get<Dispute[]>('/fawz_fraud_compliance/dispute/my-disputes').then((r) => r.data),
        DUMMY_DISPUTES,
        'disputes',
      ),
  });
}

export function useDisputeQuota() {
  return useQuery({
    queryKey: disputeKeys.quota(),
    queryFn: () =>
      withFallback(
        () => apiClient.get<DisputeQuota>('/fawz_fraud_compliance/dispute/quota').then((r) => r.data),
        DUMMY_QUOTA,
        'disputeQuota',
      ),
  });
}

export function useSubmitDispute() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: SubmitDisputeRequest): Promise<Dispute> => {
      try {
        const { data } = await apiClient.post<Dispute>(
          '/fawz_fraud_compliance/dispute/submit',
          input,
        );
        return data;
      } catch {
        await sleep(700);
        return {
          id: 'd-' + Date.now(),
          type: input.type,
          description: input.description,
          drawId: input.draw_id,
          fawzNumber: input.fawz_number,
          status: 'pending',
          submittedAt: new Date().toISOString(),
        };
      }
    },
    onSuccess: (dispute) => {
      qc.setQueryData<Dispute[]>(disputeKeys.list(), (old) => (old ? [dispute, ...old] : [dispute]));
      qc.setQueryData<DisputeQuota>(disputeKeys.quota(), (old) =>
        old ? { ...old, used: old.used + 1 } : old,
      );
    },
  });
}
