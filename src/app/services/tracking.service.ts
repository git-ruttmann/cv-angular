import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { Subject, Observable } from 'rxjs';

import { IVitaDataService, VitaDataServiceConfig } from './vita-data.service';

export interface ITrackedItem
{
  Topic: String;
  Start: number;
  End: number;
}

/**
 * Inform the content component about a global event.
 * Allows to track the content at time of the event.
 */
@Injectable({
  providedIn: 'root'
})
export class TrackingEventService 
{
  private _trackingEvent = new Subject<String>();

  public Track(reason: String)
  {
    this._trackingEvent.next(reason);
  }

  public get trackingEvent() : Observable<String> { 
    return this._trackingEvent.asObservable();
  }
}

/**
 * track global event
 */
@Injectable({
  providedIn: 'root'
})
export class TrackingService 
{
  lastUrl: string;

  constructor(
    private http: HttpClient,
    @Inject(VitaDataServiceConfig) private dataService : IVitaDataService,
    private router : Router)
  {
    router.events.subscribe(() => this.RouteChanged());
  }

  public TrackTopics(url: string, items: ITrackedItem[])
  {
    let headers = new HttpHeaders({'Content-Type': 'application/json'});
    this.http.post(
      "api/v1/track/topics", 
      { Url: url, Duration: this.dataService.duration, Topics: items }, 
      { headers: headers })
      .subscribe((response) => {});
  }

  public Track(url: string, topic: string, scroll: number)
  {
    let headers = new HttpHeaders({'Content-Type': 'application/json'});
    this.http.post(
      "api/v1/track", 
      { Url: url, Topic: topic, Scroll: scroll, Duration: this.dataService.duration }, 
      { headers: headers })
      .subscribe((response) => {});
  }

  private RouteChanged(): void
  {
    let state = this.router.routerState.snapshot;
    if (this.lastUrl != state.url)
    {
      this.Track(state.url, "", 0);
      this.lastUrl = state.url;
    }
  }
}
