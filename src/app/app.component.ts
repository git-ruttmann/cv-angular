import { Component } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  AnimationStyleMetadata,
  AnimationMetadata,
  keyframes,
} from '@angular/animations';
import { ɵAnimationStyleNormalizer } from '@angular/animations/browser';

const duration = 3400;
const strokeLength = 1600;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('flyPathHead', AppComponent.animateFlypath(style({strokeWidth : 11, offset:0.4}))),
    trigger('flyPathLine', AppComponent.animateFlypath(style({offset:0.4}))),
    trigger('poi1', AppComponent.animatePoi(0.35)),
    trigger('poi2', AppComponent.animatePoi(0.50)),
    trigger('poi3', AppComponent.animatePoi(0.62)),
    trigger('poi4', AppComponent.animatePoi(0.775)),
    trigger('poi5', AppComponent.animatePoi(0.84)),
  ]
})
export class AppComponent {
  title = 'karriere';
  isFlyPathVisible = false;
  isOpen = false;

  selectRegion(part: number)
  {
     console.log("click on" + part);
     if (part == 1) {
      var path = document.querySelector('.flypathAnimate path');
      this.isFlyPathVisible = true;
      console.log("len " + path);
     }
  }

  fun(what: number) {
    console.log("fun " + what);
    if (what == 2) {
      this.isOpen = false;
      this.isFlyPathVisible = false;
    }
    else if (what == 1) {
      this.isOpen = true;
    }
  }

  static animatePoi(delay: number) : AnimationMetadata [] {
    return [
      state("inactive", style({ fillOpacity: '0%' })),
      state("active", style({ fillOpacity: '10%' })),
      transition("inactive => active", [
        animate(duration, keyframes([
          style({ fillOpacity: '0%', offset : delay }),
          style({ fillOpacity: '100%', offset : delay + 0.05 }),
          style({ fillOpacity: '100%', offset : 0.99 })])),
        animate(duration * 0.3)
      ]),
      transition("active => inactive", animate(1))
    ];
  }

  static animateFlypath(emphasizeStyle : AnimationStyleMetadata) : AnimationMetadata [] {
    return [
      state("inactive", style({
        strokeDashoffset : strokeLength
      })),
      state("active", style({
        strokeDashoffset : 0
      })),
      transition("* => active",
        animate(duration, keyframes([
          style({strokeDashoffset: strokeLength * (1 - 0.27), offset: 0.22}),
          style({strokeDashoffset: strokeLength * (1 - 0.29), animationTimingFunction: 'ease-in-out', offset: 0.25}),
          emphasizeStyle,
          style({strokeDashoffset: strokeLength * (1 - 0.319), animationTimingFunction: 'ease-in-out', offset: 0.4}),
          style({strokeDashoffset: strokeLength * (1 - 0.36), strokeWidth: '*', offset: 0.5}),
          style({strokeDashoffset: strokeLength * (1 - 0.48), offset: 0.73}),
          style({strokeDashoffset: strokeLength * (1 - 0.60), offset: 0.81}),
          style({strokeDashoffset: strokeLength * (1 - 0.70), offset: 0.93}),
        ])),
      ),
      transition("active => inactive", [
        animate(1)
      ]),
    ];
  }
}
