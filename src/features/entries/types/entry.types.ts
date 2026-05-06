export type EntrySource = 'transaction' | 'challenge' | 'referral' | 'retroactive';
export type EntryOutcome = 'active' | 'won' | 'lost';
export type EntryDrawType = 'weekly' | 'monthly';

export interface FawzEntry {
  id: string;
  fawzNumber: string;
  source: EntrySource;
  drawType: EntryDrawType;
  createdAt: string;
  drawId: string;
  drawWeekLabel: string;
  outcome: EntryOutcome;
  wonTier?: 'last_4' | 'last_6' | 'last_8' | 'last_10';
  wonPrizeIqd?: number;
  transactionAmount?: number;
}

export interface EntrySummary {
  weeklyThisWeek: number;
  monthlyThisMonth: number;
  weeklyTotal: number;
  monthlyTotal: number;
  active: number;
  won: number;
  lifetimeWinningsIqd: number;
}

export type EntryFilter = 'all' | EntryDrawType | EntrySource;
