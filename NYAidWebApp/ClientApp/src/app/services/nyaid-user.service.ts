import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { UserInfo, UserDetails } from '../models/user-info';

@Injectable({
  providedIn: 'root'
})
export class NyaidUserService {

  private readonly ClaimsTypeName = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name';
  private readonly ClaimsTypeNameAlt = 'name';
  private readonly ClaimsTypeNameIdentifier = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier';
  private readonly ClaimsTypeEmailAddress = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress';
  private readonly ClaimsTypeGivenName = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname';
  private readonly ClaimsTypeSurname = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname';

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {}

  // Retrieve basic user info from backend api service
  public getUserInfo(): Observable<UserInfo> {
    return this.http.get<UserInfo>(this.baseUrl + 'api/user');
  }

  // Retrieve extended info, including access token, from
  // EasyAuth. Note that this will only succeed when run
  // from the Azure cloud.
  public getUserDetails(): Observable<UserDetails> {
    return this.http.get('/.auth/me').pipe(
      map(data => {
        // The result is an array, pull the 1st element
        const info = data[0];
        const claims = info['user_claims'];
        return {
          id: this.extractClaim(claims, this.ClaimsTypeNameIdentifier),
          name: this.extractClaim(claims, this.ClaimsTypeName) ||
                this.extractClaim(claims, this.ClaimsTypeNameAlt),
          surname: this.extractClaim(claims, this.ClaimsTypeSurname),
          givenname: this.extractClaim(claims, this.ClaimsTypeGivenName),
          email: this.extractClaim(claims, this.ClaimsTypeEmailAddress),
          provider_name: info['provider_name'],
          user_id: info['user_id'],
          access_token: info['access_token'],
          expires_on: info['expires_on']
        };
      }
    ));
  }

  // helper function to extract claims
  private extractClaim(claims: Array<any>, claimType: string): any {
    const claim = claims.find(x => x.typ === claimType);
    if (claim) {
      return claim.val;
    }

    // Claim type not found
    return null;
  }
}
