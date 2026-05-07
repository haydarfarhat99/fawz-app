import { useQuery } from '@tanstack/react-query';
import { apiClient, withFallback } from '@core/network/apiClient';
import { DEMO_STATS, DEMO_USER_WINS, type DemoUserWin } from '@core/mocks/demoStats';
import type { Prize, PrizeSummary, PayoutEvent } from '../types/prize.types';

export const prizeKeys = {
  all: ['prizes'] as const,
  list: () => [...prizeKeys.all, 'list'] as const,
  summary: () => [...prizeKeys.all, 'summary'] as const,
};

function buildTimeline(win: DemoUserWin): PayoutEvent[] {
  const events: PayoutEvent[] = [{ status: 'won', at: win.drawDate }];
  if (win.payoutStatus === 'credited' && win.payoutAt) {
    events.push({ status: 'pending', at: win.drawDate, note: 'Queued for payout' });
    events.push({ status: 'credited', at: win.payoutAt, note: 'Credited to SuperQi wallet' });
  } else if (win.payoutStatus === 'pending') {
    events.push({ status: 'pending', at: win.drawDate, note: 'In payout queue · ETA <60s' });
  } else if (win.payoutStatus === 'held') {
    events.push({ status: 'pending', at: win.drawDate });
    events.push({ status: 'held', at: win.drawDate, note: 'Compliance review (high-value)' });
  } else if (win.payoutStatus === 'rejected') {
    events.push({ status: 'held', at: win.drawDate });
    events.push({ status: 'rejected', at: win.drawDate, note: 'Fraud review failed' });
  }
  return events;
}

/** Prize records derived from the canonical user-wins fixture. */
const DUMMY_PRIZES: Prize[] = DEMO_USER_WINS.map((win) => ({
  id: `p-${win.drawId}`,
  drawId: win.drawId,
  drawDate: win.drawDate,
  drawType: win.drawType,
  tier: win.tier,
  fawzNumber: win.fawzNumber,
  prizeIqd: win.prizeIqd,
  payoutStatus: win.payoutStatus,
  payoutAt: win.payoutAt,
  reviewReason:
    win.payoutStatus === 'held'
      ? 'High-value prize requires identity verification'
      : win.payoutStatus === 'rejected'
        ? 'Account flagged for review · winnings forfeited'
        : undefined,
  timeline: buildTimeline(win),
}));

const DUMMY_SUMMARY: PrizeSummary = {
  lifetimeIqd: DEMO_STATS.lifetimeWinningsIqd,
  totalWins: DEMO_STATS.totalWins,
  biggestWinIqd: DEMO_STATS.biggestWinIqd,
  thisMonthIqd: DEMO_STATS.thisMonthWinningsIqd,
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
