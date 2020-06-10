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
  public request: RequestInfo;
  public offers: OfferInfo[];
  public offer: OfferInfo;
  public acceptRejectOffer: AcceptRejectOfferInfo = new AcceptRejectOfferInfo();

  constructor(private nyaidApiService: NyaidWebAppApiService,
    private userService: NyaidUserService,
    private router: Router) { }

  ngOnInit() {
    if (this.userService.currentUser) {
      this.nyaidApiService.getRequestsCreatedByUser(this.userService.currentUser.uid)
        .subscribe(data => {
          this.requests = data;
          console.log('Found ' + this.requests.length + ' requests');
        });

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

  onUpdateRequest(request: RequestInfo): void {
    this.router.navigate(['requests', request.requestId, 'update']);
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
    });  
  }
}
