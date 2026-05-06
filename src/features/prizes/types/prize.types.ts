export type PayoutStatus = 'pending' | 'credited' | 'held' | 'rejected';
export type PrizeTier = 'last_4' | 'last_6' | 'last_8' | 'last_10';

export interface PayoutEvent {
  status: PayoutStatus | 'won';
  at: string;
  note?: string;
}

export interface Prize {
  id: string;
  drawId: string;
  drawDate: string;
  drawType: 'weekly' | 'monthly' | 'special';
  tier: PrizeTier;
  fawzNumber: string;
  prizeIqd: number;
  payoutStatus: PayoutStatus;
  payoutAt?: string;
  timeline: PayoutEvent[];
  reviewReason?: string;
}

export interface PrizeSummary {
  lifetimeIqd: number;
  totalWins: number;
  biggestWinIqd: number;
  thisMonthIqd: number;
}
