import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'campaings',
    loadChildren: () => import('./features/campaign/campaign.module').then(m => m.CampaignModule)
  },
  {
    path: '',
    redirectTo: 'campaings',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'campaings',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
