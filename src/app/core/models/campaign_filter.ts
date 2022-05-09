export interface ICampaignFilter {
  campaign?: string;
  type?: number;
  status?: number;
  startDate?: string;
  endDate?: string;
  page?: number;
  sortField?: string;
  sortOrder?: string;
}
