import { Injectable, InjectionToken } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { VitaEntry, VitaEntryEnum, VitaEntryViewModel } from '../vita-entry';
import { AuthenticateService } from './authenticate.service';
import { LocalStorageService } from 'angular-2-local-storage';

export interface IVitaDataService {
  entries : Observable<VitaEntryViewModel[]>;
  duration : string;
  language : string;
  detailsExpanded : boolean;
  load(vitaEntryType: VitaEntryEnum);
  setDuration(duration: string);
}

export let VitaDataServiceConfig = new InjectionToken<IVitaDataService>('vitaDataService');

interface VitaDataResponse
{
  entries : VitaEntry[];
}

@Injectable({
  providedIn: 'root'
})
export class VitaDataService implements IVitaDataService {
  private activeVitaType: VitaEntryEnum;
  private _entries = new BehaviorSubject<VitaEntryViewModel[]>([]);

  private dataStore: VitaDataResponse = { entries: [] };
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

  get entries() : Observable<VitaEntryViewModel[]> {
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

  public get detailsExpanded()
  {
    return this.duration != "S";
  }

  public preload(isAuthenticated: boolean)
  {
    if (isAuthenticated)
    {
      this.http.get<VitaDataResponse>("api/v1/vita").subscribe(
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

  private decodeVitaEntries(response: VitaDataResponse): void
  {
    let entries : VitaEntry[] = response.entries.map(x => VitaEntry.FromJson(x));

    let introduction = entries.find(x => x.vitaEntryType == VitaEntryEnum.Introduction);
    this._language = introduction?.language || "English";

    this.dataStore = {
      entries : entries
    };

    this.loadDataForActiveVitaType();
  }

  private loadDataForActiveVitaType()
  {
    var entriesForAoi = this.dataStore.entries.filter(
      x => x.vitaEntryType == this.activeVitaType 
      && x.language.indexOf(this._language) >= 0);

    var generator = new VitaDataService.ViewModelGenerator(entriesForAoi, this.duration)
    var models = generator.generate();
    this._entries.next(models);
  }

  private static ViewModelGenerator = class 
  {
    readonly reducedItems = new Map<string, VitaEntry>();
    readonly expandedItems = new Map<string, VitaEntry>();

    constructor(private entries: VitaEntry[], private duration: string)
    {
    }

    public generate() : VitaEntryViewModel[]
    {
      this.initReducedEntries();
      this.initExpandedEntries();
      this.distributeMediumEntries();

      let distinctOrderedTitles = [...new Set(this.entries.map(x => x.title))];

      return distinctOrderedTitles
        .filter(x => this.shouldGenerateModel(x))
        .map(x => this.generateModel(x));
    }

    private shouldGenerateModel(title: string): boolean
    {
      if (this.reducedItems.has(title))
      {
        return true;
      }

      if (this.duration == "L" && this.expandedItems.has(title))
      {
        return true;
      }

      return false;
    }

    private generateModel(title: string): VitaEntryViewModel
    {
      let reducedItem = this.reducedItems.get(title);
      let expandedItem = this.expandedItems.get(title);

      if (reducedItem == expandedItem)
      {
        expandedItem = undefined;
      }

      let model = new VitaEntryViewModel(reducedItem, expandedItem);
      if (model.canExpand && this.duration == "L")
      {
        model.expanded = true;
      }
      
      return model;
    }

    private distributeMediumEntries()
    {
      if (this.duration == "S")
      {
        return;
      }

      for (const entry of this.entries.filter(x => x.duration.indexOf("M") >= 0)) 
      {
        if (entry.duration.indexOf("S") >= 0)
        {
          // do nothing, if the same entry is short and medium
        }
        else if (entry.duration.indexOf("L") < 0)
        {
          this.reducedItems.set(entry.title, entry);
        }
        else if (this.duration == "M" && !this.reducedItems.has(entry.title))
        {
          this.reducedItems.set(entry.title, entry);
          this.expandedItems.delete(entry.title);
        }
      }
    }

    private initReducedEntries()
    {
      this.entries
        .filter(x => x.duration.indexOf("S") >= 0)
        .forEach(x => this.reducedItems.set(x.title, x));
    }

    private initExpandedEntries()
    {
      this.entries
        .filter(x => x.duration.indexOf("L") >= 0)
        .forEach(x => this.expandedItems.set(x.title, x));
    }
  }
}
