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
    
    this.determineNextState(section);

    if (this.nextState != this.state)
    {
      this.updateTimerOnStateChange();
    }
  }

  private determineNextState(section: string)
  {
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
  }
  
  private updateTimerOnStateChange()
  {
    clearInterval(this.timerHandle);
    if (this.nextState != "inactive")
    {
      this.timerHandle = setInterval(() => this.timeout(), this.flashTimeout);
      if (this.nextState == "flyin")
      {
        this.flashTimeout = 7000;
      }
      else
      {
        this.flashTimeout = 10000;
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
    if (this.flashTimeout < 10000)
    {
      this.flashTimeout = 10000;
    }
    else if (this.flashTimeout > 20000)
    {
      this.flashTimeout = 20000;
    }

    clearInterval(this.timerHandle);
    this.timerHandle = setInterval(() => this.timeout(), this.flashTimeout);
  }
}
