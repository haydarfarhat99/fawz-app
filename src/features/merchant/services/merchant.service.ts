import { useQuery } from '@tanstack/react-query';
import { apiClient, withFallback } from '@core/network/apiClient';
import { generateFawzNumber } from '@core/utils/helpers';
import type { MerchantEntry, MerchantPrize, MerchantSummary } from '../types/merchant.types';

export const merchantKeys = {
  all: ['merchant'] as const,
  summary: () => [...merchantKeys.all, 'summary'] as const,
  entries: () => [...merchantKeys.all, 'entries'] as const,
  prizes: () => [...merchantKeys.all, 'prizes'] as const,
};

const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const inDays = (n: number) => new Date(Date.now() + n * 86_400_000).toISOString();

const DUMMY_SUMMARY: MerchantSummary = {
  isEligible: true,
  weeklyEntryCount: 87,
  monthlyEntryCount: 342,
  rolling30dVolumeIqd: 4_250_000,
  rolling30dTransactions: 412,
  minMonthlyVolumeIqd: 1_000_000,
  minMonthlyTransactions: 100,
  nextEligibilityRecheckAt: inDays(1),
  storeName: 'Demo Mart Express',
  category: 'Grocery & Essentials',
};

const DUMMY_ENTRIES: MerchantEntry[] = Array.from({ length: 14 }, (_, i) => ({
  id: `me-${i + 1}`,
  fawzNumber: generateFawzNumber(),
  drawId: 'draw-143',
  drawDate: inDays(3),
  customerTransactionAmount: 1500 + (i * 750),
  source: 'shared_with_customer',
  createdAt: new Date(Date.now() - i * 4 * 3_600_000).toISOString(),
}));

const DUMMY_PRIZES: MerchantPrize[] = [
  {
    id: 'mp1',
    drawId: 'draw-141',
    drawDate: daysAgo(14),
    drawType: 'monthly',
    fawzNumber: generateFawzNumber(),
    tier: 'last_4',
    prizeIqd: 10_000,
    payoutStatus: 'credited',
    payoutAt: daysAgo(14),
  },
  {
    id: 'mp2',
    drawId: 'draw-138',
    drawDate: daysAgo(35),
    drawType: 'weekly',
    fawzNumber: generateFawzNumber(),
    tier: 'last_4',
    prizeIqd: 10_000,
    payoutStatus: 'credited',
    payoutAt: daysAgo(35),
  },
];

export function useMerchantSummary() {
  return useQuery({
    queryKey: merchantKeys.summary(),
    queryFn: () =>
      withFallback(
        () => apiClient.get<MerchantSummary>('/fawz_merchant_management/merchant/summary').then((r) => r.data),
        DUMMY_SUMMARY,
        'merchantSummary',
      ),
  });
}

export function useMerchantEntries() {
  return useQuery({
    queryKey: merchantKeys.entries(),
    queryFn: () =>
      withFallback(
        () => apiClient.get<MerchantEntry[]>('/fawz_merchant_management/merchant/entries').then((r) => r.data),
        DUMMY_ENTRIES,
        'merchantEntries',
      ),
  });
}

export function useMerchantPrizes() {
  return useQuery({
    queryKey: merchantKeys.prizes(),
    queryFn: () =>
      withFallback(
        () => apiClient.get<MerchantPrize[]>('/fawz_merchant_management/merchant/prizes').then((r) => r.data),
        DUMMY_PRIZES,
        'merchantPrizes',
      ),
  });
}
