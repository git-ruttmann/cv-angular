import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BaseStateService {
  private _state : string = "initial";
  private timerHandle;
  private flashTimeout = 5000;
  private isFirstActivation = true;
  private isActive = true;

  constructor() { }

  public getstate() : string {
    return this._state;
  }

  public enterBase() {
    this._state = "initial";
    this.isFirstActivation = true;
    this.isActive = true;
  }

  public globalAnimationFinished()
  {
    console.log('global finished active: ' + this.isActive + ' first: ' + this.isFirstActivation);
    clearInterval(this.timerHandle);
    if (this.isActive == false) {
      return;
    }

    if (this.isFirstActivation) {
      this._state = "flyin";
      this.isFirstActivation = false;
    }
    else {
      this._state = "returned";
    }

    this.timerHandle = setInterval(() => this.timeout(), this.flashTimeout);
  }

  public returnToBase() {
    this.isActive = true;
    clearInterval(this.timerHandle);
    this.flashTimeout = 7000;
    this.timerHandle = setInterval(() => this.timeout(), this.flashTimeout);
  }

  public leaveBase() {
    clearInterval(this.timerHandle);
    this.isActive = false;
    this._state = "inactive";
  }

  private timeout()
  {
    if (this.isFirstActivation) {
      return;
    }

    if (this._state === "highlight1") {
      this._state = "highlight2";
    }
    else {
      this._state = "highlight1";
    }

    this.flashTimeout = this.flashTimeout + 2000;
    clearInterval(this.timerHandle);
    this.timerHandle = setInterval(() => this.timeout(), this.flashTimeout);
  }
}
