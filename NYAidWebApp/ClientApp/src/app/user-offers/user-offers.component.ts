import { Component, OnInit } from '@angular/core';

import { NyaidWebAppApiService } from '../services/nyaid-web-app-api-service';
import { RequestInfo } from '../models/request-info';
import { NyaidUserService } from '../services/nyaid-user.service';

@Component({
  selector: 'app-user-offers',
  templateUrl: './user-offers.component.html',
  styleUrls: ['./user-offers.component.css']
})
export class UserOffersComponent implements OnInit {
  public requests: RequestInfo[];

  constructor(private nyaidApiService: NyaidWebAppApiService,
    private userService: NyaidUserService) { }

  ngOnInit() {
    // Get all requests created by user first
    if (this.userService.currentUser) {
    }
  }
}
