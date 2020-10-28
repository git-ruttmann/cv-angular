import { 
    trigger, transition, style, query, state, animate, group
} from '@angular/animations';

const baseItemsQuerySelector = ".flyPathLine,.flyPathHead,.flyPathPoi,.clickArea,.poitext";

export const routeAnimations = trigger("routeAnimations", [
    transition('login => base', [
        query(".backgroundimage", [style({ left: "*" })]),   // dummy for safari: query any element from the SVG.
        group([
            query('.poitext', style({ opacity : 0 })),
            query('.whoami', style({ opacity : 0 })),
            query('.flyPathPoi', style({ opacity : 0 })),
        ]),
        query('.sizing', animate(700, style({ left : "100%" }))),
    ]),
    transition('base => content', [
        query('#contentoverlay',  [ style({ opacity : 0, position: 'relative', transform: 'translateX(10%)' }) ]),

        group([
            query('.whoami', animate(150, style({ opacity : 0 }))),
            query(baseItemsQuerySelector, [ animate(150, style({ opacity : 0 })) ]),
            query('#contentoverlay',  [ animate(80, style({ opacity: 0.01 })), animate(250) ]),
        ]),
    ]),
    transition('content => base, content2 => base, alltopicsloop => base', [
        query('.whoami, .flyPathPoi, .poitext', style({ opacity: 0 })),
        query('#contentoverlay',  [ animate(150, style({ opacity : 0, position: 'relative', transform: 'translateX(-10%)' })) ]),
        query('.whoami', animate(150, style({ opacity : "*" }))),
    ]),
    transition('alltopicsloop => alltopicsloop, content => alltopicsloop, content2 => alltopicsloop', [
        query(':enter #contentoverlay',  [ style({ opacity : 0.0 }) ]),
        query(':leave #loopoverlay',  [ style({ opacity : 0.9 }) ]),
        query(':leave #contentoverlay',  [ animate(250, style({ 
            opacity : 0, 
            position: 'relative', 
            transform: 'translateX(calc({{ animationDirection }} * -10%)) scaleZ(0.5)' })) ]),
        query(':leave #contentoverlay',  [ animate(400, style({ }))]),
        query(':enter #contentoverlay',  [
            style({ opacity : 0, position: 'relative', transform: 'translateX(calc({{ animationDirection }} * 10%))' }),
            animate(250),
        ]),
    ]),
    transition('content => content2, content2 => content, alltopicsloop => content, alltopicsloop => content2', [
        query(':enter #contentoverlay',  [ style({ opacity : 0.0 }) ]),
        query(':leave #contentoverlay',  [ animate(150, style({ opacity : 0.0, position: 'relative', transform: 'translateX(calc({{ animationDirection }} * -10%)' })) ]),
        query(':enter #contentoverlay',  [
            style({ opacity : 0.0, position: 'relative', transform: 'translateX(calc({{ animationDirection }} * 10%)' }),
            animate(250),
        ]),
    ]),
]);
