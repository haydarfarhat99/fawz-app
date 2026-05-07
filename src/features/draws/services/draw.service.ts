import { useQuery } from '@tanstack/react-query';
import { apiClient, withFallback } from '@core/network/apiClient';
import { generateFawzNumber } from '@core/utils/helpers';
import { findUserWin } from '@core/mocks/demoStats';
import type { Draw, DrawWinner, MyDrawResult } from '../types/draw.types';

export const drawKeys = {
  all: ['draws'] as const,
  lists: () => [...drawKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...drawKeys.lists(), filters] as const,
  details: () => [...drawKeys.all, 'detail'] as const,
  detail: (id: string) => [...drawKeys.details(), id] as const,
  current: () => [...drawKeys.all, 'current'] as const,
  myResult: (id: string) => [...drawKeys.all, 'myResult', id] as const,
};

const DUMMY_DRAWS: Draw[] = [
  {
    id: 'draw-143',
    type: 'weekly',
    drawDate: new Date(Date.now() - 1 * 60_000).toISOString(),
    status: 'finalized',
    jackpotIqd: 75_000_000,
    entryPoolSize: 102_584_392,
    winningNumbers: ['9387541206', '4521098763', '1736294085'],
    airedAt: new Date(Date.now() - 1 * 60_000).toISOString(),
  },
  {
    id: 'draw-142',
    type: 'weekly',
    drawDate: new Date(Date.now() - 7 * 86400000).toISOString(),
    status: 'finalized',
    jackpotIqd: 50_000_000,
    entryPoolSize: 87_432_109,
    winningNumbers: ['9387541206', '4521098763', '1736294085'],
    airedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id: 'draw-141',
    type: 'monthly',
    drawDate: new Date(Date.now() - 14 * 86400000).toISOString(),
    status: 'finalized',
    jackpotIqd: 250_000_000,
    entryPoolSize: 312_847_201,
    winningNumbers: ['8472618395', '6193847265', '2058371946'],
    airedAt: new Date(Date.now() - 14 * 86400000).toISOString(),
  },
  {
    id: 'draw-140',
    type: 'weekly',
    drawDate: new Date(Date.now() - 21 * 86400000).toISOString(),
    status: 'finalized',
    jackpotIqd: 30_000_000,
    entryPoolSize: 76_290_843,
    winningNumbers: ['1029384756', '7463829105', '5647382910'],
    airedAt: new Date(Date.now() - 21 * 86400000).toISOString(),
  },
];

const NEXT_DRAW_DATE = (() => {
  const d = new Date();
  d.setDate(d.getDate() + ((4 - d.getDay() + 7) % 7 || 7));
  d.setHours(21, 0, 0, 0);
  return d.toISOString();
})();

const CURRENT_LIVE_DRAW: Draw = {
  id: 'draw-143',
  type: 'weekly',
  drawDate: NEXT_DRAW_DATE,
  status: 'live',
  jackpotIqd: 75_000_000,
  entryPoolSize: 102_584_392,
};

export function useCurrentDraw() {
  return useQuery({
    queryKey: drawKeys.current(),
    queryFn: () =>
      withFallback(
        () => apiClient.get<Draw>('/fawz_draw_management/draw/current').then((r) => r.data),
        CURRENT_LIVE_DRAW,
        'currentDraw',
      ),
  });
}

export function useDrawList() {
  return useQuery({
    queryKey: drawKeys.list({}),
    queryFn: () =>
      withFallback(
        () => apiClient.get<Draw[]>('/fawz_draw_management/draw/list').then((r) => r.data),
        DUMMY_DRAWS,
        'drawList',
      ),
  });
}

export function useDrawDetail(id: string | undefined) {
  return useQuery({
    queryKey: drawKeys.detail(id ?? ''),
    enabled: !!id,
    queryFn: async () => {
      try {
        return await apiClient.get<Draw>(`/fawz_draw_management/draw/${id}`).then((r) => r.data);
      } catch {
        const dummy = DUMMY_DRAWS.find((d) => d.id === id);
        if (!dummy) throw new Error('DRAW_NOT_FOUND');
        return dummy;
      }
    },
    retry: false,
  });
}

export function useMyDrawResult(drawId: string | undefined) {
  return useQuery({
    queryKey: drawKeys.myResult(drawId ?? ''),
    enabled: !!drawId,
    queryFn: () =>
      withFallback(
        () => apiClient.get<MyDrawResult>(`/fawz_draw_management/draw/${drawId}/my_result`).then((r) => r.data),
        buildDummyMyResult(drawId ?? ''),
        `myResult-${drawId}`,
      ),
  });
}

interface SessionWinSnapshot {
  tier: 'last_4' | 'last_6' | 'last_8' | 'last_10';
  prize: number;
  fawzNumber: string;
}

function readSessionWin(): SessionWinSnapshot | null {
  try {
    const raw = sessionStorage.getItem('fawz.lastDraw.win');
    return raw ? (JSON.parse(raw) as SessionWinSnapshot) : null;
  } catch {
    return null;
  }
}

function readSessionScenario(): string | null {
  try {
    return sessionStorage.getItem('fawz.lastDraw.scenario');
  } catch {
    return null;
  }
}

function buildDummyMyResult(drawId: string): MyDrawResult {
  const draw = DUMMY_DRAWS.find((d) => d.id === drawId);
  if (!draw) throw new Error('DRAW_NOT_FOUND');
  const myEntries = Array.from({ length: 12 }, () => ({ fawzNumber: generateFawzNumber() }));
  const winners: DrawWinner[] = [];
  const matches: MyDrawResult['matches'] = [];

  // For draw-143 (the just-completed one), the live simulation's sessionStorage
  // overrides any fixture data — reflect what the user actually watched.
  if (drawId === 'draw-143') {
    const sessionScenario = readSessionScenario();
    const sessionWin = readSessionWin();
    if (sessionScenario === 'lose') {
      return { draw, myEntries, myWins: winners, matches };
    }
    if (sessionWin) {
      myEntries[0] = { fawzNumber: sessionWin.fawzNumber };
      winners.push({
        id: 'win-' + drawId,
        drawId,
        userId: 'demo-user',
        fawzNumber: sessionWin.fawzNumber,
        tier: sessionWin.tier,
        prizeIqd: sessionWin.prize,
        status: 'pending',
      });
      matches.push({
        fawzNumber: sessionWin.fawzNumber,
        numberIndex: 0,
        tier: sessionWin.tier,
        prizeIqd: sessionWin.prize,
      });
      return { draw, myEntries, myWins: winners, matches };
    }
    // No prior simulation — show no match (user has not watched yet)
    return { draw, myEntries, myWins: winners, matches };
  }

  // For all other draws, look up the canonical user-wins fixture so the
  // result here matches what's shown on /draws/results, /prizes, and /entries.
  const fixture = findUserWin(drawId);
  if (fixture) {
    myEntries[0] = { fawzNumber: fixture.fawzNumber };
    const status: DrawWinner['status'] =
      fixture.payoutStatus === 'credited' ? 'credited' :
      fixture.payoutStatus === 'rejected' ? 'rejected' :
      fixture.payoutStatus === 'held' ? 'held' :
      'pending';
    winners.push({
      id: fixture.id,
      drawId,
      userId: 'demo-user',
      fawzNumber: fixture.fawzNumber,
      tier: fixture.tier,
      prizeIqd: fixture.prizeIqd,
      status,
    });
    matches.push({
      fawzNumber: fixture.fawzNumber,
      numberIndex: fixture.matchedNumberIndex,
      tier: fixture.tier,
      prizeIqd: fixture.prizeIqd,
    });
  }

  return { draw, myEntries, myWins: winners, matches };
}
