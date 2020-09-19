import { Component, HostListener, ViewChild, ElementRef, DoCheck, AfterViewInit } from '@angular/core';
import { Router, RouterOutlet} from '@angular/router';
import { routeAnimations } from './base/animation';
import { BaseStateService } from './services/base-state.service';
import { BackgroundViewportReport, BackgroundImageViewportService } from './services/background-image-viewport.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  animations: [ routeAnimations ],
  styleUrls: ['./app.component.css']
})
export class AppComponent implements DoCheck, AfterViewInit {
  title = 'karriere';
  activeUrl = '';
  animationState: string;
  animationDirection: number;

  isFlyPathVisible = false;
  isOpen = false;
  private lastViewportReport: BackgroundViewportReport;

  @ViewChild('globalbackgroundimage', { static : true })
  backgroundImageElt: ElementRef;

  constructor(
    private baseStateService : BaseStateService,
    private router : Router,
    private backgroundImageViewportService : BackgroundImageViewportService)
  {
    router.events.subscribe(x => this.RouteStateChanged());
    this.animationDirection = 1;
  }

  ngAfterViewInit(): void
  {
    setTimeout(() => this.PublishBackgroundViewport(), 0);
    setTimeout(() => this.PublishBackgroundViewport(), 150);
    setTimeout(() => this.PublishBackgroundViewport(), 350);
  }

  ngDoCheck(): void
  {
    this.PublishBackgroundViewport();
  }

  getAnimatedState(outlet: RouterOutlet) {
    // var value = outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
    return this.animationState;
  }

  private RouteStateChanged(): void
  {
    const snapshot = this.router.routerState.snapshot;
    var newAnimationState = snapshot.root.children[0]?.data['animation'] ?? 'none';
    if (this.activeUrl != snapshot.url) {
      this.activeUrl = snapshot.url;
      const state = this.router.getCurrentNavigation()?.extras.state;
      this.animationDirection = state?.direction ?? 1;

      if (this.animationState == "content" && newAnimationState == "content") {
        newAnimationState = "content2";
      }

      this.animationState = newAnimationState;
    }
  }
  
  @HostListener('window:resize', ['$event'])
  onResize(event)
  {
    this.PublishBackgroundViewport();
  }

  private PublishBackgroundViewport()
  {
    if (this.backgroundImageElt && this.backgroundImageElt.nativeElement)
    {
      if (this.lastViewportReport == null
        || this.lastViewportReport.Height != this.backgroundImageElt.nativeElement.offsetHeight
        || this.lastViewportReport.Width != this.backgroundImageElt.nativeElement.offsetWidth
        || this.lastViewportReport.Top != this.backgroundImageElt.nativeElement.offsetTop
        || this.lastViewportReport.Left != this.backgroundImageElt.nativeElement.offsetLeft)
      {
        let viewportReport = new BackgroundViewportReport();
        viewportReport.Height = this.backgroundImageElt.nativeElement.offsetHeight;
        viewportReport.Width = this.backgroundImageElt.nativeElement.offsetWidth;
        viewportReport.Top = this.backgroundImageElt.nativeElement.offsetTop;
        viewportReport.Left = this.backgroundImageElt.nativeElement.offsetLeft;
  
        this.lastViewportReport = viewportReport;
        this.backgroundImageViewportService.PublishViewportReport(viewportReport);
      }
    }
  }
}
