import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LocalStorageService } from 'angular-2-local-storage';

interface AuthenticateResponse
{
  customAnimation: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {
  private _authenticatedState = new BehaviorSubject<boolean>(this.IsAuthenticatedCookieAvailable());
  private _authenticateSuccess = new Subject<boolean>();
  private _customAnimation : string;

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService)
  { 
  }

  public get authenticatedState() : Observable<boolean> { 
    return this._authenticatedState.asObservable();
  }

  public get authenticateSuccess() : Observable<boolean> { 
    return this._authenticateSuccess.asObservable();
  }

  public get customAnimation() : string {
    return this._customAnimation;
  }

  public Authenticate(code: string) {
    let body = 'LoginCode=' + code;
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});

    this.http.post<AuthenticateResponse>("api/v1/authenticate", body, { headers: headers, observe: "response" })
      .subscribe(
        (response) => {
          this._customAnimation = response.body.customAnimation;
          this._authenticateSuccess.next(true);
          this._authenticatedState.next(true);
        },
        (err) => {});
  }

  public SetFirstLogon() : void
  {
    this.localStorageService.set("Introduction", "true");
  }

  public IsFirstLogon() : boolean
  {
    return this.localStorageService.get("Introduction") != "true";
  }

  public UnauthorizedResponseInDataLoad()
  {
    this._authenticatedState.next(false);
  }

  private IsAuthenticatedCookieAvailable() : boolean
  {
    if (document == null)
    {
      return false;
    }

    if (document.cookie && document.cookie.split(';').some(x => x.startsWith("VitaApiAuth")))
    {
      return true;
    }

    return false;
  }
}
