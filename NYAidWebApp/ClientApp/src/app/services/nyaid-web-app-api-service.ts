import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inject } from '@angular/core';

import { RequestInfo } from '../models/request-info';

@Injectable({
    providedIn: 'root'
})

export class NyaidWebAppApiService {

  constructor(private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string) {
    }

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

  /**
   * Retrieve requests created by the given user
   *
   *  @return An `Observable` of an array of `RequestInfo` objects
   */
  getRequestsCreatedByUser(creatorUid: string): Observable<RequestInfo[]> {
    const url = this.baseUrl + 'api/request';
    return this.http.get<RequestInfo[]>(url, {
      params: {
        creatorUid: creatorUid
      }
    });
  }

  /**
   * Post request
   *
   * @param requestInfo - `RequestInfo` containing info for request
   *
   * @return An `Observable` of `RequestInfo` object.
   *
   */
  createRequest(requestInfo: RequestInfo): Observable<RequestInfo> {
    const url = this.baseUrl + 'api/request';
    return this.http.post<RequestInfo>(url, requestInfo);
  }

  /**
   * Put RequestInfo of a given requestId
   *
   * @param requestId - The ID of the request
   * @param requestInfo - `RequestInfo` object with new request info
   *
   * @return An `Observable` of `RequestInfo` object.
   *
   */
  updateRequest(requestId: string, requestInfo: RequestInfo): Observable<RequestInfo> {
    const url = this.baseUrl + 'api/request' + '/' + requestId;
    return this.http.put<RequestInfo>(url, requestInfo);
  }

  /**
   * Retrieve summary of a RequestInfo
   *
   * @param requestId - The ID of the request
   *
   *  @return An `Observable` of `RequestInfo` object
   */
  getRequest(requestId: string): Observable<RequestInfo> {
    const url = this.baseUrl + 'api/request' + '/' + requestId;
    return this.http.get<RequestInfo>(url);
  }

  /**
   * Delete Request for a given requestId
   *
   * @param requestId - The ID of the request
   *
   * @return An `Observable` of type void.
   *
   */
  deleteRequest(requestId: string): Observable<void> {
    const url = this.baseUrl + 'api/request' + '/' + requestId;
    return this.http.delete<void>(url);
  }

}
