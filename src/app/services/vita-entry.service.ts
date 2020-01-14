import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { VitaEntry, VitaEntryEnum } from '../vita-entry';
import { AuthenticateService } from './authenticate.service';

@Injectable({
  providedIn: 'root'
})
export class VitaEntryService {
  private _entries = new BehaviorSubject<VitaEntry[]>([]);

  private dataStore: { entries: VitaEntry[] } = { entries: [
    { title: 'a', vitaEntryType: VitaEntryEnum.Interest, lines: [
      'bla',
    ]},
    { title: 'b', vitaEntryType: VitaEntryEnum.Interest, lines: [ 
      'more',
    ]},
    { title: 'c', vitaEntryType: VitaEntryEnum.Person, lines: [ 
      'other' 
    ]},
  ] };

  constructor(private auth: AuthenticateService, private http: HttpClient) { 
    this.auth.activeCode.subscribe((x) => this.preload(x));
  }

  get entries() : Observable<VitaEntry[]> {
    return this._entries.asObservable();
  }

  public preload(code : string)
  {
    console.log("preload " + code);
    this.http.get("api/v1/vita").subscribe(
      response => this.decodeVitaEntries(response),
      err => console.log(err)
    );
  }

  public load(vitaEntryType: VitaEntryEnum)
  {
    var entriesForAoi = Object.assign({}, this.dataStore).entries.filter(x => x.vitaEntryType == vitaEntryType);
    this._entries.next(entriesForAoi);
  }

  private decodeVitaEntries(response: any): void
  {
    this.dataStore = {
      entries : response.entries.map(x => VitaEntry.FromJson(x))
    };
  }
}
