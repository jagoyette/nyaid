import { Component, OnInit } from '@angular/core';

import { NyaidWebAppApiService } from '../services/nyaid-web-app-api-service';
import { RequestInfo } from '../models/request-info';
import { NyaidUserService } from '../services/nyaid-user.service';
import { OfferInfo } from '../models/offer-info';
import { AcceptRejectOfferInfo } from '../models/acceptrejectOffer-info';

@Component({
  selector: 'app-user-offers',
  templateUrl: './user-offers.component.html',
  styleUrls: ['./user-offers.component.css']
})
export class UserOffersComponent implements OnInit {
  public requests: RequestInfo[];
  public request: RequestInfo;
  public offers: OfferInfo[];
  public offer: OfferInfo;
  public acceptRejectOffer: AcceptRejectOfferInfo = new AcceptRejectOfferInfo();

  constructor(private nyaidApiService: NyaidWebAppApiService,
    private userService: NyaidUserService) { }

  ngOnInit() {
    // Get all requests created by user first
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
    }
  }

  onAcceptOffer(request: RequestInfo): void {
    console.log('onAcceptOffer called');
    this.acceptRejectOffer.isAccepted = true;
    this.nyaidApiService.acceptOffer(request.requestId, this.offer.offerId, this.acceptRejectOffer).subscribe(data => {
      this.offer = data;
    });
  }

  onRejectOffer(request: RequestInfo): void {
    console.log('onRejectOffer called');
    this.acceptRejectOffer.isAccepted = false;
    this.nyaidApiService.acceptOffer(request.requestId, this.offer.offerId, this.acceptRejectOffer).subscribe(data => {
      this.offer = data;
    });  }

}
