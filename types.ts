
export interface CampaignData {
  date: string;
  campaign: string;
  source: string;
  placement?: 'Feed' | 'Stories' | 'Reels' | 'Messenger' | 'Direct';
  contacts: number;
  qualified: number;
  disqualified: number;
  cost: number;
  cpl: number; // Cost Per Lead
}

export type AggregationLevel = 'daily' | 'weekly' | 'monthly';