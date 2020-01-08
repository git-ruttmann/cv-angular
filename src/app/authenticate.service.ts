import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {
  isAuthenticated = false;
  private _activeCode = new Subject<string>();

  constructor(private http: HttpClient)
  { 
  }

  public get activeCode() : Observable<string> { 
    return this._activeCode.asObservable();
  }

  public Authenticate(code: string) {
    let body = 'LoginCode=' + code;
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});

    this.http.post("api/v1/authenticate", body, { headers: headers, observe: "response" })
      .subscribe(
        (response) => { 
          this.isAuthenticated = true;
          this._activeCode.next(code);
        },
        (err) => {});
  }

  public IsLoggedIn() : boolean {
    return this.isAuthenticated;
  }
}
