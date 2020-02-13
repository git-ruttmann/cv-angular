import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, RouterState, Router } from '@angular/router';
import { AuthenticateService } from './authenticate.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate 
{
  lastState: Boolean;

  constructor(
    private authenticateService : AuthenticateService, 
    private router: Router) 
  {
    this.lastState = false;
    authenticateService.authenticatedState.subscribe(x => this.UpdateState(x))
  }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean 
  {
    if (this.lastState)
    {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }

  private UpdateState(authenticatedState: boolean): void
  {
    if (this.lastState != authenticatedState)
    {
      this.lastState = authenticatedState;
      if (!authenticatedState)
      {
        this.router.navigate(['/login']);
      }
    }
  }
}
