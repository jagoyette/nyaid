import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { UserInfo } from '../models/user-info';

@Injectable({
  providedIn: 'root'
})
export class NyaidUserService {
  public currentUser: UserInfo;

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {
    this.refreshUserInfo();
  }

  // Refresh the cuurentUser property
  // Call this function after logging in or logging out to refresh user info
  public refreshUserInfo(): void {
    this.currentUser = null;
    this.getUserInfo().subscribe(data => this.currentUser = data, error => this.currentUser = null);
  }

  // Retrieve info for logged in user from backend api service
  public getUserInfo(): Observable<UserInfo> {
    return this.http.get<UserInfo>(this.baseUrl + 'api/user');
  }
}
