import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NyaidWebAppApiService } from '../services/nyaid-web-app-api-service';
import { RequestInfo } from '../models/request-info';
import { NyaidUserService } from '../services/nyaid-user.service';

@Component({
  selector: 'app-user-requests',
  templateUrl: './user-requests.component.html',
  styleUrls: ['./user-requests.component.css']
})
export class UserRequestsComponent implements OnInit {
  public requests: RequestInfo[];

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
  /*   TODO: Figure out how to get the offerId for the request???
    this.nyaidApiService.getOffer(request.requestId, )
        .subscribe(data => {
          this.requests = data;
          console.log('Found ' + this.requests.length + ' requests');
        });     */
  }

  onRejectOffer(request: RequestInfo): void {
    console.log('onRejectOffer called');
  }
}
