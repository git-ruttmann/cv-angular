import { Component, OnInit } from '@angular/core';
import { AuthenticateService } from './authenticate.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  template: `
<div class="overlay login-container">
  <p>login works - fine!</p>
  <div class="xxbutton" (click)='onLogin()'>
      <p>Let's go</p>
  </div>
</div>`,
  styles: [`
.xxbutton
{
    width: 50px;
    height: 50px;
    position: relative;
}
`],
  styleUrls: ['./app.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authService : AuthenticateService, private router : Router) {
  }

  ngOnInit()
  {
  }

  public onLogin() 
  {
    this.authService.Authenticate("abc")
    if (this.authService.IsLoggedIn()) {
      this.router.navigate(["/authenticated"]);
    }
  }
}
