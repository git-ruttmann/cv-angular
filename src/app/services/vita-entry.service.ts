import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { VitaEntry, VitaEntryEnum } from '../vita-entry';
import { AuthenticateService } from './authenticate.service';
import { LocalStorageService } from 'angular-2-local-storage';

@Injectable({
  providedIn: 'root'
})
export class VitaEntryService {
  private activeVitaType: VitaEntryEnum;
  private _entries = new BehaviorSubject<VitaEntry[]>([]);

  private dataStore: { entries: VitaEntry[] } = { entries: [] };
  private _language: string;
  private _duration: string;

  constructor(
    private authenticationService: AuthenticateService, 
    private http: HttpClient,
    private localStorageService: LocalStorageService)
  {
    this.activeVitaType = VitaEntryEnum.Introduction;
    this.authenticationService.authenticatedState.subscribe((x) => this.preload(x));
    this._language = "English";
    this._duration = this.localStorageService.get("duration") || "S";
  }

  get entries() : Observable<VitaEntry[]> {
    return this._entries.asObservable();
  }

  public get duration()
  {
    return this._duration;
  }

  public get language()
  {
    return this._language;
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

  public setDuration(duration: string)
  {
    this._duration = duration.substr(0, 1);
    if (duration != "S" && duration != "M" && duration != "L")
    {
      throw "Unkown duration: " + duration;
    }

    this.localStorageService.set("duration", this.duration);
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
    let entries : VitaEntry[] = response.entries.map(x => VitaEntry.FromJson(x));

    let introduction = entries.find(x => x.vitaEntryType == VitaEntryEnum.Introduction);
    this._language = introduction.language || "English";

    this.dataStore = {
      entries : entries
    };

    this.loadDataForActiveVitaType();
  }

  private loadDataForActiveVitaType()
  {
    var entriesForAoi = Object.assign({}, this.dataStore).entries.filter(
      x => x.vitaEntryType == this.activeVitaType 
      && x.language.indexOf(this._language) >= 0
      && x.duration.indexOf(this._duration) >= 0);
    this._entries.next(entriesForAoi);
  }
}
