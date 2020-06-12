import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NyaidWebAppApiService } from '../services/nyaid-web-app-api-service';
import { RequestInfo } from '../models/request-info';

@Component({
  selector: 'app-user-request-offers',
  templateUrl: './user-request-offers.component.html',
  styleUrls: ['./user-request-offers.component.css']
})
export class UserRequestOffersComponent implements OnInit {
  public request: RequestInfo = new RequestInfo();

  constructor(private nyaidApiService: NyaidWebAppApiService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    // The desired route Id should be extracted from query params
    // and used to populate this request
    const requestId = this.route.snapshot.paramMap.get('Id');
    this.nyaidApiService.getRequest(requestId).subscribe(data => {
      this.request = data;
    });
  }

}
