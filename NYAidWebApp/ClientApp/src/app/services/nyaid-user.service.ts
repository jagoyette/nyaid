import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { UserInfo } from '../models/user-info';


@Injectable({
  providedIn: 'root'
})
export class NyaidUserService {
  // The currentUser property is intended to be read-only
  // Read the property to get the currently logged in user.
  // If it is necessary to update the currentUser, call the
  // public method refreshUserInfo() instead of trying to
  // populate this property directly
  private _currentUser: UserInfo;
  get currentUser(): UserInfo {
    return this._currentUser;
  }

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {
    this.refreshUserInfo();
  }

  // Refresh the cuurentUser property
  // Call this function after logging in or logging out to refresh user info
  // The UserInfo object is returned as an Observable
  public refreshUserInfo(): Observable<UserInfo> {
    // Always reset currentUser
    this._currentUser = null;

    // Use the service method to get the Observable to return
    const userInfo = this.getUserInfo();

    // Subscribe and update our private instance of currentUser
    userInfo.subscribe(data => this._currentUser = data, error => this._currentUser = null);
    return userInfo;
  }

  // Retrieve info for logged in user from backend api service
  public getUserInfo(): Observable<UserInfo> {
    return this.http.get<UserInfo>(this.baseUrl + 'api/user');
  }
}
