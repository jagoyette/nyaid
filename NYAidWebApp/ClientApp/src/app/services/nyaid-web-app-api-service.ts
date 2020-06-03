import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inject } from '@angular/core';

import { RequestInfo } from '../models/request-info';
import { OfferInfo } from '../models/offer-info';
import { AcceptRejectOfferInfo } from '../models/acceptrejectoffer-info';
import { NewOfferInfo } from '../models/newoffer-info';
import { NoteInfo } from '../models/note-info';

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

/*
  Offers API's
 */

/**
   * Retrieve an array of all offers to fulfill the request identified by requestId
   *
   * @param requestId - The ID of the request
   *
   *  @return An `Observable` of an array of `OfferInfo` objects
   */
  getAllOffers(requestId: string): Observable<OfferInfo[]> {
    const url = this.baseUrl + 'api/request'+ '/' + requestId + '/' + 'offers';
    return this.http.get<OfferInfo[]>(url);
  }

/**
   * Retrieve offer to by requestId and offerId
   *
   * @param requestId - The ID of the request
   *
   * @param offerId - The ID of the offer
   *
   *  @return An `Observable` of `OfferInfo` object
   */
  getOffer(requestId: string, offerId: string): Observable<OfferInfo> {
    const url = this.baseUrl + 'api/request'+ '/' + requestId + '/' + 'offers' + '/' + offerId;
    return this.http.get<OfferInfo>(url);
  }

  /**
   * Post Offer. Creates a new offer to help
   *
   * @param offerInfo - `NewOfferInfo` containing info for Offer to help 
   *
   * @return An `Observable` of `OfferInfo` object.
   *
   */
  createOffer(requestId: string): Observable<NewOfferInfo> {
    const url = this.baseUrl + 'api/request'+ '/' + requestId + '/' + 'offers';
    return this.http.post<NewOfferInfo>(url, requestId);
  }

  /**
   * Post Offer. Changes the state of the Offer to accepted or rejected
   *
   * @param requestId - The ID of the request
   *
   * @param offerId - The ID of the offer
   *
   * @return An `Observable` of `OfferInfo` object.
   *
   */
  changeOfferState(requestId: string, offerId: string): Observable<AcceptRejectOfferInfo> {
    const url = this.baseUrl + 'api/request'+ '/' + requestId + '/' + 'offers' + '/' + offerId + '/' + 'accept';
    return this.http.post<AcceptRejectOfferInfo>(url, requestId);
  }

/**
   * Returns the notes associated with an offer as an array of Note objects
   *
   * @param requestId - The ID of the request
   *
   * @param offerId - The ID of the offer
   *
   *  @return An `Observable` of `NoteInfo` object
   */
  getNotes(requestId: string, offerId: string): Observable<NoteInfo> {
    const url = this.baseUrl + 'api/request'+ '/' + requestId + '/' + 'offers' + '/' + offerId + '/' + 'notes';
    return this.http.get<NoteInfo>(url);
  }

  /**
   * Post Note. Creates a new note associated with the offer to help. 
   *
   * @param requestId - The ID of the request
   *
   * @param offerId - The ID of the offer
   *
   * @return An `Observable` of `NoteInfo` object.
   *
   */
  createNote(requestId: string, offerId: string): Observable<NoteInfo> {
    const url = this.baseUrl + 'api/request'+ '/' + requestId + '/' + 'offers' + '/' + offerId + '/' + 'notes';
    return this.http.post<NoteInfo>(url, requestId);
  }

}
