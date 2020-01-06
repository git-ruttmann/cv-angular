import { Component } from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import { routeAnimations } from './animation';
import { BaseStateService } from './base-state.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  animations: [ routeAnimations ],
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'karriere';
  isFlyPathVisible = false;
  isOpen = false;

  constructor(private baseStateService : BaseStateService)
  {
  }

  getAnimatedState(outlet: RouterOutlet) {
    var value = outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
    return value;
  }

  onAnimationDone() {
    this.baseStateService.globalAnimationFinished();
  }
}
