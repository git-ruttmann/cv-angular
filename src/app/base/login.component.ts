import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { AuthenticateService } from '../services/authenticate.service';
import { Router } from '@angular/router';
import { isDevMode } from '@angular/core';
import { BaseStateService } from '../services/base-state.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../app.component.css'],
})
export class LoginComponent implements OnInit {
  code: string = "";
  codeReadonly: boolean = false;

  constructor(
    private authService : AuthenticateService, 
    private router : Router, 
    private baseStateService : BaseStateService) {
      authService.authenticateSuccess.subscribe(x => this.gotAuthentication(x))
  }

  ngOnInit()
  {
  }

  public quick()
  {
    if (isDevMode())
    {
      this.authService.Authenticate("xx");
    }
  }

  public checkCode(event: Event)
  {
    this.authService.Authenticate(this.code);
  }

  private gotAuthentication(isAuthenticated : boolean): void
  {
      // changing the input field to readonly will hide the keyboard on screen-only devices
      if (isAuthenticated)
      {
        this.codeReadonly = true;
        this.baseStateService.LoginSuccessfull(this.authService.customAnimation);

        setTimeout(() => { this.router.navigate(["/"]); }, 1);
      }
  }
}
