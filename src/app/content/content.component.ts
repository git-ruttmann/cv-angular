import { Component, ViewChild, ElementRef, HostListener, AfterViewInit, OnDestroy, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { animate, query, sequence, stagger, style, transition, trigger, group } from '@angular/animations';
import { Observable, fromEvent, asyncScheduler, Subscription } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

import { IVitaDataService, VitaDataServiceConfig } from '../services/vita-data.service';
import { VitaEntryViewModel, VitaEntryEnum } from '../vita-entry';
import { TrackingService, TrackingEventService, ITrackedItem } from '../services/tracking.service';
import { ThrottleConfig } from 'rxjs/internal/operators/throttle';
import { IActionItem, LocalizationTextService } from '../services/localization-text.service';
import { BaseStateService } from '../services/base-state.service';

const urlToVitaEntryEnum = {
  "person" : VitaEntryEnum.Person,
  "projects" : VitaEntryEnum.Project,
  "technologies" : VitaEntryEnum.Technology,
  "strength" : VitaEntryEnum.Strength,
  "interests" : VitaEntryEnum.Interest,
};

const topicAnimations = trigger('topicAnimation', [
  transition('* <=> *', [
    // step 1: change the color of the removed items, new items stay at 0 height
    group([
      query(':enter', [
        style({ height: '0px', opacity: 0, color: "#505050", overflow: 'hidden' }),
      ], { optional: true }),
      query(':leave', [
        animate(100, style({ color: '#505050' })),
      ], { optional: true }),
    ]),
    // step 2: new items expand and old items shrink in parallel
    group([
      query(':enter', [
        stagger(50, animate(100, style({ height: "*", opacity: 1, color: "#505050", 'margin-bottom': '0.115rem' }))),
        ], { optional: true }),
      query(':leave', [
        stagger(50, animate(100, style({ height: '0px', color: '#505050', opacity: 0 }))),
        ], { optional: true }),
      ]),
    // step 3: new items loose the temporary color
    query(':enter', [
      animate(50, style({ color: "*", background: '*' })),
    ], { optional: true }),
  ]) 
]);

const expandedStateAnimation = trigger('changeHeight', [
  transition('void <=> *', []),
  transition('* <=> *', [
    style({ height: '{{startHeight}}px', opacity: 1 }), 
    query(":enter", style({ color: "transparent" }), { optional: true }),
    group([
      sequence([
        animate(80, style({ background: "#ffffff10" })),
        group([
          query(":enter", animate(100, style({ color: "*" })), { optional: true }),
          animate(80, style({ background: "*" })),
          ]),
      ]),
      animate('0.2s ease', style({ height: "*" })),
    ])
  ], { params: { startHeight: 0 } })
]);

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css', '../app.component.css', './filter-button.css'],
  animations: [ topicAnimations, expandedStateAnimation ]
})
export class ContentComponent implements AfterViewInit, OnDestroy {
  public content = "Hello";
  entries: Observable<VitaEntryViewModel[]>;

  @ViewChild('textcontent', { static : true })
  contentElt: ElementRef;
  
  @ViewChild('textbackground', { static : true })
  backgroundElt: ElementRef;
  
  scrollSubscription$;
  touchSubscription$;
  vitaEntryType: VitaEntryEnum;
  public readonly actions: IActionItem[];
  
  constructor(
    @Inject(VitaDataServiceConfig) private dataService : IVitaDataService,
    private router : Router,
    public localizationService: LocalizationTextService,
    public baseStateService: BaseStateService,
    private trackingService: TrackingService,
    private trackingEventService: TrackingEventService)
  {
    this.content = router.url.substr(1).toLowerCase();
    this.entries = dataService.entries;
    this.actions = localizationService.DurationActions;
    
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
    this.contentElt.nativeElement.focus();
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
    if (event.repeat == true)
    {
      return;
    }

    this.NavigateToNextContent(-1);
  }

  @HostListener('document:keydown.ArrowRight', ['$event'])
  onKeydownHandlerRight(event: KeyboardEvent) {
    if (event.repeat == true)
    {
      return;
    }
    
    this.NavigateToNextContent(1);
  }

  public get TopicAnimationState() : string {
    return this.dataService.duration;
  }

  trackTopic(index: number, item: VitaEntryViewModel) : string{
    return item.title;
  }

  public get CurrentDetailLevel() : string 
  {
    return this.localizationService.DetailStateText(this.dataService.duration);
  }

  public isActiveFilter(action: IActionItem)
  {
    return this.dataService.duration == action.Duration;
  }

  public activateFilter(action: IActionItem)
  {
    return this.dataService.setDuration(action.Duration);
  }

  onSwipeRight(event, data) {
    this.NavigateToNextContent(-1);
  }

  onSwipeLeft(event, data) {
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
    this.contentElt.nativeElement.focus();

    let item = this.contentElt.nativeElement.querySelector("#id_" + elt);
    if (elt == 0) {
      this.backgroundElt.nativeElement.scrollTo({ top: 0, behavior: 'smooth' });
    }
    else {
      item.scrollIntoView({
        behavior: "smooth"
        });
    }

    let headerItem = item.querySelector("div.entry-header-text") as HTMLDivElement;
    this.trackingService.Track(this.content, headerItem.innerText, 0);
  }

  public expandItem(item: VitaEntryViewModel)
  {
    item.expanded = !item.expanded;
    this.trackingEventService.Track("expand");
  }
  
  private onContentScroll()
  {
    this.trackingEventService.Track("scroll");
  }

  private trackContent(reason: String): void
  {
    let scrollingElement = this.backgroundElt.nativeElement as HTMLElement;
    let topicElements = Array
      .from(this.contentElt.nativeElement.getElementsByClassName("entry-full"))
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
    this.router.navigate(["/" + nextUrl], { state: { direction: direction } });
  }

  private IsTopicVisible(topic: HTMLElement, scrollTopRef: number, scrollBottomRef: number) : Boolean
  {
    if (topic.offsetTop + topic.offsetHeight >= scrollTopRef)
    {
      let textEntry = topic.getElementsByClassName("entry-text")[0] as HTMLElement;
      if (textEntry && textEntry.offsetTop < scrollBottomRef)
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
      Topic: elt.getElementsByClassName("entry-header-text")[0].innerHTML,
      Start: visibleStart,
      End: visibleEnd      
    };
  }
}
