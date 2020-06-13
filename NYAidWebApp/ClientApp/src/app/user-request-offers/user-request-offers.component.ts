import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NyaidWebAppApiService } from '../services/nyaid-web-app-api-service';
import { RequestInfo } from '../models/request-info';
import { OfferInfo } from '../models/offer-info';
import { AcceptRejectOfferInfo } from '../models/acceptrejectOffer-info';

@Component({
  selector: 'app-user-request-offers',
  templateUrl: './user-request-offers.component.html',
  styleUrls: ['./user-request-offers.component.css']
})
export class UserRequestOffersComponent implements OnInit {
  public request: RequestInfo = new RequestInfo();
  public offers: OfferInfo[] = [];

  constructor(private nyaidApiService: NyaidWebAppApiService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    // The desired route Id should be extracted from query params
    // and used to populate this request
    const requestId = this.route.snapshot.paramMap.get('Id');
    this.nyaidApiService.getRequest(requestId).subscribe(data => {
      this.request = data;

      // Retrieve all offers for the request
      this.nyaidApiService.getAllOffers(this.request.requestId).subscribe(offers => {
        console.log(`Request ${this.request.requestId} has ${offers.length} offers`);
        if (offers.length > 0) {
          this.offers = offers;
        }
      });
    });
  }

  onAcceptOffer(offer: OfferInfo): void {
    const ar: AcceptRejectOfferInfo = {
      isAccepted: true,
      reason: ''
    };

    this.nyaidApiService.acceptOffer(offer.requestId, offer.offerId, ar).subscribe(data => {
      console.log('Offer was accepted');
      offer = data;
    });
  }

  onRejectOffer(offer: OfferInfo): void {
    const ar: AcceptRejectOfferInfo = {
      isAccepted: false,
      reason: ''
    };

    this.nyaidApiService.acceptOffer(offer.requestId, offer.offerId, ar).subscribe(data => {
      console.log('Offer was rejected');
      offer = data;
    });
  }

}
