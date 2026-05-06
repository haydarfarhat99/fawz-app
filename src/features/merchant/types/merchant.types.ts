export interface MerchantSummary {
  isEligible: boolean;
  weeklyEntryCount: number;
  monthlyEntryCount: number;
  rolling30dVolumeIqd: number;
  rolling30dTransactions: number;
  minMonthlyVolumeIqd: number;
  minMonthlyTransactions: number;
  nextEligibilityRecheckAt: string;
  storeName: string;
  category: string;
}

export interface MerchantEntry {
  id: string;
  fawzNumber: string;
  drawId: string;
  drawDate: string;
  customerTransactionAmount: number;
  source: 'shared_with_customer';
  createdAt: string;
}

export interface MerchantPrize {
  id: string;
  drawId: string;
  drawDate: string;
  drawType: 'weekly' | 'monthly' | 'special';
  fawzNumber: string;
  tier: 'last_4' | 'last_6' | 'last_8' | 'last_10';
  prizeIqd: number;
  payoutStatus: 'pending' | 'credited' | 'held' | 'rejected';
  payoutAt?: string;
}
