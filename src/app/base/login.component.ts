import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, AfterContentInit } from '@angular/core';
import { AuthenticateService } from '../services/authenticate.service';
import { PRIMARY_OUTLET, Router } from '@angular/router';
import { isDevMode } from '@angular/core';
import { BaseStateService } from '../services/base-state.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../app.component.css'],
})
export class LoginComponent implements OnInit, AfterViewInit, AfterContentInit {
  code: string = "";
  codeReadonly: boolean = false;

  @ViewChild('loginpassword', { static : true })
  passwordInputElt: ElementRef;

  constructor(
    private authService : AuthenticateService, 
    private router : Router, 
    private baseStateService : BaseStateService) {
      authService.authenticateSuccess.subscribe(x => this.gotAuthentication(x))
  }
  ngAfterContentInit(): void
  {
    this.handleUrlParameters();
  }

  ngAfterViewInit(): void
  {
    this.handleMissingTextSecurity();
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

  public linkedin(event: Event)
  {
    window.location.href = this.authService.GenerateLinkedInOauthUrl();
    event.stopPropagation();
  }

  private handleMissingTextSecurity()
  {
    if (this.passwordInputElt.nativeElement.style.webkitTextSecurity == undefined)
    {
      this.passwordInputElt.nativeElement.type = "password";
    }
  }

  private handleUrlParameters()
  {
    let urlTree = this.router.parseUrl(this.router.routerState.snapshot.url);
    if (urlTree.queryParamMap.has("code"))
    {
      let segment = urlTree.root.children[PRIMARY_OUTLET].segments[0].path;
      if (segment == "oauthsuccess")
      {
        this.code = "---";
        this.authService.OAuthVerifyCode(urlTree.queryParamMap.get("code"));
      }
      else
      {
        this.code = urlTree.queryParamMap.get("code");
        setTimeout(() => this.checkCode(null), 500);
      }
    }
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
