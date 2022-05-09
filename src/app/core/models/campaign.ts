export interface ICampaign {
  campaign_id: number,
  campaign_name: string,
  campaign_type: number,
  campaign_start_time: string,
  campaign_start_timestamp: number,
  campaign_end_time: string,
  campaign_end_timestamp: number,
  campaign_type_text: string
  campaign_status_id: number,
  campaign_status_text: string
}

export interface ICampaignWrite {
  campaign_id?: number,
  campaign_name: string,
  campaign_type: number,
  campaign_start_time: string,
  campaign_end_time: string
}
