import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NyaidWebAppApiService } from '../services/nyaid-web-app-api-service';
import { RequestInfo } from '../models/request-info';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})
export class RequestComponent implements OnInit {
  request: RequestInfo;

  constructor(private nyaidApiService: NyaidWebAppApiService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    // The desired route Id should be extracted from query params
    // and used to populate this.request
    const requestId = this.route.snapshot.paramMap.get('Id');
    this.nyaidApiService.getRequest(requestId).subscribe(data => {
      this.request = data;
      console.log('Found ' + this.request + ' request');
    });
  }
}
