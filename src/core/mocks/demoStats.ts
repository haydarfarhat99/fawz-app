/**
 * Single source of truth for the demo user's stats so the same numbers
 * surface across home, my-numbers, prizes, profile, draw-results, and
 * draw-detail. Every won draw declared here has a concrete fawz number
 * that matches the winning digits at a known position, so the detail
 * page can highlight the matched ticket consistently.
 *
 * Real-mode (live API) services should adapt their own response shapes;
 * this fixture is only consumed when withFallback() falls back to mock.
 */

const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hoursAgo = (n: number) => new Date(Date.now() - n * 3_600_000).toISOString();

export type WinTier = 'last_4' | 'last_6' | 'last_8' | 'last_10';
export type PayoutStatus = 'credited' | 'pending' | 'held' | 'rejected';

export interface DemoUserWin {
  id: string;
  drawId: string;
  drawType: 'weekly' | 'monthly';
  drawDate: string;
  /** The user's full 10-digit fawz number that matched. */
  fawzNumber: string;
  /** Which of the draw's winning numbers (0..n-1) this matched against. */
  matchedNumberIndex: number;
  tier: WinTier;
  prizeIqd: number;
  payoutStatus: PayoutStatus;
  payoutAt?: string;
}

/**
 * Canonical demo wins. Each fawzNumber's trailing digits exactly match the
 * corresponding draw's winning number at `matchedNumberIndex`, so the
 * detail page can detect the match without any extra data wiring:
 *   - draw-142 winning[0] = '9387541206'  → user '1234561206' (last 4 = 1206)
 *   - draw-141 winning[0] = '8472618395'  → user '1234618395' (last 6 = 618395)
 *   - draw-140 winning[0] = '1029384756'  → user '1229384756' (last 8 = 29384756)
 *
 * draw-143 (the most recent live-watched draw) is intentionally absent —
 * its win is created dynamically by the live simulation via sessionStorage.
 */
export const DEMO_USER_WINS: DemoUserWin[] = [
  {
    id: 'win-142',
    drawId: 'draw-142',
    drawType: 'weekly',
    drawDate: daysAgo(7),
    fawzNumber: '1234561206',
    matchedNumberIndex: 0,
    tier: 'last_4',
    prizeIqd: 10_000,
    payoutStatus: 'credited',
    payoutAt: hoursAgo(7 * 24 - 0.05),
  },
  {
    id: 'win-141',
    drawId: 'draw-141',
    drawType: 'monthly',
    drawDate: daysAgo(14),
    fawzNumber: '1234618395',
    matchedNumberIndex: 0,
    tier: 'last_6',
    prizeIqd: 250_000,
    payoutStatus: 'credited',
    payoutAt: daysAgo(14),
  },
  {
    id: 'win-140',
    drawId: 'draw-140',
    drawType: 'weekly',
    drawDate: daysAgo(21),
    fawzNumber: '1229384756',
    matchedNumberIndex: 0,
    tier: 'last_8',
    prizeIqd: 5_000_000,
    payoutStatus: 'held',
  },
];

/** Lookup helper used by the detail page + results page. */
export function findUserWin(drawId: string): DemoUserWin | undefined {
  return DEMO_USER_WINS.find((w) => w.drawId === drawId);
}

const credited = DEMO_USER_WINS.filter((w) => w.payoutStatus === 'credited');
const settled = DEMO_USER_WINS.filter((w) => w.payoutStatus !== 'rejected');
const lastMonth = DEMO_USER_WINS.filter(
  (w) => w.payoutStatus !== 'rejected' && Date.now() - Date.parse(w.drawDate) < 30 * 86_400_000,
);

export const DEMO_STATS = {
  /** Tickets the user holds in the *current* weekly draw window */
  weeklyTicketsThisWeek: 47,
  /** Tickets the user holds in the *current* monthly draw window */
  monthlyTicketsThisMonth: 18,
  /** All-time weekly tickets generated (used in My Numbers tagline) */
  weeklyTicketsLifetime: 312,
  /** All-time monthly tickets generated */
  monthlyTicketsLifetime: 60,
  /** Lifetime entries across both draw types */
  lifetimeEntries: 312 + 60,
  /** Number of completed wins (counts everything that wasn't rejected) */
  totalWins: settled.length,
  /** Lifetime IQD that has actually landed in the user's SuperQi wallet */
  lifetimeWinningsIqd: credited.reduce((s, p) => s + p.prizeIqd, 0),
  /** Largest single prize the user has ever won */
  biggestWinIqd: Math.max(...settled.map((p) => p.prizeIqd), 0),
  /** Total IQD won in the last 30 days (excluding rejected) */
  thisMonthWinningsIqd: lastMonth.reduce((s, p) => s + p.prizeIqd, 0),
} as const;
