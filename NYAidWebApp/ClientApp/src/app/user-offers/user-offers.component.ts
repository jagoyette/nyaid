import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NyaidWebAppApiService } from '../services/nyaid-web-app-api-service';
import { NyaidUserService } from '../services/nyaid-user.service';
import { OfferInfo } from '../models/offer-info';

@Component({
  selector: 'app-user-offers',
  templateUrl: './user-offers.component.html',
  styleUrls: ['./user-offers.component.css']
})
export class UserOffersComponent implements OnInit {
  public offers: OfferInfo[];
  public showOpen: boolean;
  public showOpenOffers: string;
  private showAll: string;
  private showOpenOnly: string;

  constructor(private nyaidApiService: NyaidWebAppApiService,
    private userService: NyaidUserService,
    private router: Router) { }

  ngOnInit() {
    this.showOpenOnly = 'Show Open Only';
    this.showAll = 'Show All';
    this.showOpen = true;
    this.getAllOffers();
    this.showOpenOffers = this.showOpenOnly;
  }

  onShowOpenOffes() {
    this.showOpen = !this.showOpen;
    if (this.showOpen) {
      this.showOpenOffers = this.showOpenOnly;
      this.getAllOffers();
    } else {
      this.showOpenOffers = this.showAll;
      this.getOpenOffers();
    }
  }

  getAllOffers() {
    // Get all offers created by user first
    if (this.userService.currentUser) {
      this.nyaidApiService.getOffersCreatedByUser(this.userService.currentUser.uid, true).subscribe(data => {
        this.offers = data;
        console.log('Found ' + this.offers.length + '  offers');
      });
    }
  }

  getOpenOffers() {
    const temp: OfferInfo[] = [];

    // Get open offers
    this.offers.forEach(offer => {
      if (offer.state === 'submitted') {
        temp.push(offer);
      }
    });
    this.offers = temp;
  }
}
