import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inject } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class NyaidWebAppApiService {

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string,) { }

  /**
   * API Methods
   */

  /**
   * Retrieve summary of all requests
   *
   *  @return An `Observable` of an array of `RequestInfo` objects
   */
  getAllRequests(): Observable<RequestInfo[]> {
    const url = this.baseUrl + 'api/request';
    return this.http.get<RequestInfo[]>(url);
  }  
}
