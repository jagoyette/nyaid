import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
  public offers: OfferInfo[];
  public request: RequestInfo;
  public offer: OfferInfo;

  constructor(private nyaidApiService: NyaidWebAppApiService,
    private userService: NyaidUserService,
    private router: Router) { }

  ngOnInit() {
    // Get all offers created by user first
    if (this.userService.currentUser) {
        this.nyaidApiService.getOffersCreatedByUser(this.userService.currentUser.uid, 'true')
        .subscribe(data => {
          this.offers = data;
          console.log('Found ' + this.offers.length + ' requestsToUser');

          this.offers.forEach(offer => {
            console.log(offer);
            this.nyaidApiService.getRequest(offer.requestId).subscribe(data => {
              this.request = data;
              this.offer = offer;
            });
          });
      });
    } else {
      console.log('Unable to retrieve current user');
      this.router.navigate(['login']);
    }
  }
}
