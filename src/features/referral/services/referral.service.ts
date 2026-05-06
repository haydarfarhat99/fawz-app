import { useQuery } from '@tanstack/react-query';
import { apiClient, withFallback } from '@core/network/apiClient';
import type { ReferralLink, ReferralRecord, ReferralStats } from '../types/referral.types';

export const referralKeys = {
  all: ['referrals'] as const,
  link: () => [...referralKeys.all, 'link'] as const,
  stats: () => [...referralKeys.all, 'stats'] as const,
  history: () => [...referralKeys.all, 'history'] as const,
};

const inDays = (n: number) => new Date(Date.now() + n * 86_400_000).toISOString();
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();

const DUMMY_LINK: ReferralLink = {
  code: 'FAWZ-9X7K2P',
  url: 'https://qi.iq/fawz/FAWZ-9X7K2P',
  expiresAt: inDays(23),
};

const DUMMY_STATS: ReferralStats = {
  monthCount: 4,
  totalCount: 11,
  entriesEarned: 200,
  cashEarnedIqd: 20_000,
  monthlyCap: 10,
};

const DUMMY_HISTORY: ReferralRecord[] = [
  { id: 'r1', partialName: 'Ah*** Mo***', status: 'rewarded', qualifiedAt: daysAgo(3), invitedAt: daysAgo(7), referrerEntries: 50, referrerCashIqd: 5000 },
  { id: 'r2', partialName: 'Sa*** Al***', status: 'qualified', qualifiedAt: daysAgo(5), invitedAt: daysAgo(9), referrerEntries: 50, referrerCashIqd: 5000 },
  { id: 'r3', partialName: 'Mu*** Ka***', status: 'pending', invitedAt: daysAgo(2), referrerEntries: 0, referrerCashIqd: 0 },
  { id: 'r4', partialName: 'Yo*** Ha***', status: 'pending', invitedAt: daysAgo(1), referrerEntries: 0, referrerCashIqd: 0 },
  { id: 'r5', partialName: 'No*** Ja***', status: 'rewarded', qualifiedAt: daysAgo(12), invitedAt: daysAgo(15), referrerEntries: 50, referrerCashIqd: 5000 },
  { id: 'r6', partialName: 'Re*** Ma***', status: 'rejected', invitedAt: daysAgo(20), referrerEntries: 0, referrerCashIqd: 0 },
  { id: 'r7', partialName: 'Ah*** Ka***', status: 'expired', invitedAt: daysAgo(35), referrerEntries: 0, referrerCashIqd: 0 },
];

export function useReferralLink() {
  return useQuery({
    queryKey: referralKeys.link(),
    queryFn: () =>
      withFallback(
        () => apiClient.get<ReferralLink>('/fawz_referral_system/referral/my-link').then((r) => r.data),
        DUMMY_LINK,
        'referralLink',
      ),
  });
}

export function useReferralStats() {
  return useQuery({
    queryKey: referralKeys.stats(),
    queryFn: () =>
      withFallback(
        () => apiClient.get<ReferralStats>('/fawz_referral_system/referral/my-stats').then((r) => r.data),
        DUMMY_STATS,
        'referralStats',
      ),
  });
}

export function useReferralHistory() {
  return useQuery({
    queryKey: referralKeys.history(),
    queryFn: () =>
      withFallback(
        () => apiClient.get<ReferralRecord[]>('/fawz_referral_system/referral/my-history').then((r) => r.data),
        DUMMY_HISTORY,
        'referralHistory',
      ),
  });
}
