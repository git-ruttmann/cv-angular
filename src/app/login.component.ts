import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { AuthenticateService } from './authenticate.service';
import { Router } from '@angular/router';
import { isDevMode } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./app.component.css'],
})
export class LoginComponent implements OnInit {
  code: string = "";

  constructor(private authService : AuthenticateService, private router : Router) {
  }

  ngOnInit()
  {
  }

  public onLogin() 
  {
    if (isDevMode())
    {
      this.authService.Authenticate("abc")
    }

    if (this.authService.IsLoggedIn()) {
      this.router.navigate(["/authenticated"]);
    }
  }

  public checkCode()
  {
    if (this.authService.Authenticate(this.code)) {
      this.router.navigate(["/authenticated"]);
    }
  }
}
