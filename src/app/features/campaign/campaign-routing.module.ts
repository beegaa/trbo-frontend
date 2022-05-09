import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CampaignIndexComponent } from './components/campaign-index/campaign-index.component';
import { CampaignsComponent } from './components/campaigns/campaigns.component';

const routes: Routes = [
  {
    path: '',
    component: CampaignIndexComponent,
    children: [
      { path: '', component: CampaignsComponent },
      { path: 'list', component: CampaignsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CampaignRoutingModule { }
