import { Component, ViewChild, ElementRef, HostListener, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, fromEvent, asyncScheduler, Subscription } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

import { VitaEntryService } from '../services/vita-entry.service';
import { VitaEntry, VitaEntryEnum } from '../vita-entry';
import { BaseStateService } from '../services/base-state.service';
import { TrackingService, TrackingEventService, ITrackedItem } from '../services/tracking.service';
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
export class ContentComponent implements AfterViewInit, OnDestroy {
  public content = "Hello";
  entries: Observable<VitaEntry[]>;

  @ViewChild('textcontent', { static : true })
  contentElt: ElementRef;
  
  @ViewChild('textbackground', { static : true })
  backgroundElt: ElementRef;
  
  scrollSubscription$;
  touchSubscription$;
  vitaEntryType: any;
  
  constructor(
    private router : Router, 
    private dataService : VitaEntryService,
    private trackingService: TrackingService,
    private trackingEventService: TrackingEventService)
  {
    this.content = router.url.substr(1).toLowerCase();
    this.entries = dataService.entries;
    
    this.trackingEventService.trackingEvent.subscribe(x => this.trackContent(x));
    var vitaEntryType = urlToVitaEntryEnum[this.content];
    
    this.dataService.load(vitaEntryType);
  }
  
  ngAfterViewInit(): void
  {
    var scrollDebounceOptions : ThrottleConfig;
    scrollDebounceOptions = { leading: false, trailing: true };
    this.scrollSubscription$ = fromEvent(this.backgroundElt.nativeElement, 'scroll')
      .pipe(throttleTime(250, asyncScheduler, scrollDebounceOptions))
      .subscribe((x) => this.onContentScroll());
    this.touchSubscription$ = fromEvent(this.backgroundElt.nativeElement, 'touchmove')
      .pipe(throttleTime(250, asyncScheduler, scrollDebounceOptions))
      .subscribe((x) => this.onContentScroll());
    this.trackingEventService.Track("init");
  }

  ngOnDestroy(): void
  {
    this.scrollSubscription$.unsubscribe();
    this.touchSubscription$.unsubscribe();
  }

  @HostListener('document:keydown.escape', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    this.back();
  }

  @HostListener('document:keydown.ArrowLeft', ['$event'])
  onKeydownHandlerLeft(event: KeyboardEvent) {
    this.NavigateToNextContent(-1);
  }

  @HostListener('document:keydown.ArrowRight', ['$event'])
  onKeydownHandlerRight(event: KeyboardEvent) {
    this.NavigateToNextContent(1);
  }

  back() {
    this.router.navigate(["/"]);
  }

  catchClickOnContent(event : Event)
  {
    event.stopPropagation();
  }

  scrollTo(elt : number)
  {
    let item = this.contentElt.nativeElement.querySelector("#id_" + elt);
    item.scrollIntoView();

    let headerItem = item.querySelector("div.entry-header") as HTMLDivElement;
    this.trackingService.Track(this.content, headerItem.innerText, 0);
  }
  
  private onContentScroll()
  {
    this.trackingEventService.Track("scroll");
  }

  private trackContent(reason: String): void
  {
    let scrollingElement = this.backgroundElt.nativeElement as HTMLElement;
    let topicElements = Array
      .from(this.contentElt.nativeElement.getElementsByClassName("entrycontent"))
      .map(x => <HTMLElement>x)

    let scrollTopRef = scrollingElement.scrollTop + scrollingElement.offsetTop;
    let scrollBottomRef = scrollTopRef + scrollingElement.offsetHeight;

    let filteredElements = topicElements
      .filter(x => this.IsTopicVisible(x, scrollTopRef, scrollBottomRef))
      .map(x => this.TrackEntryFromElement(x, scrollTopRef, scrollBottomRef));

    if (filteredElements.length == 0)
    {
      // no idea, why the unsubscribe is not working.
      return;
    }

    this.trackingService.TrackTopics(this.content, filteredElements);
  }

  private NavigateToNextContent(direction: number)
  {
    let keys = Object.keys(urlToVitaEntryEnum);
    let activeIndex = keys.indexOf(this.content);
    let nextIndex = activeIndex + direction;
    if (nextIndex < 0)
    {
      nextIndex = keys.length - 1;
    }
    else if (nextIndex >= keys.length)
    {
      nextIndex = 0;
    }
    let nextUrl = keys[nextIndex];
    this.router.navigate(["/" + nextUrl]);
  }

  private IsTopicVisible(topic: HTMLElement, scrollTopRef: number, scrollBottomRef: number) : Boolean
  {
    if (topic.offsetTop + topic.offsetHeight >= scrollTopRef)
    {
      let textEntry = topic.getElementsByClassName("entry-text")[0] as HTMLElement;
      if (textEntry.offsetTop < scrollBottomRef)
      {
        return true;
      }
    }

    return false;
  }

  private TrackEntryFromElement(elt: HTMLElement, scrollTop: number, scrollBottom: number) : ITrackedItem
  {
    let visibleStart = elt.offsetTop > scrollTop
      ? 0
      : (1.0 * scrollTop - elt.offsetTop) / elt.offsetHeight;
    let visibleEnd = elt.offsetTop + elt.offsetHeight <= scrollBottom
      ? 1
      : 1 - (1.0 * elt.offsetTop + elt.offsetHeight - scrollBottom) / elt.offsetHeight;

    return { 
      Topic: elt.getElementsByClassName("entry-header")[0].innerHTML,
      Start: visibleStart,
      End: visibleEnd      
    };
  }
}
