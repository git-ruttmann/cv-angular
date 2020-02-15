import { Component, ViewChild, ElementRef, HostListener, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, fromEvent, asyncScheduler } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

import { VitaEntryService } from '../services/vita-entry.service';
import { VitaEntry, VitaEntryEnum } from '../vita-entry';
import { BaseStateService } from '../services/base-state.service';
import { TrackingService } from '../services/tracking.service';
import { ThrottleConfig } from 'rxjs/internal/operators/throttle';

const urlToVitaEntryEnum = {
  "person" : VitaEntryEnum.Person,
  "projects" : VitaEntryEnum.Project,
  "technologies" : VitaEntryEnum.Technology,
  "strength" : VitaEntryEnum.Strength,
  "interests" : VitaEntryEnum.Interest,
};

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css', '../app.component.css']
})
export class ContentComponent implements AfterViewInit {
  public content = "Hello";
  entries: Observable<VitaEntry[]>;

  @ViewChild('textcontent', { static : true })
  contentElt: ElementRef;

  @ViewChild('textbackground', { static : true })
  backgroundElt: ElementRef;

  constructor(
      private router : Router, 
      private dataService : VitaEntryService,
      private trackingService: TrackingService) {
    this.content = router.url.substr(1).toLowerCase();
    this.entries = dataService.entries;

    var vitaEntryType = urlToVitaEntryEnum[this.content];

    this.dataService.load(vitaEntryType);
  }

  ngAfterViewInit(): void
  {
    var scrollDebounceOptions : ThrottleConfig;
    scrollDebounceOptions = { leading: false, trailing: true };
    fromEvent(this.backgroundElt.nativeElement, 'scroll')
      .pipe(throttleTime(250, asyncScheduler, scrollDebounceOptions))
      .subscribe((x) => this.onContentScroll());
    fromEvent(this.backgroundElt.nativeElement, 'touchmove')
      .pipe(throttleTime(250, asyncScheduler, scrollDebounceOptions))
      .subscribe((x) => this.onContentScroll());
  }

  back() {
    this.router.navigate(["/"]);
  }

  catchClickOnContent(event : Event)
  {
    event.stopPropagation();
  }

  scrollTo(elt : number) {
    var item = this.contentElt.nativeElement.querySelector("#id_" + elt);
    item.scrollIntoView();
    this.trackingService.Track(this.content, "id_" + elt, 0);
  }
  
  onContentScroll()
  {
    let scrollingElement = this.backgroundElt.nativeElement as HTMLElement;
    let topicElements = Array
      .from(this.contentElt.nativeElement.getElementsByClassName("entry-header"))
      .map(x => <HTMLElement>x)

    if (topicElements.length == 0)
    {
      return;
    }

    let firstVisibleIndex = topicElements.findIndex(x => x.offsetTop - x.offsetHeight * 2 > scrollingElement.offsetTop + scrollingElement.scrollTop);
    console.log("firstVisibleIndex " + firstVisibleIndex);
    let activeTopicIndex = firstVisibleIndex <= 0 ? topicElements.length - 1 : firstVisibleIndex - 1;
    let activeElement = topicElements[activeTopicIndex];
    let contentElement = activeElement.nextSibling as HTMLElement;

    let begin = scrollingElement.offsetTop + scrollingElement.scrollTop - activeElement.offsetTop;
    let percent = 100.0 * begin / (contentElement.offsetHeight + activeElement.offsetHeight);

    this.trackingService.Track(this.content, activeElement.innerText, percent);
  }
}
