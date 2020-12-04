import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LocalStorageService } from 'angular-2-local-storage';

interface AuthenticateResponse
{
  customAnimation: string;
}

const linkedInCredentials = {
  clientId: "77zjbht1t8piga",
  redirectUrl: "https%3A%2F%2Fcv.ruttmann.name%2Foauthsuccess",
  scope: "r_liteprofile"
};

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {
  private _authenticatedState = new BehaviorSubject<boolean>(this.IsAuthenticatedCookieAvailable());
  private _authenticateSuccess = new Subject<boolean>();
  private _customAnimation : string;
  private _sessionId : string;

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService)
  {
    this._sessionId = Math.random().toString(20).substr(2, length);
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

  public GenerateLinkedInOauthUrl(): string
  {
    return `https://www.linkedin.com/uas/oauth2/authorization?response_type=code&client_id=${
        linkedInCredentials.clientId
      }&redirect_uri=${
        linkedInCredentials.redirectUrl
      }&scope=${
        linkedInCredentials.scope
      }&state=${
        this._sessionId
      }`;
  }

  public OAuthVerifyCode(code: string): void
  {
    let body = {
      OAuthCode: code
    };

    let headers = new HttpHeaders({'Content-Type': 'application/json'});

    this.http.post<AuthenticateResponse>("api/v1/authenticate/oauth", body, { headers: headers, observe: "response" })
      .subscribe(
        (response) => {
          this._customAnimation = response.body.customAnimation;
          this._authenticateSuccess.next(true);
          this._authenticatedState.next(true);
        },
        (err) => {});
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
