import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { VitaEntry, VitaEntryEnum } from '../vita-entry';
import { AuthenticateService } from './authenticate.service';

@Injectable({
  providedIn: 'root'
})
export class VitaEntryService {
  private activeVitaType: VitaEntryEnum;
  private _entries = new BehaviorSubject<VitaEntry[]>([]);

  private dataStore: { entries: VitaEntry[] } = { entries: [] };

  constructor(private authenticationService: AuthenticateService, private http: HttpClient) { 
    this.activeVitaType = VitaEntryEnum.Introduction;
    this.authenticationService.authenticatedState.subscribe((x) => this.preload(x));
  }

  get entries() : Observable<VitaEntry[]> {
    return this._entries.asObservable();
  }

  public preload(isAuthenticated: boolean)
  {
    if (isAuthenticated)
    {
      this.http.get("api/v1/vita").subscribe(
        response => this.decodeVitaEntries(response),
        err => this.handleDataRetrivalError(err as HttpErrorResponse)
      );
    }
    else
    {
      this.dataStore = { entries : [] };
      this._entries.next(VitaEntry[0]);
    }
  }

  public load(vitaEntryType: VitaEntryEnum)
  {
    this.activeVitaType = vitaEntryType;
    this.loadDataForActiveVitaType();
  }

  private handleDataRetrivalError(err: HttpErrorResponse)
  {
    if (err != null)
    {
      if (err.status == 401)
      {
        this.authenticationService.UnauthorizedResponseInDataLoad();
      }
    }
  }

  private decodeVitaEntries(response: any): void
  {
    this.dataStore = {
      entries : response.entries.map(x => VitaEntry.FromJson(x))
    };
    this.loadDataForActiveVitaType();
  }

  private loadDataForActiveVitaType()
  {
    var entriesForAoi = Object.assign({}, this.dataStore).entries.filter(x => x.vitaEntryType == this.activeVitaType);
    this._entries.next(entriesForAoi);
  }
}
