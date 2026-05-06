/**
 * Single source of truth for the demo user's stats so the same numbers
 * surface across home, my-numbers, prizes, profile, and notifications.
 *
 * Real-mode (live API) services should adapt their own response shapes;
 * this fixture is only consumed when withFallback() falls back to mock.
 */

const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hoursAgo = (n: number) => new Date(Date.now() - n * 3_600_000).toISOString();

export interface DemoPrizeFixture {
  id: string;
  drawId: string;
  drawDate: string;
  drawType: 'weekly' | 'monthly';
  tier: 'last_4' | 'last_6' | 'last_8' | 'last_10';
  prizeIqd: number;
  payoutStatus: 'credited' | 'pending' | 'held' | 'rejected';
  payoutAt?: string;
}

/** Canonical demo prize history. All other totals derive from this list. */
export const DEMO_PRIZE_FIXTURE: DemoPrizeFixture[] = [
  { id: 'p1', drawId: 'draw-142', drawDate: daysAgo(7),  drawType: 'weekly',  tier: 'last_4', prizeIqd: 10_000,    payoutStatus: 'credited', payoutAt: hoursAgo(7 * 24 - 0.05) },
  { id: 'p2', drawId: 'draw-141', drawDate: daysAgo(14), drawType: 'monthly', tier: 'last_6', prizeIqd: 250_000,   payoutStatus: 'credited', payoutAt: daysAgo(14) },
  { id: 'p3', drawId: 'draw-143', drawDate: hoursAgo(2), drawType: 'weekly',  tier: 'last_4', prizeIqd: 10_000,    payoutStatus: 'pending' },
  { id: 'p4', drawId: 'draw-140', drawDate: daysAgo(21), drawType: 'weekly',  tier: 'last_8', prizeIqd: 5_000_000, payoutStatus: 'held' },
  { id: 'p5', drawId: 'draw-138', drawDate: daysAgo(35), drawType: 'weekly',  tier: 'last_4', prizeIqd: 10_000,    payoutStatus: 'credited', payoutAt: daysAgo(35) },
  { id: 'p6', drawId: 'draw-130', drawDate: daysAgo(70), drawType: 'monthly', tier: 'last_4', prizeIqd: 10_000,    payoutStatus: 'rejected' },
];

const credited = DEMO_PRIZE_FIXTURE.filter((p) => p.payoutStatus === 'credited');
const settled = DEMO_PRIZE_FIXTURE.filter((p) => p.payoutStatus !== 'rejected');
const lastMonth = DEMO_PRIZE_FIXTURE.filter(
  (p) => p.payoutStatus !== 'rejected' && Date.now() - Date.parse(p.drawDate) < 30 * 86_400_000,
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
  biggestWinIqd: Math.max(...settled.map((p) => p.prizeIqd)),
  /** Total IQD won in the last 30 days (excluding rejected) */
  thisMonthWinningsIqd: lastMonth.reduce((s, p) => s + p.prizeIqd, 0),
} as const;
