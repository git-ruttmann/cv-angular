import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export class BackgroundViewportReport
{
  public Top: number;
  public Left: number;
  public Width: number;
  public Height: number;
}

@Injectable({
  providedIn: 'root'
})
export class BackgroundImageViewportService {
  private _viewportReports = new BehaviorSubject<BackgroundViewportReport>(new BackgroundViewportReport());

  constructor() { }

  get viewportReports() : Observable<BackgroundViewportReport> {
    return this._viewportReports.asObservable();
  }

  public PublishViewportReport(report: BackgroundViewportReport)
  {
    this._viewportReports.next(report);
  }
}
