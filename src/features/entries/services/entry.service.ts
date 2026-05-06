import { useQuery } from '@tanstack/react-query';
import { apiClient, withFallback } from '@core/network/apiClient';
import { generateFawzNumber } from '@core/utils/helpers';
import type { EntryFilter, EntrySummary, FawzEntry } from '../types/entry.types';

export const entryKeys = {
  all: ['entries'] as const,
  summary: () => [...entryKeys.all, 'summary'] as const,
  list: (filter: EntryFilter) => [...entryKeys.all, 'list', filter] as const,
};

const sources: FawzEntry['source'][] = ['transaction', 'challenge', 'referral', 'retroactive'];
const outcomes: FawzEntry['outcome'][] = ['active', 'won', 'lost'];

const DUMMY_ENTRIES: FawzEntry[] = Array.from({ length: 50 }, (_, i) => {
  const source = sources[i % sources.length];
  const outcome = i === 0 ? 'won' : i % 7 === 0 ? 'won' : outcomes[i % outcomes.length];
  const createdAt = new Date(Date.now() - i * 3600_000 * 5).toISOString();
  const weekDate = new Date(Date.now() - Math.floor(i / 5) * 7 * 86400_000);
  // 70% weekly, 30% monthly
  const drawType: FawzEntry['drawType'] = i % 10 < 7 ? 'weekly' : 'monthly';
  return {
    id: `entry-${i + 1}`,
    fawzNumber: generateFawzNumber(),
    source,
    drawType,
    createdAt,
    drawId: drawType === 'monthly' ? `draw-141` : `draw-${143 - Math.floor(i / 5)}`,
    drawWeekLabel: weekDate.toISOString(),
    outcome,
    wonTier: outcome === 'won' ? 'last_4' : undefined,
    wonPrizeIqd: outcome === 'won' ? 10_000 : undefined,
    transactionAmount: source === 'transaction' ? 1500 + (i % 12) * 1000 : undefined,
  };
});

const weeklyCount = DUMMY_ENTRIES.filter((e) => e.drawType === 'weekly').length;
const monthlyCount = DUMMY_ENTRIES.filter((e) => e.drawType === 'monthly').length;

const DUMMY_SUMMARY: EntrySummary = {
  weeklyThisWeek: 47,
  monthlyThisMonth: 18,
  weeklyTotal: weeklyCount + 280,
  monthlyTotal: monthlyCount + 60,
  active: 12,
  won: 8,
  lifetimeWinningsIqd: 80_000,
};

export function useEntrySummary() {
  return useQuery({
    queryKey: entryKeys.summary(),
    queryFn: () =>
      withFallback(
        () =>
          apiClient
            .get<EntrySummary>('/fawz_entry_generation/entry/summary')
            .then((r) => r.data),
        DUMMY_SUMMARY,
        'entrySummary',
      ),
  });
}

export function useEntryList(filter: EntryFilter = 'all') {
  return useQuery({
    queryKey: entryKeys.list(filter),
    queryFn: () =>
      withFallback(
        () =>
          apiClient
            .get<FawzEntry[]>('/fawz_entry_generation/entry/list', {
              params: filter === 'all' ? {} : { filter },
            })
            .then((r) => r.data),
        filter === 'all'
          ? DUMMY_ENTRIES
          : filter === 'weekly' || filter === 'monthly'
            ? DUMMY_ENTRIES.filter((e) => e.drawType === filter)
            : DUMMY_ENTRIES.filter((e) => e.source === filter),
        `entries-${filter}`,
      ),
  });
}
