import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { NyaidWebAppApiService } from '../services/nyaid-web-app-api-service';
import { RequestInfo } from '../models/request-info';
import { OfferInfo } from '../models/offer-info';
import { RespondToOfferDlgComponent } from '../respond-to-offer-dlg/respond-to-offer-dlg.component';

@Component({
  selector: 'app-user-request-offers',
  templateUrl: './user-request-offers.component.html',
  styleUrls: ['./user-request-offers.component.css']
})
export class UserRequestOffersComponent implements OnInit {
  public request: RequestInfo = new RequestInfo();
  public offers: OfferInfo[] = [];

  constructor(private nyaidApiService: NyaidWebAppApiService,
    private route: ActivatedRoute,
    private modalService: NgbModal) { }

  ngOnInit() {
    // The desired route Id should be extracted from query params
    // and used to populate this request
    this.request.requestId = this.route.snapshot.paramMap.get('Id');
    this.nyaidApiService.getRequest(this.request.requestId).subscribe(data => {
      this.request = data;

      // Get all offers for this request
      this.retrieveAllOffers(this.request.requestId);
    });
  }

  retrieveAllOffers(requestId: string): void {
    // Retrieve all offers for the request
    this.nyaidApiService.getAllOffers(requestId).subscribe(offers => {
      console.log(`Request ${requestId} has ${offers.length} offers`);
      if (offers.length > 0) {
        this.offers = offers;
      }
    });
  }

  onRespondToOffer(offer: OfferInfo): void {
    // Create the dialog and show it
    const modalRef = this.modalService.open(RespondToOfferDlgComponent);
    modalRef.componentInstance.offer = offer;

    // Update the offer data after dialog is closed
    modalRef.result.then(data => {
      // Dialog dismissed
      console.log('Successfully responded to offer');

      // Update the request in case it changed state
      this.nyaidApiService.getRequest(this.request.requestId).subscribe(request => {
        this.request = request;
      });

      // Update the offer info
      this.retrieveAllOffers(this.request.requestId);

    });
  }
}
