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

  constructor(private nyaidApiService: NyaidWebAppApiService,
    private userService: NyaidUserService) { }

  ngOnInit() {
    // Get all requests created by user first
    if (this.userService.currentUser) {
      this.nyaidApiService.getOffersCreatedByUser(this.userService.currentUser.uid, 'true')
        .subscribe(data => {
          this.offers = data;
          console.log('Found ' + this.offers.length + ' requestsToUser');
      });
    }
  }
}
