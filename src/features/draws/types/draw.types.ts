export type DrawStatus = 'scheduled' | 'snapshot' | 'live' | 'finalizing' | 'finalized';
export type DrawType = 'weekly' | 'monthly' | 'special';
export type WinnerTier = 'last_4' | 'last_6' | 'last_8' | 'last_10';

export interface Draw {
  id: string;
  type: DrawType;
  drawDate: string;
  status: DrawStatus;
  jackpotIqd: number;
  entryPoolSize: number;
  winningNumbers?: string[];
  airedAt?: string;
}

export interface DrawDigitEvent {
  numberIndex: 0 | 1 | 2;
  digitPosition: number;
  digitValue: number;
  timestamp: string;
}

export interface DrawWinner {
  id: string;
  drawId: string;
  userId: string;
  fawzNumber: string;
  tier: WinnerTier;
  prizeIqd: number;
  status: 'pending' | 'credited' | 'held' | 'rejected';
}

export interface MyDrawResult {
  draw: Draw;
  myEntries: { fawzNumber: string }[];
  myWins: DrawWinner[];
  matches: { fawzNumber: string; numberIndex: number; tier: WinnerTier; prizeIqd: number }[];
}

export type ConnectionState = 'connecting' | 'connected' | 'degraded' | 'disconnected';

export interface LiveDrawSnapshot {
  draw: Draw;
  digits: DrawDigitEvent[];
  viewerCount: number;
  connection: ConnectionState;
  result?: {
    isWinner: boolean;
    tier?: WinnerTier;
    prizeIqd?: number;
    matchedFawzNumber?: string;
    matchedNumberIndex?: number;
  };
}
