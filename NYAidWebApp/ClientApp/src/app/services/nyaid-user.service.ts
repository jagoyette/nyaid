import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { UserInfo } from '../models/user-info';

@Injectable({
  providedIn: 'root'
})
export class NyaidUserService {
  private _currentUser: UserInfo;

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {
    this.getUserInfo().subscribe(data => {
      this._currentUser = data;
    });
  }

  public get CurrentUser(): UserInfo {
    return this._currentUser;
  }

  public IsUserLoggedIn(): Boolean {
    return this._currentUser != null;
  }

  public getUserInfo(): Observable<UserInfo> {
    return this.http.get<UserInfo>(this.baseUrl + 'api/user');
  }

  public getUserAccessToken(): Observable<any> {
    return this.http.get('/.auth/me');
  }

  logout(): Observable<any> {
    return this.http.get('/.auth/me?post_logout_redirect_uri=/');
  }
}
