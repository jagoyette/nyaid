import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';

import { NyaidWebAppApiService } from '../services/nyaid-web-app-api-service';
import { RequestInfo } from '../models/request-info';
import { OfferInfo } from '../models/offer-info';
import { AcceptRejectOfferInfo } from '../models/acceptrejectOffer-info';

@Component({
  selector: 'app-respond-to-offer-dlg',
  templateUrl: './respond-to-offer-dlg.component.html',
  styleUrls: ['./respond-to-offer-dlg.component.css']
})
export class RespondToOfferDlgComponent implements OnInit {
  public request: RequestInfo = new RequestInfo();
  public offers: OfferInfo[] = [];
  public offer: OfferInfo = new OfferInfo();

  constructor(public activeModal: NgbActiveModal,
    private nyaidApiService: NyaidWebAppApiService,
    private route: ActivatedRoute) { }

  ngOnInit() {
  }
  
  onAcceptOffer(): void {
    const ar: AcceptRejectOfferInfo = {
      isAccepted: true,
      reason: ''
    };

    this.nyaidApiService.acceptOffer(this.offer.requestId, this.offer.offerId, ar).subscribe(data => {
      console.log('Offer was accepted');
      this.offer = data;
    });
  }

  onRejectOffer(): void {
    const ar: AcceptRejectOfferInfo = {
      isAccepted: false,
      reason: ''
    };

    this.nyaidApiService.acceptOffer(this.offer.requestId, this.offer.offerId, ar).subscribe(data => {
      console.log('Offer was rejected');
      this.offer = data;
    });
  }

  onSubmit(): void {
    console.log('onSubmit was clicled');
  }

}
