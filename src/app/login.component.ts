import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { AuthenticateService } from './authenticate.service';
import { Router } from '@angular/router';
import { isDevMode } from '@angular/core';
import { BaseStateService } from './base-state.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./app.component.css'],
})
export class LoginComponent implements OnInit {
  code: string = "";
  codeReadonly: boolean = false;

  constructor(
    private authService : AuthenticateService, 
    private router : Router, 
    private baseStateService : BaseStateService) {
  }

  ngOnInit()
  {
  }

  public quick()
  {
    if (isDevMode())
    {
      this.authService.Authenticate("xx")
      this.baseStateService.enterBase();
      this.router.navigate(["/authenticated"]);
    }
  }

  public checkCode(event: Event)
  {
    if (this.authService.Authenticate(this.code)) {
      this.codeReadonly = true;
      this.baseStateService.enterBase();

      setTimeout(() => { this.router.navigate(["/authenticated"]); }, 1);
    }
  }
}
