export type ReferralStatus = 'pending' | 'qualified' | 'rewarded' | 'rejected' | 'expired';

export interface ReferralLink {
  code: string;
  url: string;
  expiresAt: string;
}

export interface ReferralStats {
  monthCount: number;
  totalCount: number;
  entriesEarned: number;
  cashEarnedIqd: number;
  monthlyCap: number;
}

export interface ReferralRecord {
  id: string;
  partialName: string;
  status: ReferralStatus;
  qualifiedAt?: string;
  invitedAt: string;
  referrerEntries: number;
  referrerCashIqd: number;
}
