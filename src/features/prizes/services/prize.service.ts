import { useQuery } from '@tanstack/react-query';
import { apiClient, withFallback } from '@core/network/apiClient';
import { generateFawzNumber } from '@core/utils/helpers';
import type { Prize, PrizeSummary } from '../types/prize.types';

export const prizeKeys = {
  all: ['prizes'] as const,
  list: () => [...prizeKeys.all, 'list'] as const,
  summary: () => [...prizeKeys.all, 'summary'] as const,
};

const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hoursAgo = (n: number) => new Date(Date.now() - n * 3_600_000).toISOString();

const DUMMY_PRIZES: Prize[] = [
  {
    id: 'p1',
    drawId: 'draw-142',
    drawDate: daysAgo(7),
    drawType: 'weekly',
    tier: 'last_4',
    fawzNumber: generateFawzNumber(),
    prizeIqd: 10_000,
    payoutStatus: 'credited',
    payoutAt: hoursAgo(7 * 24 - 0.05),
    timeline: [
      { status: 'won', at: daysAgo(7) },
      { status: 'pending', at: daysAgo(7), note: 'Queued for payout' },
      { status: 'credited', at: hoursAgo(7 * 24 - 0.05), note: 'Credited to SuperQi wallet' },
    ],
  },
  {
    id: 'p2',
    drawId: 'draw-141',
    drawDate: daysAgo(14),
    drawType: 'monthly',
    tier: 'last_6',
    fawzNumber: generateFawzNumber(),
    prizeIqd: 250_000,
    payoutStatus: 'credited',
    payoutAt: daysAgo(14),
    timeline: [
      { status: 'won', at: daysAgo(14) },
      { status: 'pending', at: daysAgo(14) },
      { status: 'credited', at: daysAgo(14), note: 'Credited to SuperQi wallet' },
    ],
  },
  {
    id: 'p3',
    drawId: 'draw-143',
    drawDate: hoursAgo(2),
    drawType: 'weekly',
    tier: 'last_4',
    fawzNumber: generateFawzNumber(),
    prizeIqd: 10_000,
    payoutStatus: 'pending',
    timeline: [
      { status: 'won', at: hoursAgo(2) },
      { status: 'pending', at: hoursAgo(2), note: 'In payout queue · ETA <60s' },
    ],
  },
  {
    id: 'p4',
    drawId: 'draw-140',
    drawDate: daysAgo(21),
    drawType: 'weekly',
    tier: 'last_8',
    fawzNumber: generateFawzNumber(),
    prizeIqd: 5_000_000,
    payoutStatus: 'held',
    reviewReason: 'High-value prize requires identity verification',
    timeline: [
      { status: 'won', at: daysAgo(21) },
      { status: 'pending', at: daysAgo(21) },
      { status: 'held', at: daysAgo(21), note: 'Compliance review (high-value)' },
    ],
  },
  {
    id: 'p5',
    drawId: 'draw-138',
    drawDate: daysAgo(35),
    drawType: 'weekly',
    tier: 'last_4',
    fawzNumber: generateFawzNumber(),
    prizeIqd: 10_000,
    payoutStatus: 'credited',
    payoutAt: daysAgo(35),
    timeline: [
      { status: 'won', at: daysAgo(35) },
      { status: 'credited', at: daysAgo(35) },
    ],
  },
  {
    id: 'p6',
    drawId: 'draw-130',
    drawDate: daysAgo(70),
    drawType: 'monthly',
    tier: 'last_4',
    fawzNumber: generateFawzNumber(),
    prizeIqd: 10_000,
    payoutStatus: 'rejected',
    reviewReason: 'Account flagged for review · winnings forfeited',
    timeline: [
      { status: 'won', at: daysAgo(70) },
      { status: 'held', at: daysAgo(70) },
      { status: 'rejected', at: daysAgo(68), note: 'Fraud review failed' },
    ],
  },
];

const DUMMY_SUMMARY: PrizeSummary = {
  lifetimeIqd: DUMMY_PRIZES.filter((p) => p.payoutStatus === 'credited').reduce((s, p) => s + p.prizeIqd, 0),
  totalWins: DUMMY_PRIZES.length,
  biggestWinIqd: Math.max(...DUMMY_PRIZES.map((p) => p.prizeIqd)),
  thisMonthIqd: DUMMY_PRIZES.filter((p) => Date.now() - new Date(p.drawDate).getTime() < 30 * 86_400_000).reduce((s, p) => s + p.prizeIqd, 0),
};

export function useMyPrizes() {
  return useQuery({
    queryKey: prizeKeys.list(),
    queryFn: () =>
      withFallback(
        () => apiClient.get<Prize[]>('/fawz_prize_payout_management/prize/my-wins').then((r) => r.data),
        DUMMY_PRIZES,
        'myPrizes',
      ),
  });
}

export function usePrizeSummary() {
  return useQuery({
    queryKey: prizeKeys.summary(),
    queryFn: () =>
      withFallback(
        () => apiClient.get<PrizeSummary>('/fawz_prize_payout_management/prize/summary').then((r) => r.data),
        DUMMY_SUMMARY,
        'prizeSummary',
      ),
  });
}
