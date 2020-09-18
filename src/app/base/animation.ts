import { 
    trigger, transition, style, query, state, animate, group
} from '@angular/animations';

const baseItemsQuerySelector = ".flyPathLine,.flyPathHead,.flyPathPoi,.clickArea";

export const routeAnimations = trigger("routeAnimations", [
    transition('login => base', [
        query(".backgroundimage", [style({ left: "*" })]),   // dummy for safari: query any element from the SVG.
        query('.sizing', animate(700, style({ left : "100%" }))),
    ]),
    transition('base => content', [
        query('#contentoverlay',  [ style({ opacity : 0, position: 'relative', transform: 'translateX(10%)' }) ]),

        group([
            query(baseItemsQuerySelector, [ animate(150, style({ opacity : 0 })) ]),
            query('#contentoverlay',  [ animate(80, style({ opacity: 0.01 })), animate(250) ]),
        ]),
    ]),
    transition('content => base, content2 => base', [
        query('#contentoverlay',  [ animate(150, style({ opacity : 0, position: 'relative', transform: 'translateX(-10%)' })) ]),
    ]),
    transition('base => introduction', [
        query('#welcomeoverlay',  [ style({ opacity : 0, position: 'relative', transform: 'translateX(10%)' }) ]),

        group([
            query(baseItemsQuerySelector, [ animate(150, style({ opacity : 0 })) ]),
            query('#welcomeoverlay',  [ animate(80, style({ opacity: 0.01 })), animate(250) ]),
        ]),
    ]),
    transition('introduction => base', [
        query('#welcomeoverlay',  [ animate(150, style({ opacity : 0, position: 'relative', transform: 'translateX(-10%)' })) ]),
    ]),
    transition('introduction => content', [
        query('#contentoverlay',  [ style({ opacity : 0, position: 'relative', transform: 'translateX(10%)' }) ]),
        query('#welcomeoverlay',  [ animate(250, style({ opacity : 0, position: 'relative', transform: 'translateX(-10%)' })) ]),
        query('#contentoverlay',  [ 
            style({ opacity : 0, position: 'relative', transform: 'translateX(10%)' }),
            animate(250),
        ]),
    ]),
    transition('content => content2, content2 => content', [
        query(':enter #contentoverlay',  [ style({ opacity : 0.0, position: 'relative', transform: 'translateX(10%)' }) ]),
        query(':leave #contentoverlay',  [ animate(150, style({ opacity : 0.0, position: 'relative', transform: 'translateX(-10%)' })) ]),
        query(':enter #contentoverlay',  [
            style({ opacity : 0.0, position: 'relative', transform: 'translateX(10%)' }),
            animate(250),
        ]),
    ]),
]);
