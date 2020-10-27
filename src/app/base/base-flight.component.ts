import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, transition, query, animate, style, group, AnimationStyleMetadata, AnimationKeyframesSequenceMetadata, AnimationAnimateMetadata, keyframes, state } from '@angular/animations';

import { BaseStateService } from '../services/base-state.service';
import { BackgroundImageViewportService, BackgroundViewportReport } from '../services/background-image-viewport.service';
import { AuthenticateService } from '../services/authenticate.service';
import { async } from '@angular/core/testing';

const duration = 4400;
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

  public static animatePoi(delay: number, fadeout: number = 0.35) : AnimationAnimateMetadata[] {
    return  [ animate(duration, keyframes([
      style({ opacity: 0, offset : delay }),
      style({ opacity: 1, r: 25, offset : delay + 0.08 }),
      style({ opacity: 1, r: 25, offset : delay + 0.12 }),
      style({ opacity: 1, r: "*", offset : delay + fadeout * 2 / 3 }),
      style({ opacity: "*", offset : delay + fadeout })]))
    ];
  }

  public static animateToi(delay: number, fadeout: number = 0.35) : AnimationAnimateMetadata[] {
    return  [ animate(duration, keyframes([
      style({ opacity: 0, offset : delay }),
      style({ opacity: 0.3, offset : delay + 0.05 }),
      style({ opacity: 1, offset : delay + fadeout * 2 / 3 }),
      style({ opacity: "*", offset : delay + fadeout })]))
    ];
  }

  public static animatePoiTogether() : AnimationAnimateMetadata[] {
    return [
        animate(duration, keyframes([
          style({ opacity: 0, offset : 0 }),
          style({ opacity: 1, offset : 0.2 }),
          style({ opacity: 1, offset : 0.4 }),
          style({ opacity: "*", offset : 1 })]))
      ];
  }
}

export const flyPathStates = trigger('flyPathState', [
  state('off', style({ strokeDashoffset: strokeLength, opacity: 0.8 })),
  state('on', style({ strokeDashoffset: 0, opacity: 0.0 }))
]);

export const baseStateAnimations = trigger('baseState', [
  transition('initial => flyin', [
    query('.poitext', style({ opacity: 0})),
    query('.flyPathPoi', style({ opacity: 0})),
    query('.whoamisub', style({ opacity : 0, position: 'relative', transform: 'translate(-20%, 0%)' })),
    query('.whoami',  [ 
      style({ opacity : 0.2, position: 'relative', transform: 'translateX(-30%)' }),
      animate(400, style({ opacity : 1, position: 'relative', transform: 'translate(-0.5rem, -0.5rem)' }))
    ]),
    query('.whoamisub',  [ 
      animate(400, style({ opacity : 1, position: 'relative', transform: 'translate(0%, 0%)' }))
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
      query('#poi1', AnimationStuff.animatePoi(0.385)),
      query('#poi2', AnimationStuff.animatePoi(0.52)),
      query('#poi3', AnimationStuff.animatePoi(0.58)),
      query('#poi4', AnimationStuff.animatePoi(0.685, 0.3)),
      query('#poi5', AnimationStuff.animatePoi(0.715, 0.285)),
      query(".poitext", [
        style({ opacity: 0 }),
        animate(duration - 300, style({ opacity: 0 })),
      ]),
    ]),
  ]),
  transition('inactive => returned', group([
    query('.poi5', AnimationStuff.animatePoi(0.20, 0.5)),
    query('.poi4', AnimationStuff.animatePoi(0.30, 0.5)),
    query('.poi3', AnimationStuff.animatePoi(0.40, 0.5)),
    query('.poi2', AnimationStuff.animatePoi(0.50, 0.45)),
    query('.poi1', AnimationStuff.animatePoi(0.60, 0.4)),
  ])),
  transition('* => highlight1', group([
    query('.flyPathPoi', AnimationStuff.animatePoiTogether()),
    query('.poitext', AnimationStuff.animatePoiTogether()),
  ])),
  transition('* => highlight2', group([
    query('.flyPathLine',  [ 
      animate(duration / 6, style({ opacity : 0.8 })),
      animate(duration / 2, style({ opacity : 0.8 })),
      animate(duration / 3, style({ opacity : '*' })),
    ]),
    query('.poi1', AnimationStuff.animatePoi(0.00, 0.6)),
    query('.poi2', AnimationStuff.animatePoi(0.10, 0.6)),
    query('.poi3', AnimationStuff.animatePoi(0.20, 0.6)),
    query('.poi4', AnimationStuff.animatePoi(0.30, 0.6)),
    query('.poi5', AnimationStuff.animatePoi(0.40, 0.6)),
  ])),
]);

@Component({
  selector: 'app-base-flight',
  templateUrl: './base-flight.component.html',
  styleUrls: [ '../app.component.css' ],
  animations : [ baseStateAnimations, flyPathStates ],
})
export class BaseFlightComponent implements AfterViewInit {
  isFlyPathVisible = false;
  isOpen = false;

  @ViewChild('backgroundoverlay', { static : true })
  backgroundOverlayElt: ElementRef;

  constructor(
      private router : Router,
      private baseStateService : BaseStateService,
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

    this.RePositionText("#toiPerson", 1, 20, 0, false);
    this.RePositionText("#toiProjects", 2, 10, 10, false);
    this.RePositionText("#toiTechnologies", 3, -120, -60, false);
    this.RePositionText("#toiStrength", 4, -110, 80, false);
    this.RePositionText("#toiInterests", 5, -150, -10, true);
  }

  RePositionText(textElementId: string, poiElementId: number, dx: number, dy: number, bottomRef: boolean)
  {
    let textElement = this.backgroundOverlayElt.nativeElement.parentElement.querySelector(textElementId);
    let refElement = this.backgroundOverlayElt.nativeElement.parentElement.querySelector(".poi" + poiElementId);
    let refRect : DOMRect = refElement.getBoundingClientRect();

    if (bottomRef) 
    {
      dy = dy - textElement.getBoundingClientRect().height;
    }

    var y = refRect.top + dy;
    if (y < 10) {
      y = 10;
    }

    textElement.style.left = (refRect.left + refRect.width + dx) + "px";
    textElement.style.top = y + "px";
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
