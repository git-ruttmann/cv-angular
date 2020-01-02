import { Component } from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import { baseAnimations } from './animation';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  animations: [ baseAnimations ],
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'karriere';
  isFlyPathVisible = false;
  isOpen = false;

  constructor(private router: Router)
  {
  }

  getAnimatedState(outlet: RouterOutlet) {
    var value = outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
    return value;
  }
}
