import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inject } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class NyaidWebAppApiService {

  constructor(private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string,) {
    }

    private requestData: RequestInfo;

    setData(requestData: RequestInfo){
      this.requestData = requestData;
    }
  
    getData(): any {
      let temp = this.requestData;
      this.clearData();
      return temp;
    }
  
    clearData(){
      this.requestData = undefined;
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
   * Post request
   *
   * @param requestInfo - `Request` containing info for request
   *
   * @return An `Observable` of `Request` object.
   *
   */
  createRequest(requestInfo: Request): Observable<Request> {
    const url = this.baseUrl + 'api/request';
    return this.http.post<Request>(url, requestInfo);
  }

  /**
   * Put Request information of a given requestId
   *
   * @param requestId - The ID of the request
   * @param requestInfo - `Request` object with new request info
   *
   * @return An `Observable` of `Request` object.
   *
   */
  updateRequest(requestId: string, requestInfo: Request): Observable<Request> {
    const url = this.baseUrl + 'api/request' + '/' + requestId;
    return this.http.put<Request>(url, requestInfo);
  }

  /**
   * Retrieve summary of a request
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
