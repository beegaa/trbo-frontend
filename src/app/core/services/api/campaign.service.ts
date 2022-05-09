import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IApiResponse } from '../../models/api_response';
import { ICampaignWrite } from '../../models/campaign';

@Injectable({
  providedIn: 'root'
})
export class CampaignService {

  constructor(private httpClient: HttpClient) { }

  public get(id: number): Observable<IApiResponse> {
    return this.httpClient.get<IApiResponse>(`${environment.api_endpoint}/campaigns/${id}`);
  }

  public getAll(): Observable<IApiResponse> {
    return this.httpClient.get<IApiResponse>(`${environment.api_endpoint}/campaigns`);
  }

  public getAllTypes(): Observable<IApiResponse> {
    return this.httpClient.get<IApiResponse>(`${environment.api_endpoint}/campaigns/types`);
  }

  public saveOrUpdate(campaign: ICampaignWrite): Observable<IApiResponse> {
    return this.httpClient.post<IApiResponse>(`${environment.api_endpoint}/campaigns`, campaign);
  }

  public activate(id: number, activate: number): Observable<IApiResponse> {
    return this.httpClient.get<IApiResponse>(`${environment.api_endpoint}/campaigns/activate/${id}/${activate}`);
  }
}
