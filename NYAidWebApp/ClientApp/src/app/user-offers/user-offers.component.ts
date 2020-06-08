import { Component, OnInit } from '@angular/core';

import { NyaidWebAppApiService } from '../services/nyaid-web-app-api-service';
import { RequestInfo } from '../models/request-info';
import { NyaidUserService } from '../services/nyaid-user.service';
import { OfferInfo } from '../models/offer-info';

@Component({
  selector: 'app-user-offers',
  templateUrl: './user-offers.component.html',
  styleUrls: ['./user-offers.component.css']
})
export class UserOffersComponent implements OnInit {
  public requests: RequestInfo[];
  public requestsToUser: RequestInfo[];
  public offers: OfferInfo[];
  public offer: OfferInfo;

  constructor(private nyaidApiService: NyaidWebAppApiService,
    private userService: NyaidUserService) { }

  ngOnInit() {
    // Get all requests created by user first
    if (this.userService.currentUser) {
      this.nyaidApiService.getRequestsCreatedByUser(this.userService.currentUser.uid)
        .subscribe(data => {
          this.requests = data;
          console.log('Found ' + this.requests.length + ' requests');
      });

      this.nyaidApiService.getOffersCreatedByUser(this.userService.currentUser.uid)
        .subscribe(data => {
          this.offers = data;
          console.log('Found ' + this.offers.length + ' requestsToUser');
      });

/*       this.nyaidApiService.getOffer(this.requests[0].requestId, this.offers[0].offerId)
        .subscribe(data => {
          this.offer = data;
          console.log('Found ' + this.offer.description + ' offers');
      }); */
    }
  }
}
