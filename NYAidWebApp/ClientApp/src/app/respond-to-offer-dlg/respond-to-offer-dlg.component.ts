import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import { NyaidWebAppApiService } from '../services/nyaid-web-app-api-service';
import { OfferInfo } from '../models/offer-info';
import { AcceptRejectOfferInfo } from '../models/acceptrejectoffer-info';

@Component({
  selector: 'app-respond-to-offer-dlg',
  templateUrl: './respond-to-offer-dlg.component.html',
  styleUrls: ['./respond-to-offer-dlg.component.css']
})
export class RespondToOfferDlgComponent implements OnInit {
  public offer: OfferInfo = new OfferInfo();

  constructor(public activeModal: NgbActiveModal,
    private nyaidApiService: NyaidWebAppApiService,
    private modalService: NgbModal) {
  }

  ngOnInit() {
  }

  onAcceptOffer(reason: string): void {
    const ar: AcceptRejectOfferInfo = {
      isAccepted: true,
      reason: reason
    };

    this.nyaidApiService.acceptOffer(this.offer.requestId, this.offer.offerId, ar).subscribe(data => {
      console.log('Offer was accepted' + ' ' + reason);
      this.offer = data;
      this.activeModal.close(this.offer);
    });
  }

  onRejectOffer(reason: string): void {
    const ar: AcceptRejectOfferInfo = {
      isAccepted: false,
      reason: reason
    };

    this.nyaidApiService.acceptOffer(this.offer.requestId, this.offer.offerId, ar).subscribe(data => {
      console.log('Offer was rejected' + ' ' + reason);
      this.offer = data;
      this.activeModal.close(this.offer);
    });
  }

}
