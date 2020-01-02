import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {
  isAuthenticated = false;

  constructor()
  { 
  }

  public Authenticate(code: String) {
    console.log("Authenticating")
    this.isAuthenticated = true;

    return this.isAuthenticated;
  }

  public IsLoggedIn() : boolean {
    return this.isAuthenticated;
  }
}
