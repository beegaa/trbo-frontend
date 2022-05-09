import { Component, OnDestroy, OnInit } from '@angular/core';
import * as moment from 'moment';
import { combineLatestWith, debounceTime, EMPTY, map, Observable, Subject, tap } from 'rxjs';
import { IApiResponse } from 'src/app/core/models/api_response';
import { ICampaign } from 'src/app/core/models/campaign';
import { ICampaignFilter } from 'src/app/core/models/campaign_filter';
import { CampaignService } from 'src/app/core/services/api/campaign.service';

@Component({
  selector: 'app-campaigns',
  templateUrl: './campaigns.component.html',
  styleUrls: ['./campaigns.component.sass']
})
export class CampaignsComponent implements OnInit, OnDestroy {

  private subject: Subject<ICampaignFilter> = new Subject<ICampaignFilter>();

  private fitlerChanged: Observable<ICampaignFilter> = EMPTY;

  public filter: ICampaignFilter = {};

  public loading: boolean = false;

  public loadingTypes: boolean = false;

  public currentPage = 1;

  public pages: number[] = [];

  public modalVisible: boolean = false;

  public changingStatus: boolean = false;

  public editingCampaignId: number | null = null;

  public campaigns$: Observable<ICampaign[]> = EMPTY;

  public types$: Observable<IApiResponse> = EMPTY;

  constructor(private campaignService: CampaignService) {
    this.fitlerChanged = this.subject.asObservable();
  }

  ngOnDestroy(): void {
    this.subject.unsubscribe();
  }

  ngOnInit(): void {
    this.loadingTypes = true;

    this.types$ = this.campaignService.getAllTypes()
      .pipe(
        tap(_ => this.loadingTypes = false)
      );

    this.campaigns$ = this.initCampaignsObservables();
  }

  private initCampaignsObservables(): Observable<ICampaign[]> {
    this.loading = true;

    return this.campaignService.getAll()
      .pipe(
        tap(_ => {
          this.subject.next(Object.assign(this.filter, { page: this.currentPage }));
        }),
        combineLatestWith(this.fitlerChanged),
        debounceTime(500),
        map(([response, filter]) => (response.data as ICampaign[])
          ?.filter((campaign, index) => {
            let success = true;

            if ((filter.campaign ?? '').trim() != '') {
              success = success && campaign.campaign_name.includes(filter.campaign as string);
            }
            if ((filter.startDate ?? '').trim() != '') {
              success = success && moment(filter.startDate).format('l') == moment.unix(campaign.campaign_start_timestamp).format('l');
            }
            if ((filter.endDate ?? '').trim() != '') {
              success = success && moment(filter.endDate).format('l') == moment.unix(campaign.campaign_end_timestamp).format('l');
            }
            if (1 * (filter.type as number) > 0) {
              success = success && campaign.campaign_type == filter.type;
            }
            if ([0, 1].includes(1 * (filter.status as number))) {
              success = success && campaign.campaign_status_id == filter.status
            }

            return success;
          })
          .sort((a: ICampaign, b: ICampaign) => {
            let compare = 0;
            switch (filter.sortField) {
              case 'campaign':
                compare = a.campaign_name.localeCompare(b.campaign_name, undefined, { sensitivity: 'base' });
                break;
              case 'type':
                compare = a.campaign_type > b.campaign_type ? 1 : a.campaign_type < b.campaign_type ? -1 : 0;
                break;
              case 'startDate':
                compare = a.campaign_start_timestamp > b.campaign_start_timestamp ? 1 : a.campaign_start_timestamp < b.campaign_start_timestamp ? -1 : 0;
                break;
              case 'endDate':
                compare = a.campaign_end_timestamp > b.campaign_end_timestamp ? 1 : a.campaign_end_timestamp < b.campaign_end_timestamp ? -1 : 0;
                break;
              case 'status':
                compare = a.campaign_status_id > b.campaign_status_id ? 1 : a.campaign_status_id < b.campaign_status_id ? -1 : 0;
                break;
              default:
                compare = a.campaign_id > b.campaign_id ? 1 : a.campaign_id < b.campaign_id ? -1 : 0;
                break;
            }
            return (filter.sortOrder == 'DESC' ? -1 : 1) * compare;
          })),
        tap(response => {
          console.log(response);
          this.pages.splice(0);
          if (response.length > 0) {
            this.pages.push(...Array.from({ length: Math.ceil(response.length / 15) }, (_, i) => i + 1));
          }
          this.loading = false;
        }),
        map(response => {
          return response.filter((_, index) =>
            index >= (this.currentPage - 1) * 15 && index < (this.currentPage - 1) * 15 + 15);
        })
      );
  }

  public onFilterChange(values: { field: string, value: any }[]): void {
    values.forEach(val => {
      switch (val.field) {
        case 'page':
          let lastPage = this.pages.length > 0 ? this.pages[this.pages.length - 1] : 1;

          this.currentPage = val.value <= 0 ? 1 : val.value > lastPage ? lastPage : val.value;
          val.value = this.currentPage;

          window.scrollTo({ top: 0, behavior: 'smooth' });

          break;
      }

      let filter: any = {};
      filter[val.field] = val.value;
      this.filter = Object.assign(this.filter, filter);

      this.subject.next(this.filter);
    });
  }

  public onSortChange(field: string) {
    let order: string = this.filter.sortField == field && this.filter.sortOrder == 'ASC' ? 'DESC' : 'ASC';
    this.filter = Object.assign(this.filter, { 'sortField': field, 'sortOrder': order });

    this.subject.next(this.filter);
  }

  public onCreateNewCampaign(): void {
    this.modalVisible = true;
  }

  public onEditCampaign(campaign: ICampaign): void {
    this.modalVisible = true;
    this.editingCampaignId = campaign.campaign_id;
  }

  public campaignSavedEvent(saved: boolean) {
    this.modalVisible = false;
    this.editingCampaignId = null;

    if (saved == true) {
      this.showMessage('Campaign saved successfully', 5000);
      this.campaigns$ = this.initCampaignsObservables();
    }
  }

  public onStatusChange(campaignId: number, activate: number) {
    this.changingStatus = true;

    this.campaignService.activate(campaignId, activate)
      .subscribe(_ => {
        this.showMessage('Campaign status changed successfully', 5000);
        this.changingStatus = false;
        this.campaigns$ = this.initCampaignsObservables();
      })
  }

  private showMessage(message: string, duration: number) {
    const div = document.getElementById('campaignmessage');

    if (div == null) {
      return;
    }

    div.innerHTML = message;
    setTimeout(() => div.innerHTML = "", duration);
  }

}
