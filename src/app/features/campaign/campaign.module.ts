import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CampaignIndexComponent } from './components/campaign-index/campaign-index.component';
import { CampaignsComponent } from './components/campaigns/campaigns.component';
import { CampaignComponent } from './components/campaign/campaign.component';
import { CampaignRoutingModule } from './campaign-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    CampaignIndexComponent,
    CampaignsComponent,
    CampaignComponent
  ],
  imports: [
    CommonModule,
    CampaignRoutingModule,
    SharedModule
  ]
})
export class CampaignModule { }
