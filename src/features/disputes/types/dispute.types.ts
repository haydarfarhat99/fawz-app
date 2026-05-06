export type DisputeType =
  | 'missing_prize'
  | 'incorrect_entries'
  | 'referral_reward'
  | 'challenge_progress'
  | 'other';

export type DisputeStatus = 'pending' | 'in_review' | 'resolved' | 'rejected' | 'auto_resolved';

export interface Dispute {
  id: string;
  type: DisputeType;
  description: string;
  drawId?: string;
  fawzNumber?: string;
  status: DisputeStatus;
  resolution?: string;
  submittedAt: string;
  resolvedAt?: string;
}

export interface DisputeQuota {
  used: number;
  limit: number;
  resetsAt: string;
}

export interface SubmitDisputeRequest {
  type: DisputeType;
  description: string;
  draw_id?: string;
  fawz_number?: string;
}
