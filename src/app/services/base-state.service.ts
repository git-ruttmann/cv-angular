import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class BaseStateService {
  private state : string = "initial";
  private nextState : string = "initial";
  private timerHandle;
  private flashTimeout = 5000;
  private isFirstActivation = true;

  constructor(private router : Router)
  {
    this.router.events.subscribe(x => this.RouteStateChanged());
  }

  public GetState() : string 
  {
    return this.state;
  }

  public FetchState()
  {
    if (this.state != this.nextState)
    {
      this.state = this.nextState;
      if (this.state == "flyin")
      {
        this.isFirstActivation = false;
      }
    }
  }

  public LoginSuccessfull()
  {
    this.state = "initial";
    this.isFirstActivation = true;
  }

  private RouteStateChanged(): void
  {
    let state = this.router.routerState.snapshot;
    let section = state.url.split('/', 2).concat("-")[1].toLowerCase();
    if (section == "-")
    {
      return;
    }
    
    if (section == "login")
    {
      this.isFirstActivation = true;
      this.nextState = "initial";
    }
    else if (section != "")
    {
      // left to a content view. Set the "old" state before FetchState to inactive
      this.nextState = "inactive";
      this.state = this.nextState;
      this.isFirstActivation = false;
    }
    else if (this.isFirstActivation)
    {
      this.nextState = "flyin";
    }
    else
    {
      this.nextState = "returned";
    }

    if (this.nextState != this.state)
    {
      clearInterval(this.timerHandle);
      if (this.nextState != "inactive")
      {
        this.timerHandle = setInterval(() => this.timeout(), this.flashTimeout);
        this.flashTimeout = 7000;
      }
    }
  }
  
  private timeout()
  {
    if (this.isFirstActivation) {
      return;
    }

    if (this.state === "highlight1") {
      this.state = "highlight2";
    }
    else {
      this.state = "highlight1";
    }

    this.flashTimeout = this.flashTimeout + 2000;
    clearInterval(this.timerHandle);
    this.timerHandle = setInterval(() => this.timeout(), this.flashTimeout);
  }
}
