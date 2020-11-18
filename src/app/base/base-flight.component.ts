import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, transition, query, animate, style, group, AnimationStyleMetadata, AnimationKeyframesSequenceMetadata, AnimationAnimateMetadata, keyframes, state, sequence, stagger, AnimationMetadata } from '@angular/animations';

import { BaseStateService } from '../services/base-state.service';
import { BackgroundImageViewportService, BackgroundViewportReport } from '../services/background-image-viewport.service';
import { AuthenticateService } from '../services/authenticate.service';
import { LocalizationTextService } from '../services/localization-text.service';
import { GooglePathStrings } from './GooglePathStrings';
import { WelcomePathStrings } from './WelcomePathStrings';

const duration = 4400;
const toiDuration = 800;
const hideDuration = 6000;
const strokeDuration = duration - 1000; // roughly factor 1.3
const strokeLength = 1600;

export class AnimationStuff {
  public static flyPathKeyFrames(emphasizeStyle : AnimationStyleMetadata) : AnimationKeyframesSequenceMetadata {
    return keyframes([
          style({strokeDashoffset: strokeLength * (1 - 0.275), offset: 0.22}),
          style({strokeDashoffset: strokeLength * (1 - 0.305), animationTimingFunction: 'ease-in-out', offset: 0.25}),
          emphasizeStyle,
          style({strokeDashoffset: strokeLength * (1 - 0.337), animationTimingFunction: 'ease-in-out', offset: 0.4}),
          style({strokeDashoffset: strokeLength * (1 - 0.367), strokeWidth: '*', offset: 0.5}),
          style({strokeDashoffset: strokeLength * (1 - 0.48), offset: 0.73}),
          style({strokeDashoffset: strokeLength * (1 - 0.60), offset: 0.81}),
          style({strokeDashoffset: strokeLength * (1 - 0.70), offset: 0.93}),
          style({strokeDashoffset: strokeLength * (1 - 1.00), offset: 1.00}),
        ]);
  }

  public static animateFlyinPoi(delay: number, fadeout: number = 0.35) : AnimationAnimateMetadata[] {
    return  [ animate(duration, keyframes([
      style({ opacity: 0, offset : delay }),
      style({ opacity: 1, r: "25px", offset : delay + 0.08 }),
      style({ opacity: 1, r: "25px", offset : delay + 0.12 }),
      style({ opacity: 1, r: "*", offset : delay + fadeout * 2 / 3 }),
      style({ opacity: 0.2, offset : delay + fadeout })]))
    ];
  }

  public static animateSinglePoi() : AnimationAnimateMetadata[] {
    return  [ animate(toiDuration, keyframes([
      style({ opacity: 1, r: "25px", offset : 0.20 }),
      style({ opacity: 1, r: "*", offset : 5 / 6 }),
      style({ opacity: "*", offset : 1 })]))
    ];
  }

  public static animateToi(delay: number, dx: number, dy: number) : AnimationAnimateMetadata[] {
    return  [ 
      animate(delay, style({ opacity: "*" })),
      animate(toiDuration, keyframes([
        style({ transform: 'translate(' + dx * 0 + 'px, ' + dy * 0 + 'px)', offset : 0 }),
        style({ transform: 'translate(' + dx * 20 + 'px, ' + dy * 20 + 'px)', offset : 0.20 }),
        style({ transform: 'translate(' + dx * 0 + 'px, ' + dy * 0 + 'px)', offset : 5 / 6 }),
    ]))];
  }

  public static hideTemporary() : AnimationAnimateMetadata[] {
    return  [ animate(hideDuration, keyframes([
      style({ opacity: "*", offset : 0 }),
      style({ opacity: 0, offset : 0.08 }),
      style({ opacity: 0, offset : 0.90 }),
      style({ opacity: "*", offset : 1 })]))
    ];
  }

  public static googleTextTransform() : AnimationMetadata[] {
    return  [ 
      // run the SVG animation
      query('#googletextcontainer', animate(2000, style({ }))),
      
      group([
        query('#googletextcontainer', animate(100, style({ }))),
        sequence([
          query('#googletextcontainer .googlewelcome, #googleletter-5', animate(200, style({ opacity: 0 }))),
        ]),
        query('#googleletter-1, #googleletter-2, #googleletter-3, #googleletter-4, #googleletter-6',
          stagger(80, animate(200, style({ fill: '#B8870B' })))),
      ]),

      query('#googletextcontainer', animate(150, style({ }))),
  
      group([
        query('.googleletter', stagger(90, animate(400, style({ transform: "*" })))),
      ])
    ];
  }

  public static welcomeTextTransform() : AnimationMetadata[] {
    return  [ 
      // run the SVG animation
      query('#welcometextcontainer', animate(1400, style({ }))),
      query('#welcomeletter-3', animate(200, style({ fill: "#FBBC05" }))),
      query('#welcometextcontainer', animate(400, style({ }))),
      
      query('#welcomeletter-2', style({ opacity: 0 })),
      query('#welcometextcontainer', animate(400, style({ }))),

      query('#welcomeletter-1, #welcomeletter-3, #welcomeletter-4, #welcomeletter-5, #welcomeletter-6',
        stagger(80, animate(200, style({ fill: '#B8870B' })))),

      query('#welcometextcontainer', animate(250, style({ }))),
  
      group([
        query('#welcomeletter-0', animate(200, style({ opacity: 0 }))),
        query('#welcomeletter-1, #welcomeletter-3, #welcomeletter-4, #welcomeletter-5, #welcomeletter-6',
          stagger(90, animate(400, style({ transform: "*" })))),
      ]),
    ];
  }
}

export const flyPathStates = trigger('flyPathState', [
  state('off', style({ strokeDashoffset: strokeLength, opacity: 0.8 })),
  state('on', style({ strokeDashoffset: 0, opacity: 0.0 }))
]);

export const baseStateAnimations = trigger('baseState', [
  transition('initial => flyinPath', [
    group([
      query('.poitext', style({ opacity: 0})),
      query('.flyPathPoi', style({ opacity: 0})),
      query('.whoamisub', style({ opacity : 0, position: 'relative', transform: 'translate(-20%, 0%)' })),
      query('.whoami', style({ opacity : 0.2, position: 'relative', transform: 'translateX(-30%)' })),
    ]),

    query('.whoami',  [ 
      animate(450, style({ opacity : 1, position: 'relative', transform: 'translate(-0.5rem, -0.5rem)' }))
    ]),
    query('.whoamisub',  [ 
      animate(450, style({ opacity : 1, position: 'relative', transform: 'translate(0%, 0%)' }))
    ]),
    group([
      query('.flyPathLine',  [ 
        style({ strokeDashoffset: strokeLength, opacity: 0.8 }),
        animate(strokeDuration, AnimationStuff.flyPathKeyFrames(style({ offset:0.4 }))),
        animate(duration - strokeDuration, style({ opacity : 0.0 })),
      ]),
      query('.flyPathHead',  [ 
        style({ strokeDashoffset: strokeLength, opacity: 1.0 }),
        animate(strokeDuration, AnimationStuff.flyPathKeyFrames(style({ strokeWidth : 11, offset:0.4 }))) 
      ]),
      query('#poi1', AnimationStuff.animateFlyinPoi(0.385)),
      query('#poi2', AnimationStuff.animateFlyinPoi(0.52)),
      query('#poi3', AnimationStuff.animateFlyinPoi(0.58)),
      query('#poi4', AnimationStuff.animateFlyinPoi(0.685, 0.3)),
      query('#poi5', AnimationStuff.animateFlyinPoi(0.715, 0.285)),
    ]),

    sequence([
      query('.flyPathHead', animate(800, style({ opacity: 0 }))),
      query('.flyPathPoi', animate(500, style({ opacity: 1 }))),
      query('.poitext', animate(500, style({ opacity: 1 }))),
    ])
  ]),
  transition('initial => flyinGoogle', [
    group([
      query('.poitext', style({ opacity: 0})),
      query('.flyPathPoi', style({ opacity: 0})),
      query('.whoamisub', style({ opacity : 0, position: 'relative', transform: 'translate(-10%, 0%)' })),
      query('.whoami', style({ opacity : 0, position: 'relative', transform: 'translateX(-10%)' })),
      query('#googletextcontainer', style({ transform: "translateX(-10%)", opacity: 0 })),
      query('.googleletter', style({ transform: "translate(0px, 0px)", opacity: 1 })),
    ]),

    query('.whoami', animate(450, style({ opacity : 1, position: 'relative', transform: 'translate(-0.5rem, -0.5rem)' }))),
    query('.whoamisub', animate(450, style({ opacity : 1, position: 'relative', transform: '*' }))),
    query('#googletextcontainer', animate(450, style({ transform: "*", opacity: "*" }))),

    sequence(AnimationStuff.googleTextTransform()),

    sequence([
      query('#googletextcontainer', animate(150, style({ }))),
      query('.googleletter', animate(150, style({ opacity: 0 }))),
      query('.flyPathPoi', animate(500, style({ opacity: 1 }))),
      query('.poitext', animate(500, style({ opacity: 1 }))),
    ])
  ]),
  transition('initial => flyin', [
    group([
      query('.poitext', style({ opacity: 0})),
      query('.flyPathPoi', style({ opacity: 0})),
      query('.whoamisub', style({ opacity : 0, position: 'relative', transform: 'translate(-10%, 0%)' })),
      query('.whoami', style({ opacity : 0, position: 'relative', transform: 'translateX(-10%)' })),
      query('#welcometextcontainer', style({ transform: "translateX(-5%)", opacity: 0 })),
      query('.welcomeletter', style({ transform: "translate(0px, 0px)", opacity: 1 })),
    ]),

    query('.whoami', animate(450, style({ opacity : 1, position: 'relative', transform: 'translate(-0.5rem, -0.5rem)' }))),
    query('.whoamisub', animate(450, style({ opacity : 1, position: 'relative', transform: '*' }))),
    query('#welcometextcontainer', animate("450ms ease-out", style({ transform: "*", opacity: "*" }))),

    sequence(AnimationStuff.welcomeTextTransform()),

    sequence([
      query('#welcometextcontainer', animate(150, style({ }))),
      query('.welcomeletter', animate(150, style({ opacity: 0 }))),
      query('.flyPathPoi', animate(500, style({ opacity: 1 }))),
      query('.poitext', animate(500, style({ opacity: 1 }))),
    ])
  ]),
  transition('inactive => returned', sequence([
    query('.flyPathPoi, .poitext', style({ opacity: 0 })),
    query('.flyPathPoi, .poitext', animate(700, style({ opacity: 0 }))),
    query('.flyPathPoi, .poitext', animate(900, style({ opacity: 1 }))),
  ])),
  transition('* => highlight1', group([
    query('#toi1', AnimationStuff.animateToi(0 * (toiDuration + 400), 1, -1)),
    query('#toi2', AnimationStuff.animateToi(1 * (toiDuration + 400), 0.15, -1.1)),
    query('#toi3', AnimationStuff.animateToi(2 * (toiDuration + 400), 0.5, 1)),
    query('#toi4', AnimationStuff.animateToi(3 * (toiDuration + 400), 0.15, 1.1)),
    query('#toi5', AnimationStuff.animateToi(4 * (toiDuration + 400), -1, -1)),
    query('.flyPathPoi', stagger((toiDuration + 400), AnimationStuff.animateSinglePoi()))
  ])),
  transition('* => highlight2', group([
    query('.flyPathPoi', stagger(200, AnimationStuff.hideTemporary())),
    query('.poitext', stagger(200, AnimationStuff.hideTemporary())),
  ])),
]);

@Component({
  selector: 'app-base-flight',
  templateUrl: './base-flight.component.html',
  styleUrls: [ '../app.component.css', './base-flight.component.css' ],
  animations : [ baseStateAnimations, flyPathStates ],
})
export class BaseFlightComponent implements AfterViewInit {
  isFlyPathVisible = false;
  isOpen = false;
  public GP: GooglePathStrings = new GooglePathStrings();
  public WP: WelcomePathStrings = new WelcomePathStrings();

  @ViewChild('backgroundoverlay', { static : true })
  backgroundOverlayElt: ElementRef;

  constructor(
      private router : Router,
      private baseStateService : BaseStateService,
      public localizationService : LocalizationTextService,
      private authenticateService : AuthenticateService,
      private backgroundImageViewportService : BackgroundImageViewportService) {
  }

  ngAfterViewInit(): void
  {
    this.backgroundImageViewportService.viewportReports.subscribe(x => this.ApplyBackgroundViewportToFlyPath(x));
    setTimeout(() => this.baseStateService.FetchState(), 0);
  }

  ApplyBackgroundViewportToFlyPath(report: BackgroundViewportReport)
  {
    this.backgroundOverlayElt.nativeElement.style.top = report.Top + "px";
    this.backgroundOverlayElt.nativeElement.style.left = report.Left + "px";
    this.backgroundOverlayElt.nativeElement.style.height = report.Height + "px";
    this.backgroundOverlayElt.nativeElement.style.width = report.Width + "px";

    setTimeout(() => {
      this.RePositionText(1, 90, -90, report);
      this.RePositionText(2, 10, -100, report);
      this.RePositionText(3, 30, 102, report);
      this.RePositionText(4, 20, 102, report);
      this.RePositionText(5, -90, -90, report);
      }, 10);
  }

  RePositionText(poiElementId: number, dx: number, dy: number, availableSize: BackgroundViewportReport)
  {
    let textElement = this.backgroundOverlayElt.nativeElement.parentElement.querySelector("#toi" + poiElementId);
    let refElement = this.backgroundOverlayElt.nativeElement.parentElement.querySelector("#poi" + poiElementId);
    let refRect : DOMRect = refElement.getBoundingClientRect();
    let contentRect : DOMRect = textElement.getBoundingClientRect();
    let screenRect : DOMRect = this.backgroundOverlayElt.nativeElement.parentElement.getBoundingClientRect();

    let availableWidth = screenRect.right;

    var xpos = 0;
    xpos = refRect.left 
      - (contentRect.width - refRect.width) / 2 
      + (contentRect.width + refRect.width) * (dx / 200);

    if (xpos + contentRect.width >= availableWidth - 5 && availableWidth > 0) {
      xpos = availableWidth - contentRect.width - 5;
    }

    if (xpos < 10) {
      xpos = 10;
    }

    var ypos = 0;
    ypos = refRect.top 
      - (contentRect.height - refRect.height) / 2 
      + (contentRect.height + refRect.height) * (dy / 200);

    if (ypos + contentRect.height > availableSize.Height) {
      ypos = availableSize.Height - contentRect.height;
    }

    if (ypos < 0) {
      ypos = 0;
    }

    textElement.style.left = xpos + "px";
    textElement.style.top = ypos + "px";
  }

  performantSelector(performantFilter: string, slowFilter: string) : string
  {
    if (this.localizationService.IsIos)
    {
      return slowFilter;
    }

    return performantFilter;
  }

  onClick(event) {
    var target = event.target || event.srcElement || event.currentTarget;
    var idAttr = target.attributes?.id ?? target.parentElement.attributes?.id;
    var value = idAttr?.nodeValue as String;

    if (value.startsWith("aoi") || value.startsWith("toi")) {
      let targetUrl = value.substr(3).toLowerCase();

      if (this.authenticateService.IsFirstLogon())
      {
        this.router.navigate(["/" + targetUrl]);
        this.authenticateService.SetFirstLogon();
      }
      else
      {
        this.router.navigate(["/" + targetUrl]);
      }
    }
  }

  getAnimationState() : string {
    return this.baseStateService.GetState();
  }

  getFlyPathState() : string {
    return this.baseStateService.GetState() == "initial" ? "off" : "on";
  }
}
