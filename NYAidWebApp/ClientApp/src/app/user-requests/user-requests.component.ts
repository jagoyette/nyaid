import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NyaidWebAppApiService } from '../services/nyaid-web-app-api-service';
import { RequestInfo } from '../models/request-info';
import { NyaidUserService } from '../services/nyaid-user.service';
import { OfferInfo } from '../models/offer-info';
import { AcceptRejectOfferInfo } from '../models/acceptrejectOffer-info';

@Component({
  selector: 'app-user-requests',
  templateUrl: './user-requests.component.html',
  styleUrls: ['./user-requests.component.css']
})
export class UserRequestsComponent implements OnInit {
  public requests: RequestInfo[];


  constructor(private nyaidApiService: NyaidWebAppApiService,
    private userService: NyaidUserService,
    private router: Router) { }

  ngOnInit() {
    if (this.userService.currentUser) {
      this.nyaidApiService.getRequestsCreatedByUser(this.userService.currentUser.uid).subscribe(data => {
        this.requests = data;
        console.log('Found ' + this.requests.length + ' requests');

        // Retrieve all offers for each request
        this.requests.forEach(request => {
          this.nyaidApiService.getAllOffers(request.requestId).subscribe(offers => {
            console.log(`Request ${request.requestId} has ${offers.length} offers`);
            if (offers.length > 0) {
              request['offers'] = offers;
            }
          });
        });
      });
    }
  }

  onUpdateRequest(request: RequestInfo): void {
    this.router.navigate(['requests', request.requestId, 'update']);
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
