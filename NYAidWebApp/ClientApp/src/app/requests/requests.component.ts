import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { NyaidWebAppApiService } from '../services/nyaid-web-app-api-service';
import { RequestInfo } from '../models/request-info';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css']
})
export class RequestsComponent implements OnInit {

  public requests: RequestInfo[];

  constructor(private http: HttpClient,
    private router: Router,
    private nyaidApiService: NyaidWebAppApiService) {
    }

  ngOnInit() {
    this.nyaidApiService.getAllRequests().subscribe(data => {
      this.requests = data;
    });
  }

  onAssignRequest(request: RequestInfo): void {
    this.router.navigate(['requests', request.requestId, 'offer']);
  }

}
