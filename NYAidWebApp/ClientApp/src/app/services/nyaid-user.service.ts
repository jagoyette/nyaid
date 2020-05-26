import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { UserInfo } from '../models/user-info';

@Injectable({
  providedIn: 'root'
})
export class NyaidUserService {

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {}

  // Retrieve info for logged in user from backend api service
  public getUserInfo(): Observable<UserInfo> {
    return this.http.get<UserInfo>(this.baseUrl + 'api/user');
  }
}
