import { useQuery } from '@tanstack/react-query';
import { apiClient, withFallback } from '@core/network/apiClient';
import { generateFawzNumber } from '@core/utils/helpers';
import { DEMO_STATS } from '@core/mocks/demoStats';
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

const DUMMY_SUMMARY: EntrySummary = {
  weeklyThisWeek: DEMO_STATS.weeklyTicketsThisWeek,
  monthlyThisMonth: DEMO_STATS.monthlyTicketsThisMonth,
  weeklyTotal: DEMO_STATS.weeklyTicketsLifetime,
  monthlyTotal: DEMO_STATS.monthlyTicketsLifetime,
  active: DEMO_STATS.weeklyTicketsThisWeek + DEMO_STATS.monthlyTicketsThisMonth,
  won: DEMO_STATS.totalWins,
  lifetimeWinningsIqd: DEMO_STATS.lifetimeWinningsIqd,
};

interface ApiFawzEntry {
  fawz_entry_id: string;
  fawz_number: string;
  source?: string;
  draw_type?: string;
  draw_id?: string;
  date_created?: string;
  is_won?: boolean;
  won_tier?: string;
  won_prize_iqd?: number;
  transaction_amount?: number;
}

interface FawzEntriesListResponse {
  fawz_entries_list: ApiFawzEntry[];
  total_fawz_entries: number;
  page: number;
  page_size: number;
}

function adaptApiEntry(raw: ApiFawzEntry): FawzEntry {
  const drawType = (raw.draw_type === 'monthly' ? 'monthly' : 'weekly') as FawzEntry['drawType'];
  const source = (sources.includes(raw.source as FawzEntry['source'])
    ? raw.source
    : 'transaction') as FawzEntry['source'];
  return {
    id: raw.fawz_entry_id,
    fawzNumber: raw.fawz_number,
    source,
    drawType,
    createdAt: raw.date_created ?? new Date().toISOString(),
    drawId: raw.draw_id ?? '',
    drawWeekLabel: raw.date_created ?? new Date().toISOString(),
    outcome: raw.is_won ? 'won' : 'active',
    wonTier: raw.won_tier as FawzEntry['wonTier'],
    wonPrizeIqd: raw.won_prize_iqd,
    transactionAmount: raw.transaction_amount,
  };
}

function deriveSummaryFromList(list: FawzEntry[]): EntrySummary {
  const weekly = list.filter((e) => e.drawType === 'weekly');
  const monthly = list.filter((e) => e.drawType === 'monthly');
  const oneWeekAgo = Date.now() - 7 * 86_400_000;
  const oneMonthAgo = Date.now() - 30 * 86_400_000;
  const won = list.filter((e) => e.outcome === 'won');
  return {
    weeklyThisWeek: weekly.filter((e) => Date.parse(e.createdAt) >= oneWeekAgo).length,
    monthlyThisMonth: monthly.filter((e) => Date.parse(e.createdAt) >= oneMonthAgo).length,
    weeklyTotal: weekly.length,
    monthlyTotal: monthly.length,
    active: list.filter((e) => e.outcome === 'active').length,
    won: won.length,
    lifetimeWinningsIqd: won.reduce((sum, e) => sum + (e.wonPrizeIqd ?? 0), 0),
  };
}

export function useEntrySummary() {
  return useQuery({
    queryKey: entryKeys.summary(),
    queryFn: () =>
      withFallback(
        async () => {
          const { data } = await apiClient.get<FawzEntriesListResponse>(
            '/fawz_entry_generation/fawz_entries',
            { params: { page: 1, page_size: 200 } },
          );
          if (!data.fawz_entries_list?.length) return DUMMY_SUMMARY;
          return deriveSummaryFromList(data.fawz_entries_list.map(adaptApiEntry));
        },
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
        async () => {
          const params: Record<string, unknown> = { page: 1, page_size: 100 };
          if (filter === 'weekly' || filter === 'monthly') params.draw_type = filter;
          const { data } = await apiClient.get<FawzEntriesListResponse>(
            '/fawz_entry_generation/fawz_entries',
            { params },
          );
          if (!data.fawz_entries_list?.length) {
            return filter === 'all'
              ? DUMMY_ENTRIES
              : filter === 'weekly' || filter === 'monthly'
                ? DUMMY_ENTRIES.filter((e) => e.drawType === filter)
                : DUMMY_ENTRIES.filter((e) => e.source === filter);
          }
          const list = data.fawz_entries_list.map(adaptApiEntry);
          if (filter === 'all') return list;
          if (filter === 'weekly' || filter === 'monthly') return list.filter((e) => e.drawType === filter);
          return list.filter((e) => e.source === filter);
        },
        filter === 'all'
          ? DUMMY_ENTRIES
          : filter === 'weekly' || filter === 'monthly'
            ? DUMMY_ENTRIES.filter((e) => e.drawType === filter)
            : DUMMY_ENTRIES.filter((e) => e.source === filter),
        `entries-${filter}`,
      ),
  });
}
