import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, RouterState, Router } from '@angular/router';
import { AuthenticateService } from './authenticate.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate 
{
  constructor(private authenticateService : AuthenticateService, private router: Router) 
  { 
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean 
  {
    if (this.authenticateService.IsLoggedIn()) {
      return true;
    }

    this.router.navigate(['/login'])
    return false;
  }
}
