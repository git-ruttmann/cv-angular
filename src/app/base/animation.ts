import { 
    trigger, transition, style, query, state, animate, group
} from '@angular/animations';

const baseItemsQuerySelector = ".flyPathLine,.flyPathHead,.flyPathPoi,.clickArea";

export const routeAnimations = trigger("routeAnimations", [
    transition('login => base', [
        query(".bikebackground", [style({ left: "*" })]),   // dummy for safari: query any element from the SVG.
        query('.sizing', animate(700, style({ left : "100%" }))),
    ]),
    transition('base => content', [
        query('.overlay',  [ style({ opacity : 0, position: 'relative', transform: 'translateX(10%)' }) ]),

        group([
            query(baseItemsQuerySelector, [ animate(150, style({ opacity : 0 })) ]),
            query('.overlay',  [ animate(80, style({ opacity: 0.01 })), animate(250) ]),
        ]),
    ]),
    transition('content => base', [
        query('.overlay',  [ animate(150, style({ opacity : 0, position: 'relative', transform: 'translateX(10%)' })) ]),
    ]),
    transition('content => content', [
        style({ position: 'relative' }),
    ]),
]);
