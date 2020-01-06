import { 
    trigger, transition, style, query, state, animate, group, AnimationStyleMetadata, keyframes, AnimationMetadata, AnimationKeyframesSequenceMetadata, AnimationAnimateMetadata, sequence
} from '@angular/animations';

const duration = 3400;
const strokeLength = 1600;
class AnimationStuff {
    public static flyPathKeyFrames(emphasizeStyle : AnimationStyleMetadata) : AnimationKeyframesSequenceMetadata {
        return keyframes([
              style({strokeDashoffset: strokeLength * (1 - 0.27), offset: 0.22}),
              style({strokeDashoffset: strokeLength * (1 - 0.29), animationTimingFunction: 'ease-in-out', offset: 0.25}),
              emphasizeStyle,
              style({strokeDashoffset: strokeLength * (1 - 0.319), animationTimingFunction: 'ease-in-out', offset: 0.4}),
              style({strokeDashoffset: strokeLength * (1 - 0.36), strokeWidth: '*', offset: 0.5}),
              style({strokeDashoffset: strokeLength * (1 - 0.48), offset: 0.73}),
              style({strokeDashoffset: strokeLength * (1 - 0.60), offset: 0.81}),
              style({strokeDashoffset: strokeLength * (1 - 0.70), offset: 0.93}),
              style({strokeDashoffset: strokeLength * (1 - 1.00), offset: 1.00}),
            ]);
      }

      public static animatePoi(delay: number) : AnimationAnimateMetadata[] {
        var totalDuration = duration * 1.3;
        var effectiveDelay = delay / 1.3;
        return [
            animate(totalDuration, keyframes([
              style({ opacity: 0, offset : effectiveDelay }),
              style({ opacity: 1, r: 25, offset : effectiveDelay + 0.1 }),
              style({ opacity: 1, r: 25, offset : effectiveDelay + 0.15 }),
              style({ opacity: 1, r: "*", offset : Math.min(effectiveDelay + 0.3, 0.999) }),
              style({ opacity: "*", offset : 1 })]))
          ];
    }
}

export const baseAnimations = trigger("routeAnimations", [
    state('login', style({
    })),
    state('base', style({
    })),
    state('content', style({
    })),
    transition('login => base', [
        style({ position: 'relative' }),
        query('.flyPathLine',  [ style({ strokeDashoffset: 1600 }) ]),
        query('.flyPathHead',  [ style({ strokeDashoffset: 1600 }) ]),
        query('[id^="poi"]', [ style({ opacity: 0 }) ]),

        query('.login-container', animate(200, style({ opacity : 0.0 }))),
        group([
            query('.flyPathLine',  [ 
                animate(duration, AnimationStuff.flyPathKeyFrames(style({ offset:0.4 }))) 
            ]),
            query('.flyPathHead',  [ 
                animate(duration, AnimationStuff.flyPathKeyFrames(style({ strokeWidth : 11, offset:0.4 }))) 
            ]),
            query('#poi1', AnimationStuff.animatePoi(0.365)),
            query('#poi2', AnimationStuff.animatePoi(0.56)),
            query('#poi3', AnimationStuff.animatePoi(0.68)),
            query('#poi4', AnimationStuff.animatePoi(0.835)),
            query('#poi5', AnimationStuff.animatePoi(0.915)),
        ]),
    ]),
    transition('base => content', [
        query('.overlay',  [ style({ opacity : 0, position: 'relative', transform: 'translateX(10%)' }) ]),

        group([
            query('.flyPathLine',  [ animate(150, style({ opacity : 0 })) ]),
            query('.flyPathHead',  [ animate(150, style({ opacity : 0 })) ]),
            query('[id^="poi"]',  [ animate(150, style({ opacity : 0 })) ]),
            query('[id^="aoi"]',  [ animate(150, style({ opacity : 0 })) ]),
            query('.overlay',  [ animate(80, style({ opacity: 0.01 })), animate(250) ]),
      ]),
    ]),
    transition('content => base', [
        group([
            query('.overlay',  [ animate(150, style({ opacity : 0, position: 'relative', transform: 'translateX(10%)' })) ]),
            query('[id^="poi"]',  [ 
                style({ opacity : 0 }), 
                animate(80, style({ opacity : 0 })), 
                animate(400, style({ opacity : 1 })),
                animate(50)
            ]),
            query('.flyPathLine, .flyPathHead',  [
                style({ opacity : 0 }),
                animate(80, style({ opacity : 0 })), 
                animate(200, style({ opacity : 0 })),
                animate(250)
            ]),
        ]),
    ]),
    transition('content => content', [
        style({ position: 'relative' }),
    ]),
]);
