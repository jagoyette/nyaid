import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NyaidWebAppApiService } from '../services/nyaid-web-app-api-service';
import { RequestInfo } from '../models/request-info';

@Component({
  selector: 'app-user-requests',
  templateUrl: './user-requests.component.html',
  styleUrls: ['./user-requests.component.css']
})
export class UserRequestsComponent implements OnInit {
  public requests: RequestInfo[];

  constructor(private nyaidApiService: NyaidWebAppApiService,
    private router: Router) { }

  ngOnInit() {
    this.nyaidApiService.getAllRequests().subscribe(data => {
      this.requests = data;
      console.log('Found ' + this.requests.length + ' requests');
    });
  }

  onUpdateRequest(request: RequestInfo): void {
    this.router.navigate(['requests', request.requestId, 'update']);
  }

}
