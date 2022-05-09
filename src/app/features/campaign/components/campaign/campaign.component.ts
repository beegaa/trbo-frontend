import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { EMPTY, Observable, Subscription, tap } from 'rxjs';
import { IApiResponse } from 'src/app/core/models/api_response';
import { ICampaign, ICampaignWrite } from 'src/app/core/models/campaign';
import { CampaignService } from 'src/app/core/services/api/campaign.service';
import { startDateValidator } from '../../validators/start-date-validator.directive';

@Component({
  selector: 'app-campaign',
  templateUrl: './campaign.component.html',
  styleUrls: ['./campaign.component.sass']
})
export class CampaignComponent implements OnInit, OnDestroy, OnChanges {

  @Input('id') id: number | null = null;

  @Output() saved: EventEmitter<boolean> = new EventEmitter<boolean>();

  private isNewCampaign: boolean = true;

  private subscription: Subscription = Subscription.EMPTY;

  public loading: boolean = false;

  public loadingTypes: boolean = false;

  public saving: boolean = false;

  public campaing$: Observable<IApiResponse> = EMPTY;

  public types$: Observable<IApiResponse> = EMPTY;

  public campaignForm: FormGroup;

  public errors: string[] = [];

  constructor(private campaignService: CampaignService) {
    this.campaignForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      type: new FormControl('-1', [Validators.required, Validators.min(1)]),
      startDate: new FormControl('', [Validators.required]),
      endDate: new FormControl('', [Validators.required])
    }, { validators: startDateValidator });
  }

  ngOnInit(): void {
    this.types$ = this.campaignService.getAllTypes()
      .pipe(
        tap(_ => this.loadingTypes = false)
      );

    if (this.id != null) {
      this.loading = true;
      this.subscription = this.campaignService.get(this.id)
        .subscribe(campaign => {
          this.isNewCampaign = campaign == null;
          this.loading = false;

          if (!this.isNewCampaign) {
            this.campaignForm.get('name')?.setValue((campaign.data as ICampaign).campaign_name);
            this.campaignForm.get('type')?.setValue((campaign.data as ICampaign).campaign_type);
            this.campaignForm.get('startDate')?.setValue(moment.unix((campaign.data as ICampaign).campaign_start_timestamp).format('yyyy-MM-DD'));
            this.campaignForm.get('endDate')?.setValue(moment.unix((campaign.data as ICampaign).campaign_end_timestamp).format('yyyy-MM-DD'));
          }
        })

    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.campaignForm.reset();
  }

  public onSaveCampaign() {
    this.errors.splice(0);

    if (!this.campaignForm.valid) {
      for (let key in this.campaignForm.errors) {
        switch (key) {
          case 'startLargerThanEnd':
            this.errors.push(`Start date is larger then end date`);
            break;
          default:
            this.errors.push(`Invalid values`);
        }
      }

      for (let control in this.campaignForm.controls) {
        if (!this.campaignForm.controls[control].valid) {
          this.errors.push(`${control.toLowerCase()}: Field is required`);
        }
      }

      return;
    }

    let campaign: ICampaignWrite = {
      campaign_name: this.campaignForm.controls['name'].value,
      campaign_type: 1 * this.campaignForm.controls['type'].value,
      campaign_start_time: moment(this.campaignForm.controls['startDate'].value).utcOffset(0, true).format(),
      campaign_end_time: moment(this.campaignForm.controls['endDate'].value).utcOffset(0, true).format(),
    }
    if (!this.isNewCampaign) {
      campaign.campaign_id = this.id as number
    }

    this.saving = true;
    this.campaignService.saveOrUpdate(campaign)
      .subscribe({
        next: _ => {
          this.saved.emit(true);
        },
        error: e => {
          this.errors.splice(0);
          this.errors.push(e);
          this.saving = false;
        }
      });
  }

  public onCancelCampaign() {
    this.saved.emit(false);
  }

}
