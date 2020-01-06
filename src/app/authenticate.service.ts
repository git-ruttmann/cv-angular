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
    if (code.trim() === "xx") {
      this.isAuthenticated = true;
    }
    else {
      return false;
    }

    return this.isAuthenticated;
  }

  public IsLoggedIn() : boolean {
    return this.isAuthenticated;
  }
}
